import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MiniNavbar from '../components/MiniNavbar';
import Footer from '../components/Footer';
import { FiHome, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('flowerShopCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('flowerShopCart', JSON.stringify(cart));
  }, [cart]);

  const breadcrumbData = [
    { 
      icon: <FiHome size={25} color="#000000" />, 
      label: 'Home',
      href: '/' 
    },
    { 
      label: 'Cart', 
      href: '/cart' 
    }
  ];

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 100 ? 0 : 15; // Free shipping over $100
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const handleCheckout = () => {
    setIsLoading(true);
    // Simulate checkout process
    setTimeout(() => {
      setIsLoading(false);
      alert('Checkout functionality would be implemented here!');
    }, 1500);
  };

  const continueShopping = () => {
    navigate('/shop');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <Navbar />
        <MiniNavbar 
          breadcrumbs={breadcrumbData}
          showFilters={false}
        />
        
        <section className="cart-content">
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <FiShoppingBag size={80} color="#ccc" />
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any products to your cart yet.</p>
            <button onClick={continueShopping} className="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Navbar />
      <MiniNavbar 
        breadcrumbs={breadcrumbData}
        showFilters={false}
      />
      
      <section className="cart-content">
        <div className="cart-container">
          <div className="cart-header">
            <h1>Shopping Cart</h1>
            <span className="item-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
          </div>
          
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-category">{item.category}</p>
                    <p className="item-price">${item.price}</p>
                  </div>
                  
                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                        aria-label="Increase quantity"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                    
                    <div className="item-total">
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="remove-btn"
                      aria-label="Remove item"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="cart-actions">
                <button onClick={continueShopping} className="continue-shopping-btn">
                  Continue Shopping
                </button>
                <button onClick={clearCart} className="clear-cart-btn">
                  Clear Cart
                </button>
              </div>
            </div>
            
            {/* Cart Summary */}
            <div className="cart-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>
                
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>
                    {calculateShipping() === 0 ? (
                      <span className="free-shipping">Free</span>
                    ) : (
                      `$${calculateShipping().toFixed(2)}`
                    )}
                  </span>
                </div>
                
                {calculateShipping() === 0 && (
                  <div className="free-shipping-notice">
                    🎉 You qualify for free shipping!
                  </div>
                )}
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total-row">
                  <span>Total:</span>
                  <span className="total-amount">${calculateTotal().toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="checkout-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                
                <div className="secure-checkout">
                  🔒 Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Cart;