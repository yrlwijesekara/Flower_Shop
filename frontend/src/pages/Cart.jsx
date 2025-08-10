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
  const [selectedItems, setSelectedItems] = useState(new Set());
  

  // Load cart from localStorage on component mount
  useEffect(() => {
    const loadCartFromStorage = () => {
      // First check if there's a full cart saved (when user returns from checkout/payment)
      const savedFullCart = localStorage.getItem('flowerShopFullCart');
      const savedCart = localStorage.getItem('flowerShopCart');
      
      if (savedFullCart && savedFullCart !== '[]' && savedFullCart !== 'null') {
        try {
          const parsedFullCart = JSON.parse(savedFullCart);
          if (Array.isArray(parsedFullCart) && parsedFullCart.length > 0) {
            setCart(parsedFullCart);
            // Clear the full cart storage since we've loaded it
            localStorage.removeItem('flowerShopFullCart');
            // Update the regular cart with the full cart
            localStorage.setItem('flowerShopCart', JSON.stringify(parsedFullCart));
            return;
          }
        } catch (error) {
          console.error('Error parsing full cart from localStorage:', error);
        }
      }
      
      // Load regular cart if no full cart found
      if (savedCart && savedCart !== '[]' && savedCart !== 'null') {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart) && parsedCart.length > 0) {
            setCart(parsedCart);
          } else {
            setCart([]);
          }
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
          setCart([]);
        }
      } else {
        setCart([]);
      }
    };

    loadCartFromStorage();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'flowerShopCart') {
        loadCartFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
    return cart
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return selectedItems.size > 0 ? 250 : 0; // Only charge shipping if items are selected
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handlePaymentChange = (e) => {
    setSelectedPayment(e.target.value);
  };

  const handleItemSelection = (productId) => {
    setSelectedItems(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cart.length) {
      // If all items are selected, deselect all
      setSelectedItems(new Set());
    } else {
      // Select all items
      setSelectedItems(new Set(cart.map(item => item.id)));
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }
    
    // Validate item selection
    if (selectedItems.size === 0) {
      alert('Please select at least one item to proceed with checkout.');
      return;
    }
    
    // Validate payment method selection
    if (!selectedPayment) {
      alert('Please select a payment method to proceed.');
      return;
    }
    
    setIsLoading(true);
    
    // Filter only selected items for checkout
    const selectedCartItems = cart.filter(item => selectedItems.has(item.id));
    
    // Save the full original cart (to preserve unchecked items when user returns)
    localStorage.setItem('flowerShopFullCart', JSON.stringify(cart));
    
    // Save selected items for checkout process
    localStorage.setItem('flowerShopCart', JSON.stringify(selectedCartItems));
    
    // Save selected payment method to localStorage
    localStorage.setItem('selectedPaymentMethod', selectedPayment);
    
    // Navigate to checkout page for both payment types (checkout page will handle the routing)
    setTimeout(() => {
      setIsLoading(false);
      navigate('/checkout');
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
                <div className="header-cell checkbox-cell">
                  <input 
                    type="checkbox" 
                    className="select-all-checkbox"
                    checked={selectedItems.size === cart.length && cart.length > 0}
                    onChange={handleSelectAll}
                  />
                </div>
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
                      <input 
                        type="checkbox" 
                        className="item-checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => handleItemSelection(item.id)}
                      />
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

              {selectedItems.size === 0 && (
                <div className="selection-notice">
                  <p style={{ 
                    color: '#ff9800', 
                    fontSize: '14px', 
                    textAlign: 'center', 
                    margin: '10px 0',
                    padding: '10px',
                    backgroundColor: '#fff3e0',
                    borderRadius: '5px',
                    border: '1px solid #ffcc02'
                  }}>
                    ⚠️ Please select items to checkout by ticking the checkboxes
                  </p>
                </div>
              )}

              {!selectedPayment && selectedItems.size > 0 && (
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
                  disabled={isLoading || !selectedPayment || selectedItems.size === 0}
                >
                  {isLoading ? 'Processing...' : 
                   selectedItems.size === 0 ? 'Select Items to Checkout' :
                   !selectedPayment ? 'Select Payment Method' : 
                   `Check Out (${selectedItems.size} item${selectedItems.size > 1 ? 's' : ''})`}
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