import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMenu}>HOME</Link>
              </li>
              <li className="nav-item">
                <Link to="/shop" className={`nav-link ${location.pathname === '/shop' ? 'active' : ''}`} onClick={closeMenu}>SHOP</Link>
              </li>
              <li className="nav-item">
                <Link to="/category" className={`nav-link ${location.pathname === '/category' ? 'active' : ''}`} onClick={closeMenu}>CATEGORY</Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={closeMenu}>ABOUT</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className={`nav-link contact-link ${location.pathname === '/contact' ? 'active' : ''}`} onClick={closeMenu}>CONTACT</Link>
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
