import React, { useState } from 'react';
import { FiHome, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import './MiniNavbar.css';

const MiniNavbar = ({ 
  breadcrumbs = [
    { icon: <FiHome size={25} color="#000000" />, href: '#home' },
    { label: 'Products', href: '#products' }
  ],
  showFilters = true,
  onFilterToggle = () => {},
  isFilterOpen = false,
  activeFilter = 'all',
  onFilterSelect = () => {}
}) => {
  const [filtersOpen, setFiltersOpen] = useState(isFilterOpen);

  const handleFilterToggle = () => {
    setFiltersOpen(!filtersOpen);
    onFilterToggle(!filtersOpen);
  };

  const handleFilterSelect = (filter) => {
    onFilterSelect(filter);
  };

  const filterOptions = [
    { 
      key: 'all', 
      label: 'All Products',
      description: 'Browse all available products',
      icon: '🌸'
    },
    { 
      key: 'valentine', 
      label: 'Valentine',
      description: 'Romantic flowers for special moments',
      icon: '💕'
    },
    { 
      key: 'wedding', 
      label: 'Wedding',
      description: 'Perfect arrangements for your big day',
      icon: '👰'
    },
    { 
      key: 'houseplants', 
      label: 'House Plants',
      description: 'Beautiful plants for your home',
      icon: '🪴'
    }
  ];

  return (
    <div className="mini-navbar">
      <div className="mini-navbar-container">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb-nav">
          {breadcrumbs.map((item, index) => (
            <div key={index} className="breadcrumb-item">
              {index > 0 && (
                <FiChevronRight className="breadcrumb-separator" size={24} color="#000000" />
              )}
              <a href={item.href} className="breadcrumb-link">
                {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                {item.label && <span className="breadcrumb-text">{item.label}</span>}
              </a>
            </div>
          ))}
        </div>

        {/* Filters Button */}
        {showFilters && (
          <button 
            className={`filters-btn ${filtersOpen ? 'active' : ''}`}
            onClick={handleFilterToggle}
            aria-label="Toggle Filters"
          >
            <span className="filters-text">Filters</span>
            <FiChevronDown 
              className={`filters-arrow ${filtersOpen ? 'rotated' : ''}`} 
              size={30} 
              color="#000000"
            />
          </button>
        )}
      </div>

      {/* Filter Sidebar */}
      {showFilters && filtersOpen && (
        <div className="filter-sidebar-overlay">
          <div className="filter-sidebar">
            <div className="filter-sidebar-header">
              <h3>Filter Products</h3>
              <button 
                className="filter-close-btn"
                onClick={() => setFiltersOpen(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="filter-cards-container">
              {filterOptions.map((option) => (
                <div
                  key={option.key}
                  className={`filter-card ${activeFilter === option.key ? 'active' : ''}`}
                  onClick={() => handleFilterSelect(option.key)}
                >
                  <div className="filter-card-icon">{option.icon}</div>
                  <div className="filter-card-content">
                    <h4 className="filter-card-title">{option.label}</h4>
                    <p className="filter-card-description">{option.description}</p>
                  </div>
                  <div className="filter-card-check">
                    {activeFilter === option.key && <span>✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniNavbar;