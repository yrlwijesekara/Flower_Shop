import React, { useState } from 'react';
import { FiHome, FiChevronRight, FiChevronDown, FiFilter, FiX, FiCheck } from 'react-icons/fi';
import { HiSparkles, HiHeart, HiGift } from 'react-icons/hi';
import { IoLeafOutline } from 'react-icons/io5';
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
      description: 'Browse our complete collection',
      icon: <HiSparkles size={28} />,
      color: '#6366f1',
      bgColor: 'rgba(99, 102, 241, 0.1)'
    },
    { 
      key: 'valentine', 
      label: 'Valentine',
      description: 'Romantic flowers for special moments',
      icon: <HiHeart size={28} />,
      color: '#ec4899',
      bgColor: 'rgba(236, 72, 153, 0.1)'
    },
    { 
      key: 'wedding', 
      label: 'Wedding',
      description: 'Perfect arrangements for your big day',
      icon: <HiGift size={28} />,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    },
    { 
      key: 'houseplants', 
      label: 'House Plants',
      description: 'Beautiful plants for your home',
      icon: <IoLeafOutline size={28} />,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
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
            <FiFilter className="filters-icon" size={22} />
            <span className="filters-text">Filters</span>
            <FiChevronDown 
              className={`filters-arrow ${filtersOpen ? 'rotated' : ''}`} 
              size={20} 
              color="#000000"
            />
          </button>
        )}
      </div>

      {/* Filter Dropdown */}
      {showFilters && filtersOpen && (
        <div className="filter-dropdown-overlay" onClick={() => setFiltersOpen(false)}>
          <div className="filter-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="filter-dropdown-header">
              <div className="filter-header-content">
                <FiFilter size={20} className="filter-header-icon" />
                <h3>Choose Category</h3>
              </div>
              <button 
                className="filter-close-btn"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
              >
                <FiX size={18} />
              </button>
            </div>
            
            <div className="filter-options-grid">
              {filterOptions.map((option, index) => (
                <div
                  key={option.key}
                  className={`filter-option ${activeFilter === option.key ? 'active' : ''}`}
                  onClick={() => {
                    handleFilterSelect(option.key);
                    setFiltersOpen(false); // Close dropdown after selection
                  }}
                  style={{ 
                    '--option-color': option.color,
                    '--option-bg': option.bgColor,
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <div className="filter-option-icon-wrapper">
                    <div className="filter-option-icon" style={{ color: option.color }}>
                      {option.icon}
                    </div>
                    {activeFilter === option.key && (
                      <div className="filter-option-check">
                        <FiCheck size={14} />
                      </div>
                    )}
                  </div>
                  
                  <div className="filter-option-content">
                    <h4 className="filter-option-title">{option.label}</h4>
                    <p className="filter-option-description">{option.description}</p>
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