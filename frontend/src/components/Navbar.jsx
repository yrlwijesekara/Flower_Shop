import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Load cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('flowerShopCart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(totalCount);
      } else {
        setCartItemCount(0);
      }
    };

    // Update cart count on component mount
    updateCartCount();

    // Listen for storage changes to update cart count
    window.addEventListener('storage', updateCartCount);
    
    // Listen for custom cart update event
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking on nav links
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle cart navigation
  const handleCartClick = () => {
    closeMenu(); // Close mobile menu if open
    navigate('/cart');
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Capture current scroll position
      setScrollY(window.scrollY);
      // Apply body lock with fixed position
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
      document.body.classList.add('menu-open');
    } else {
      // Remove body lock and restore scroll position
      document.body.classList.remove('menu-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    }

    return () => {
      // Cleanup on unmount
      document.body.classList.remove('menu-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isMenuOpen, scrollY]);

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
              <button className="action-btn cart-btn" aria-label="Shopping Cart" onClick={handleCartClick}>
                <FiShoppingCart size={32} color="#164C0D" />
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount > 99 ? '99+' : cartItemCount}</span>
                )}
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
            <button className="action-btn cart-btn" aria-label="Shopping Cart" onClick={handleCartClick}>
              <FiShoppingCart size={32} color="#164C0D" />
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount > 99 ? '99+' : cartItemCount}</span>
              )}
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
