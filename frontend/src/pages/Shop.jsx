import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import Navbar from '../components/Navbar';
import MiniNavbar from '../components/MiniNavbar';
import ProductGrid from '../components/ProductGrid';
import OtherProducts from '../components/OtherProducts';
import Footer from '../components/Footer';
import { FiHome } from 'react-icons/fi';
import { BiSearch } from 'react-icons/bi';

// Test if icons are importing correctly
console.log('Icons imported:', { FiHome, BiSearch });
import './Shop.css';

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [notification, setNotification] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('flowerShopCart');
    if (savedCart && savedCart !== '[]') {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart && parsedCart.length > 0) {
          setCart(parsedCart);
        }
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
    setIsCartLoaded(true);
  }, []);

  // Handle URL parameters and localStorage for filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const filterParam = urlParams.get('filter');
    const tabParam = urlParams.get('tab');
    const searchParam = urlParams.get('search');
    
    // Check if we're returning from a product page
    const returnFromProduct = sessionStorage.getItem('returnFromProduct');
    if (returnFromProduct) {
      // Restore previous filter state
      const savedState = JSON.parse(returnFromProduct);
      setCategoryFilter(savedState.categoryFilter || 'all');
      setActiveTab(savedState.activeTab || 'recent');
      setSearchQuery(savedState.searchQuery || '');
      setIsFilterOpen(savedState.isFilterOpen || false);
      
      // Clear the storage
      sessionStorage.removeItem('returnFromProduct');
    } else {
      // Handle URL parameters for direct navigation
      if (filterParam && ['valentine', 'wedding', 'houseplants', 'all'].includes(filterParam)) {
        setCategoryFilter(filterParam);
        setIsFilterOpen(true);
      }
      if (tabParam && ['recent', 'popular', 'special'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
      if (searchParam) {
        setSearchQuery(decodeURIComponent(searchParam));
      }
    }
  }, [location.search]);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem('flowerShopCart', JSON.stringify(cart));
      // Trigger cart update event for navbar after localStorage is updated
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
  }, [cart, isCartLoaded]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      
      try {
        const queryParams = {};
        
        // Add filters to query params
        if (categoryFilter !== 'all') {
          queryParams.filterCategory = categoryFilter;
        }
        
        if (activeTab !== 'recent') {
          queryParams.tab = activeTab;
        }
        
        if (searchQuery.trim()) {
          queryParams.search = searchQuery.trim();
        }
        
        console.log('Fetching products with params:', queryParams);
        const response = await productAPI.getProducts(queryParams);
        
        if (response.success) {
          setAllProducts(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch products');
        }
        
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message || 'Failed to load products');
        
        // Fallback to empty array on error
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter, activeTab, searchQuery]);

  // Get products for display (now returns API data directly)
  const getProductsByTab = (tab) => {
    // Since filtering is now done in the API call, just return the fetched products
    return allProducts;
  };

  const breadcrumbData = [
    { 
      icon: <FiHome size={25} color="#000000" />, 
      label: 'Home',
      href: '#home' 
    },
    { 
      label: 'Shop', 
      href: '#shop' 
    }
  ];

  // Function to update URL with current filter state
  const updateURL = ({ filter, tab, search }) => {
    const params = new URLSearchParams();
    if (filter && filter !== 'all') params.set('filter', filter);
    if (tab && tab !== 'recent') params.set('tab', tab);
    if (search && search.trim()) params.set('search', encodeURIComponent(search));
    
    const newURL = params.toString() ? `/shop?${params.toString()}` : '/shop';
    navigate(newURL, { replace: true });
  };

  // Function to save current state for return navigation
  const saveCurrentState = () => {
    const currentState = {
      categoryFilter,
      activeTab,
      searchQuery,
      isFilterOpen
    };
    sessionStorage.setItem('returnFromProduct', JSON.stringify(currentState));
  };

  const handleFilterToggle = (isOpen) => {
    setIsFilterOpen(isOpen);
    console.log('Filters are now:', isOpen ? 'open' : 'closed');
  };

  const handleCategoryFilter = (filter) => {
    setCategoryFilter(filter);
    updateURL({ filter, tab: activeTab, search: searchQuery });
    console.log('Category filter:', filter);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    updateURL({ filter: categoryFilter, tab: tabName, search: searchQuery });
    console.log('Active tab:', tabName);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateURL({ filter: categoryFilter, tab: activeTab, search: searchQuery });
  };


  const handleClearSearch = () => {
    setSearchQuery('');
    updateURL({ filter: categoryFilter, tab: activeTab, search: '' });
  };

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    
    // Show notification banner
    setNotification(`${product.name} added to cart!`);
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  return (
    <div className="shop-page">
      <Navbar />
      <MiniNavbar 
        breadcrumbs={breadcrumbData}
        showFilters={true}
        onFilterToggle={handleFilterToggle}
        isFilterOpen={isFilterOpen}
        activeFilter={categoryFilter}
        onFilterSelect={handleCategoryFilter}
      />
      
      {/* Notification */}
      {notification && (
        <div className="shop-notification">
          {notification}
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="shop-error" style={{
          backgroundColor: '#fee',
          color: 'red',
          padding: '1rem',
          margin: '1rem 2rem',
          borderRadius: '8px',
          border: '1px solid red',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      
      {/* Loading Indicator */}
      {loading && (
        <div className="shop-loading" style={{
          textAlign: 'center',
          padding: '2rem',
          fontSize: '1.2rem',
          color: '#666'
        }}>
          Loading products...
        </div>
      )}
      
      {/* Search Section */}
      <section className="search-section">
        {/* Search Bar Container */}
        <div className="search-container">
          <form onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              className="search-bar"
              placeholder="Search for flowers, plants, and more..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button 
              type="submit" 
              className="search-icon"
              aria-label="Search"
            >
              <BiSearch size={28} color="#000000" />
            </button>
          </form>
        </div>

        {/* Filter Tabs - Desktop */}
        <div className="filter-tabs desktop-filters">
          <button 
            className={`filter-tab recent ${activeTab === 'recent' ? 'active' : ''}`}
            onClick={() => handleTabClick('recent')}
          >
            <span className="tab-text">Recent</span>
          </button>
          
          <button 
            className={`filter-tab popular ${activeTab === 'popular' ? 'active' : ''}`}
            onClick={() => handleTabClick('popular')}
          >
            <span className="tab-text">Popular Items</span>
          </button>
          
          <button 
            className={`filter-tab special ${activeTab === 'special' ? 'active' : ''}`}
            onClick={() => handleTabClick('special')}
          >
            <span className="tab-text">Special Offers For you</span>
          </button>
        </div>

        {/* Mobile Filter Dropdown */}
        <div className="mobile-filter-container">
          <select 
            className="mobile-filter-select"
            value={activeTab}
            onChange={(e) => handleTabClick(e.target.value)}
          >
            <option value="recent">Recent</option>
            <option value="popular">Popular Items</option>
            <option value="special">Special Offers For you</option>
          </select>
        </div>
      </section>
      
      {/* Content based on active tab */}
      <section className="shop-content">
        {/* Search Results Info */}
        {searchQuery.trim() && (
          <div className="search-results-info">
            <p>
              {getProductsByTab(activeTab).length > 0 
                ? `Found ${getProductsByTab(activeTab).length} product(s) for "${searchQuery}"`
                : `No products found for "${searchQuery}"`
              }
              <button onClick={handleClearSearch} className="clear-search-btn">
                Clear Search
              </button>
            </p>
          </div>
        )}
        
        {/* Custom Layout: 3 rows of products + One spanning Other Products */}
        <div className="custom-product-layout">
          <div className="products-section">
            {/* Dynamic rows based on available products */}
            {(() => {
              const products = getProductsByTab(activeTab);
              
              if (products.length === 0 && searchQuery.trim()) {
                return (
                  <div className="no-results">
                    <h3>No products found</h3>
                    <p>Try searching with different keywords or browse our categories.</p>
                  </div>
                );
              }
              
              const rows = [];
              
              for (let i = 0; i < products.length; i += 3) {
                const rowProducts = products.slice(i, i + 3);
                if (rowProducts.length > 0) {
                  rows.push(
                    <div key={`row-${i}`} className="product-row">
                      <ProductGrid 
                        products={rowProducts}
                        onAddToCart={handleAddToCart}
                        onProductClick={saveCurrentState}
                        className="row-products-only"
                      />
                    </div>
                  );
                }
              }
              
              return rows;
            })()}
          </div>
          
          {/* Other Products Sidebar - Spans all 3 rows */}
          <div className="other-products-sidebar">
            <OtherProducts onAddToCart={handleAddToCart} onProductClick={saveCurrentState} />
          </div>
        </div>
        
        {/* Display cart info for demo */}
        {cart.length > 0 && (
          <div className="cart-summary" style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            margin: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>Cart ({cart.reduce((total, item) => total + item.quantity, 0)} items)</h3>
            <p>Total: ${cart.reduce((total, item) => total + (item.price * item.quantity), 0)}</p>
          </div>
        )}
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Shop;