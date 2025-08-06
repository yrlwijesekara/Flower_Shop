import React, { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking on nav links
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <img src="./navbar/nav.png" alt="Flora Shop Logo" />
        </div>

        {/* Mobile Menu Toggle */}
        <div 
          className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation Items */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a href="#home" className="nav-link active" onClick={closeMenu}>HOME</a>
            </li>
            <li className="nav-item">
              <a href="#shop" className="nav-link" onClick={closeMenu}>SHOP</a>
            </li>
            <li className="nav-item">
              <a href="#category" className="nav-link" onClick={closeMenu}>CATEGORY</a>
            </li>
            <li className="nav-item">
              <a href="#about" className="nav-link" onClick={closeMenu}>ABOUT</a>
            </li>
            <li className="nav-item">
              <a href="#contact" className="nav-link contact-link" onClick={closeMenu}>CONTACT</a>
            </li>
          </ul>

          {/* User Actions - Mobile */}
          <div className="navbar-actions mobile-actions">
            <button className="action-btn search-btn" aria-label="Search">
              <FiSearch size={32} color="#164C0D" />
            </button>
            <button className="action-btn cart-btn" aria-label="Shopping Cart">
              <FiShoppingCart size={32} color="#164C0D" />
            </button>
            <button className="action-btn user-btn" aria-label="User Account">
              <FiUser size={32} color="#164C0D" />
            </button>
          </div>
        </div>

        {/* User Actions - Desktop (Right Corner) */}
        <div className="navbar-actions desktop-actions">
          <button className="action-btn search-btn" aria-label="Search">
            <FiSearch size={32} color="#164C0D" />
          </button>
          <button className="action-btn cart-btn" aria-label="Shopping Cart">
            <FiShoppingCart size={32} color="#164C0D" />
          </button>
          <button className="action-btn user-btn" aria-label="User Account">
            <FiUser size={32} color="#164C0D" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
