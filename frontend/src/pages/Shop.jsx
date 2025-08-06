import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import MiniNavbar from '../components/MiniNavbar';
import ProductGrid from '../components/ProductGrid';
import OtherProducts from '../components/OtherProducts';
import { FiHome, FiMic } from 'react-icons/fi';
import { BiSearch } from 'react-icons/bi';
import './Shop.css';

const Shop = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);

  // Sample product data based on active tab
  const getProductsByTab = (tab) => {
    const allProducts = [
      {
        id: 1,
        name: "SNAKE PLANT",
        category: "Cactus",
        price: 149,
        image: "/images/snake-plant.jpg",
        isRecent: true,
        isPopular: true,
        isSpecial: false
      },
      {
        id: 2,
        name: "CANDELABRA ALOE",
        category: "Aloe Vera",
        price: 39,
        image: "/images/candelabra-aloe.jpg",
        isRecent: false,
        isPopular: true,
        isSpecial: true
      },
      {
        id: 3,
        name: "GOLDEN POTHOS",
        category: "Pothos",
        price: 69,
        image: "/images/golden-pothos.jpg",
        isRecent: true,
        isPopular: false,
        isSpecial: true
      },
      {
        id: 4,
        name: "HOMALOMENA",
        category: "Tropical",
        price: 119,
        image: "/images/homalomena.jpg",
        isRecent: false,
        isPopular: true,
        isSpecial: false
      },
      {
        id: 5,
        name: "FIDDLE LEAF FIG",
        category: "Indoor Tree",
        price: 89,
        image: "/images/fiddle-leaf.jpg",
        isRecent: true,
        isPopular: false,
        isSpecial: true
      },
      {
        id: 6,
        name: "PEACE LILY",
        category: "Flowering",
        price: 45,
        image: "/images/peace-lily.jpg",
        isRecent: false,
        isPopular: true,
        isSpecial: true
      },
      {
        id: 7,
        name: "MONSTERA DELICIOSA",
        category: "Tropical",
        price: 79,
        image: "/images/monstera.jpg",
        isRecent: true,
        isPopular: true,
        isSpecial: false
      },
      {
        id: 8,
        name: "RUBBER PLANT",
        category: "Indoor Tree",
        price: 59,
        image: "/images/rubber-plant.jpg",
        isRecent: false,
        isPopular: false,
        isSpecial: true
      },
      {
        id: 9,
        name: "ZZ PLANT",
        category: "Low Light",
        price: 35,
        image: "/images/zz-plant.jpg",
        isRecent: true,
        isPopular: true,
        isSpecial: true
      },
      {
        id: 10,
        name: "PHILODENDRON",
        category: "Tropical",
        price: 55,
        image: "/images/philodendron.jpg",
        isRecent: false,
        isPopular: true,
        isSpecial: false
      },
      {
        id: 11,
        name: "SPIDER PLANT",
        category: "Air Purifying",
        price: 25,
        image: "/images/spider-plant.jpg",
        isRecent: true,
        isPopular: false,
        isSpecial: true
      },
      {
        id: 12,
        name: "DRACAENA",
        category: "Low Light",
        price: 65,
        image: "/images/dracaena.jpg",
        isRecent: false,
        isPopular: true,
        isSpecial: true
      }
    ];

    switch (tab) {
      case 'recent':
        return allProducts.filter(product => product.isRecent);
      case 'popular':
        return allProducts.filter(product => product.isPopular);
      case 'special':
        return allProducts.filter(product => product.isSpecial);
      default:
        return allProducts;
    }
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

  const handleFilterToggle = (isOpen) => {
    setIsFilterOpen(isOpen);
    console.log('Filters are now:', isOpen ? 'open' : 'closed');
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    console.log('Active tab:', tabName);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
  };

  const handleVoiceSearch = () => {
    console.log('Voice search activated');
    // Voice search functionality would go here
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
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <div className="shop-page">
      <Navbar />
      <MiniNavbar 
        breadcrumbs={breadcrumbData}
        showFilters={true}
        onFilterToggle={handleFilterToggle}
        isFilterOpen={isFilterOpen}
      />
      
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
            <button 
              type="button" 
              className="mic-icon"
              onClick={handleVoiceSearch}
              aria-label="Voice Search"
            >
              <FiMic size={26} color="#000000" />
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
        {/* Custom Layout: 3 rows of products + One spanning Other Products */}
        <div className="custom-product-layout">
          <div className="products-section">
            {/* First Row - 3 products */}
            <div className="product-row">
              <ProductGrid 
                products={getProductsByTab(activeTab).slice(0, 3)}
                onAddToCart={handleAddToCart}
                className="row-products-only"
              />
            </div>
            
            {/* Second Row - 3 products */}
            <div className="product-row">
              <ProductGrid 
                products={getProductsByTab(activeTab).slice(3, 6)}
                onAddToCart={handleAddToCart}
                className="row-products-only"
              />
            </div>
            
            {/* Third Row - 3 products */}
            <div className="product-row">
              <ProductGrid 
                products={getProductsByTab(activeTab).slice(6, 9)}
                onAddToCart={handleAddToCart}
                className="row-products-only"
              />
            </div>
          </div>
          
          {/* Other Products Sidebar - Spans all 3 rows */}
          <div className="other-products-sidebar">
            <OtherProducts />
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
    </div>
  );
};

export default Shop;