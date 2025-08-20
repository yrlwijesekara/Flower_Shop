import { wishlistAPI } from './api.js';

// Session management
const STORAGE_KEYS = {
  SESSION_ID: 'flowerShopWishlistSession',
  LOCAL_FAVORITES: 'flowerShopFavorites', // Keep for migration
  WISHLIST_CACHE: 'flowerShopWishlistCache'
};

class WishlistService {
  constructor() {
    this.sessionId = null;
    this.isInitialized = false;
    this.cache = new Map();
    this.listeners = new Set();
    this.loadingPromise = null; // Prevent multiple simultaneous loads
    this.lastLoadTime = 0;
    this.LOAD_DEBOUNCE_MS = 1000; // Minimum time between loads
  }

  // Initialize the service
  async init() {
    if (this.isInitialized) return;
    
    try {
      // Try to get existing session ID
      this.sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
      console.log('Initializing wishlist service, session ID:', this.sessionId);
      
      if (!this.sessionId) {
        // Generate new session ID
        const response = await wishlistAPI.generateSession();
        if (response.success) {
          this.sessionId = response.data.sessionId;
          localStorage.setItem(STORAGE_KEYS.SESSION_ID, this.sessionId);
          console.log('Generated new session ID:', this.sessionId);
          
          // Migrate existing localStorage favorites to database
          await this.migrateFavoritesToDatabase();
        } else {
          throw new Error('Failed to generate session ID');
        }
      }

      // Load wishlist from database
      await this.loadWishlist();
      this.isInitialized = true;
      console.log('Wishlist service initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize wishlist service:', error);
      // Fallback to localStorage mode
      this.sessionId = null;
      this.isInitialized = false;
    }
  }

  // Load wishlist from database
  async loadWishlist() {
    if (!this.sessionId) return;
    
    // Debounce loading to prevent excessive requests
    const now = Date.now();
    if (now - this.lastLoadTime < this.LOAD_DEBOUNCE_MS) {
      return;
    }
    
    // If already loading, return the existing promise
    if (this.loadingPromise) {
      return this.loadingPromise;
    }
    
    this.loadingPromise = this._doLoadWishlist();
    try {
      await this.loadingPromise;
    } finally {
      this.loadingPromise = null;
      this.lastLoadTime = Date.now();
    }
  }
  
  async _doLoadWishlist() {
    try {
      const response = await wishlistAPI.getWishlist(this.sessionId);
      if (response.success && response.data) {
        this.cache.clear();
        const productIds = response.data.products?.map(p => {
          // Handle both populated and unpopulated product references
          if (typeof p.productId === 'object' && p.productId._id) {
            return p.productId._id;
          }
          return p.productId;
        }) || [];
        
        console.log('Loaded wishlist product IDs:', productIds);
        productIds.forEach(id => this.cache.set(id.toString(), true));
        
        // Cache in localStorage for offline access
        localStorage.setItem(STORAGE_KEYS.WISHLIST_CACHE, JSON.stringify(productIds));
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      // Load from cache if database fails
      this.loadFromCache();
    }
  }

  // Load from localStorage cache
  loadFromCache() {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.WISHLIST_CACHE);
      if (cached) {
        const productIds = JSON.parse(cached);
        this.cache.clear();
        productIds.forEach(id => this.cache.set(id, true));
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to load from cache:', error);
    }
  }

  // Migrate existing localStorage favorites to database
  async migrateFavoritesToDatabase() {
    try {
      const oldFavorites = localStorage.getItem(STORAGE_KEYS.LOCAL_FAVORITES);
      if (oldFavorites) {
        const favoriteIds = JSON.parse(oldFavorites);
        
        // Add each favorite to database
        for (const productId of favoriteIds) {
          try {
            await wishlistAPI.addToWishlist(this.sessionId, productId);
          } catch (error) {
            console.error(`Failed to migrate product ${productId}:`, error);
          }
        }
        
        // Remove old localStorage data after successful migration
        localStorage.removeItem(STORAGE_KEYS.LOCAL_FAVORITES);
        console.log(`Migrated ${favoriteIds.length} favorites to database`);
      }
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }

  // Check if product is in wishlist
  isInWishlist(productId) {
    const result = this.cache.has(productId?.toString());
    console.log(`Checking if product ${productId} is in wishlist:`, result);
    return result;
  }

  // Add product to wishlist
  async addToWishlist(productId) {
    const productIdStr = productId?.toString();
    if (!productIdStr) return false;

    try {
      if (this.sessionId) {
        // Add to database
        const response = await wishlistAPI.addToWishlist(this.sessionId, productIdStr);
        if (response.success) {
          this.cache.set(productIdStr, true);
          this.updateCache();
          this.notifyListeners();
          return true;
        }
      } else {
        // Fallback to localStorage
        return this.addToLocalStorage(productIdStr);
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      // Fallback to localStorage
      return this.addToLocalStorage(productIdStr);
    }
    
    return false;
  }

  // Remove product from wishlist
  async removeFromWishlist(productId) {
    const productIdStr = productId?.toString();
    if (!productIdStr) return false;

    try {
      if (this.sessionId) {
        // Remove from database
        const response = await wishlistAPI.removeFromWishlist(this.sessionId, productIdStr);
        if (response.success) {
          this.cache.delete(productIdStr);
          this.updateCache();
          this.notifyListeners();
          return true;
        }
      } else {
        // Fallback to localStorage
        return this.removeFromLocalStorage(productIdStr);
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      // Fallback to localStorage
      return this.removeFromLocalStorage(productIdStr);
    }
    
    return false;
  }

  // Toggle product in wishlist
  async toggleWishlist(productId) {
    const productIdStr = productId?.toString();
    if (!productIdStr) return false;

    try {
      if (this.sessionId) {
        // Toggle in database
        const response = await wishlistAPI.toggleWishlist(this.sessionId, productIdStr);
        if (response.success) {
          if (response.data.isInWishlist) {
            this.cache.set(productIdStr, true);
          } else {
            this.cache.delete(productIdStr);
          }
          this.updateCache();
          this.notifyListeners();
          return response.data.isInWishlist;
        }
      } else {
        // Fallback to localStorage
        return this.toggleLocalStorage(productIdStr);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      // Fallback to localStorage
      return this.toggleLocalStorage(productIdStr);
    }
    
    return false;
  }

  // Get all wishlist product IDs
  getWishlistIds() {
    return Array.from(this.cache.keys());
  }

  // Get wishlist count
  getCount() {
    return this.cache.size;
  }

  // Clear entire wishlist
  async clearWishlist() {
    try {
      if (this.sessionId) {
        const response = await wishlistAPI.clearWishlist(this.sessionId);
        if (response.success) {
          this.cache.clear();
          this.updateCache();
          this.notifyListeners();
          return true;
        }
      } else {
        // Clear localStorage
        localStorage.removeItem(STORAGE_KEYS.LOCAL_FAVORITES);
        this.cache.clear();
        this.notifyListeners();
        return true;
      }
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
    }
    
    return false;
  }

  // LocalStorage fallback methods
  addToLocalStorage(productId) {
    try {
      const favorites = this.getLocalFavorites();
      if (!favorites.includes(productId)) {
        favorites.push(productId);
        localStorage.setItem(STORAGE_KEYS.LOCAL_FAVORITES, JSON.stringify(favorites));
        this.cache.set(productId, true);
        this.notifyListeners();
        return true;
      }
    } catch (error) {
      console.error('Local storage add failed:', error);
    }
    return false;
  }

  removeFromLocalStorage(productId) {
    try {
      const favorites = this.getLocalFavorites();
      const filtered = favorites.filter(id => id !== productId);
      localStorage.setItem(STORAGE_KEYS.LOCAL_FAVORITES, JSON.stringify(filtered));
      this.cache.delete(productId);
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Local storage remove failed:', error);
    }
    return false;
  }

  toggleLocalStorage(productId) {
    const isInWishlist = this.cache.has(productId);
    if (isInWishlist) {
      this.removeFromLocalStorage(productId);
      return false;
    } else {
      this.addToLocalStorage(productId);
      return true;
    }
  }

  getLocalFavorites() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOCAL_FAVORITES);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  }

  // Update cache in localStorage
  updateCache() {
    try {
      const productIds = Array.from(this.cache.keys());
      localStorage.setItem(STORAGE_KEYS.WISHLIST_CACHE, JSON.stringify(productIds));
    } catch (error) {
      console.error('Failed to update cache:', error);
    }
  }

  // Event listener management
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.getWishlistIds());
      } catch (error) {
        console.error('Listener callback failed:', error);
      }
    });
  }

  // Get session info
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      isInitialized: this.isInitialized,
      count: this.getCount()
    };
  }
}

// Create singleton instance
const wishlistService = new WishlistService();

// Auto-initialize on import to ensure service is ready
let initPromise = null;
const ensureInitialized = () => {
  if (!initPromise) {
    initPromise = wishlistService.init();
  }
  return initPromise;
};

// Call ensure initialized when the module loads
ensureInitialized();

export default wishlistService;