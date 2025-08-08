import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MiniNavbar from '../components/MiniNavbar';
import Footer from '../components/Footer';
import ProgressSteps from '../components/ProgressSteps';
import { FiHome, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  

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
    // No sample cart - cart will be empty until products are added from shop
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    // Only save if cart is not in initial empty state
    if (cart.length > 0) {
      localStorage.setItem('flowerShopCart', JSON.stringify(cart));
    }
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

    setCart(prevCart => {
      const updatedCart = prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      localStorage.setItem('flowerShopCart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.id !== productId);
      localStorage.setItem('flowerShopCart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('flowerShopCart');
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return 250; // Fixed shipping fee as shown in design
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handlePaymentChange = (e) => {
    setSelectedPayment(e.target.value);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }
    
    // Validate payment method selection
    if (!selectedPayment) {
      alert('Please select a payment method to proceed.');
      return;
    }
    
    setIsLoading(true);
    
    // Ensure cart is saved to localStorage before navigation
    localStorage.setItem('flowerShopCart', JSON.stringify(cart));
    
    // Navigate based on payment method
    setTimeout(() => {
      setIsLoading(false);
      if (selectedPayment === 'cod') {
        navigate('/checkout');
      } else if (selectedPayment === 'online') {
        navigate('/payment');
      }
    }, 500);
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
        
        <div className="empty-cart-container">
          <div className="empty-cart-content">
            <FiShoppingBag size={80} color="#164C0D" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <button className="continue-shopping-btn" onClick={continueShopping}>
              Continue Shopping
            </button>
          </div>
        </div>
        
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
      
      <div className="cart-container">
        <ProgressSteps currentStep={1} />

        <div className="cart-content">
          <div className="cart-table-container">
            <div className="cart-table">
              <div className="cart-table-header">
                <div className="header-cell checkbox-cell"></div>
                <div className="header-cell cart-product-cell">Product</div>
                <div className="header-cell price-cell">Price</div>
                <div className="header-cell qty-cell">Qty.</div>
                <div className="header-cell subtotal-cell">Subtotal</div>
                <div className="header-cell remove-cell">Remove</div>
              </div>

              <div className="cart-table-body">
                {cart.map((item) => {
                  return (
                  <div key={item.id} className="cart-item-row">
                    <div className="item-cell checkbox-cell">
                      <input type="checkbox" className="item-checkbox" />
                    </div>
                    <div className="item-cell cart-product-cell">
                      <div className="cart-product-info">
                        <img src={item.image} alt={item.name} className="cart-product-image" />
                        <span className="cart-product-name" title={item.name}>{item.name}</span>
                      </div>
                    </div>
                    <div className="item-cell price-cell">
                      <span className="cart-price">${item.price}</span>
                    </div>
                    <div className="item-cell qty-cell">
                      <div className="quantity-controls">
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <FiMinus />
                        </button>
                        <span className="cart-quantity">{item.quantity}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>
                    <div className="item-cell subtotal-cell">
                      <span className="cart-subtotal">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="item-cell remove-cell">
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="cart-summary">
            <div className="cart-total-section">
              <div className="cart-total-header">
                <h3>Cart Total</h3>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Shipping Fee</span>
                <span className="summary-value">${calculateShipping().toFixed(2)}</span>
              </div>
              
              <div className="summary-row total-row">
                <span className="summary-label">Total</span>
                <span className="summary-value">${calculateTotal().toFixed(2)}</span>
              </div>

              <div className="payment-options">
                <label className="payment-option">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod" 
                    checked={selectedPayment === 'cod'}
                    onChange={handlePaymentChange}
                  />
                  <span>Cash On Delivery</span>
                </label>
                <label className="payment-option">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="online"
                    checked={selectedPayment === 'online'}
                    onChange={handlePaymentChange}
                  />
                  <span>Online Payment</span>
                </label>
              </div>

              {!selectedPayment && (
                <div className="payment-notice">
                  <p style={{ 
                    color: '#2196f3', 
                    fontSize: '14px', 
                    textAlign: 'center', 
                    margin: '10px 0',
                    padding: '10px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '5px',
                    border: '1px solid #bbdefb'
                  }}>
                    ℹ️ Please select a payment method to continue
                  </p>
                </div>
              )}

              <div className="cart-actions">
                <button 
                  className="checkout-btn"
                  onClick={handleCheckout}
                  disabled={isLoading || selectedPayment !== 'cod'}
                >
                  {isLoading ? 'Processing...' : selectedPayment !== 'cod' ? 'Select Cash on Delivery' : 'Check Out'}
                </button>
                <button 
                  className="continue-shopping-btn"
                  onClick={continueShopping}
                >
                  Continue Shopping
                </button>
                <button 
                  className="empty-cart-btn"
                  onClick={clearCart}
                >
                  Empty Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;