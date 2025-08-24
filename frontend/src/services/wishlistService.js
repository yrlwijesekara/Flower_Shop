import { wishlistAPI } from './api.js';

// Storage management for authenticated users
const STORAGE_KEYS = {
  WISHLIST_CACHE: 'flowerShopWishlistCache',
  LOCAL_FAVORITES: 'flowerShopFavorites' // Keep for cleanup
};

class WishlistService {
  constructor() {
    this.isAuthenticated = false;
    this.cache = new Map();
    this.listeners = new Set();
    this.loadingPromise = null; // Prevent multiple simultaneous loads
    this.lastLoadTime = 0;
    this.LOAD_DEBOUNCE_MS = 1000; // Minimum time between loads
  }

  // Initialize the service for authenticated user
  async init() {
    try {
      const authToken = this.getAuthToken();
      
      if (!authToken) {
        console.log('No auth token found, wishlist disabled');
        this.isAuthenticated = false;
        this.cache.clear();
        this.clearLocalData();
        this.notifyListeners();
        return;
      }

      console.log('Initializing wishlist service for authenticated user');
      this.isAuthenticated = true;
      
      // Load wishlist from database
      await this.loadWishlist();
      console.log('Wishlist service initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize wishlist service:', error);
      this.isAuthenticated = false;
      this.cache.clear();
      this.notifyListeners();
    }
  }

  // Get authentication token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Check if user is authenticated
  isUserAuthenticated() {
    return this.isAuthenticated && !!this.getAuthToken();
  }

  // Load wishlist from database
  async loadWishlist() {
    if (!this.isUserAuthenticated()) {
      console.log('User not authenticated, skipping wishlist load');
      return;
    }
    
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
      const authToken = this.getAuthToken();
      const response = await wishlistAPI.getWishlist(authToken);
      
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
        this.updateCache();
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

  // Check if product is in wishlist
  isInWishlist(productId) {
    if (!this.isUserAuthenticated()) {
      console.log('User not authenticated, wishlist check disabled');
      return false;
    }
    
    const result = this.cache.has(productId?.toString());
    console.log(`Checking if product ${productId} is in wishlist:`, result);
    return result;
  }

  // Add product to wishlist
  async addToWishlist(productId) {
    const productIdStr = productId?.toString();
    if (!productIdStr) return false;

    if (!this.isUserAuthenticated()) {
      console.log('User not authenticated, cannot add to wishlist');
      return false;
    }

    try {
      const authToken = this.getAuthToken();
      const response = await wishlistAPI.addToWishlist(productIdStr, authToken);
      
      if (response.success) {
        this.cache.set(productIdStr, true);
        this.updateCache();
        this.notifyListeners();
        return true;
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
    
    return false;
  }

  // Remove product from wishlist
  async removeFromWishlist(productId) {
    const productIdStr = productId?.toString();
    if (!productIdStr) return false;

    if (!this.isUserAuthenticated()) {
      console.log('User not authenticated, cannot remove from wishlist');
      return false;
    }

    try {
      const authToken = this.getAuthToken();
      const response = await wishlistAPI.removeFromWishlist(productIdStr, authToken);
      
      if (response.success) {
        this.cache.delete(productIdStr);
        this.updateCache();
        this.notifyListeners();
        return true;
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
    
    return false;
  }

  // Toggle product in wishlist
  async toggleWishlist(productId) {
    const productIdStr = productId?.toString();
    if (!productIdStr) return false;

    if (!this.isUserAuthenticated()) {
      console.log('User not authenticated, cannot toggle wishlist');
      return false;
    }

    try {
      const authToken = this.getAuthToken();
      const response = await wishlistAPI.toggleWishlist(productIdStr, authToken);
      
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
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
    
    return false;
  }

  // Get all wishlist product IDs
  getWishlistIds() {
    if (!this.isUserAuthenticated()) {
      return [];
    }
    return Array.from(this.cache.keys());
  }

  // Get wishlist count
  getCount() {
    if (!this.isUserAuthenticated()) {
      return 0;
    }
    return this.cache.size;
  }

  // Clear entire wishlist
  async clearWishlist() {
    if (!this.isUserAuthenticated()) {
      console.log('User not authenticated, cannot clear wishlist');
      return false;
    }

    try {
      const authToken = this.getAuthToken();
      const response = await wishlistAPI.clearWishlist(authToken);
      
      if (response.success) {
        this.cache.clear();
        this.updateCache();
        this.notifyListeners();
        return true;
      }
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
    }
    
    return false;
  }

  // Clear local data when user logs out
  clearLocalData() {
    this.cache.clear();
    localStorage.removeItem(STORAGE_KEYS.WISHLIST_CACHE);
    localStorage.removeItem(STORAGE_KEYS.LOCAL_FAVORITES); // Cleanup old data
    this.notifyListeners();
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

  // Handle user logout
  handleLogout() {
    console.log('User logged out, clearing wishlist data');
    this.isAuthenticated = false;
    this.clearLocalData();
  }

  // Handle user login
  async handleLogin() {
    console.log('User logged in, initializing wishlist');
    await this.init();
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

  // Get service info
  getServiceInfo() {
    return {
      isAuthenticated: this.isAuthenticated,
      count: this.getCount(),
      hasAuthToken: !!this.getAuthToken()
    };
  }
}

// Create singleton instance
const wishlistService = new WishlistService();

// Listen for auth changes to reinitialize
const handleAuthChange = () => {
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    wishlistService.handleLogin();
  } else {
    wishlistService.handleLogout();
  }
};

// Listen for storage changes (for auth token changes)
window.addEventListener('storage', (e) => {
  if (e.key === 'authToken') {
    handleAuthChange();
  }
});

// Listen for custom auth change events
window.addEventListener('authChange', handleAuthChange);

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