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
  isFilterOpen = false
}) => {
  const [filtersOpen, setFiltersOpen] = useState(isFilterOpen);

  const handleFilterToggle = () => {
    setFiltersOpen(!filtersOpen);
    onFilterToggle(!filtersOpen);
  };

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
    </div>
  );
};

export default MiniNavbar;