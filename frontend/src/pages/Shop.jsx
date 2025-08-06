import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import MiniNavbar from '../components/MiniNavbar';
import { FiHome, FiMic } from 'react-icons/fi';
import { BiSearch } from 'react-icons/bi';
import './Shop.css';

const Shop = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

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
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h2>
            {activeTab === 'recent' && 'Recent Items'}
            {activeTab === 'popular' && 'Popular Items'}
            {activeTab === 'special' && 'Special Offers For You'}
          </h2>
          <p>Content for {activeTab} tab will be displayed here.</p>
          {searchQuery && (
            <p>Search results for: "{searchQuery}"</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;