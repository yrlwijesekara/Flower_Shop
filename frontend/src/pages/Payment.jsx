import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MiniNavbar from '../components/MiniNavbar';
import Footer from '../components/Footer';
import ProgressSteps from '../components/ProgressSteps';
import { FiHome, FiChevronDown } from 'react-icons/fi';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expirationMonth: '',
    expirationDate: '',
    cvv: ''
  });

  // Load cart from localStorage on component mount
  useEffect(() => {
    // Check if user is logged in first
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    const authToken = localStorage.getItem('authToken');
    
    if (isLoggedIn !== 'true' || !authToken) {
      console.log('User not logged in, redirecting to login page');
      navigate('/login');
      return;
    }
    
    // Then check cart
    const savedCart = localStorage.getItem('flowerShopCart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      if (parsedCart && parsedCart.length > 0) {
        setCart(parsedCart);
      } else {
        // Redirect to cart if empty
        navigate('/cart');
      }
    } else {
      // Redirect to cart if no saved cart
      navigate('/cart');
    }
  }, [navigate]);

  const breadcrumbData = [
    { 
      icon: <FiHome size={25} color="#000000" />, 
      label: 'Home',
      href: '/' 
    },
    { 
      label: 'Checkout', 
      href: '/checkout' 
    },
    { 
      label: 'Payment', 
      href: '/payment' 
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Add spaces every 4 digits
    if (value.length <= 19) { // Limit to 16 digits + 3 spaces
      setFormData(prevData => ({
        ...prevData,
        cardNumber: value
      }));
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 4) {
      setFormData(prevData => ({
        ...prevData,
        cvv: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate payment form
      if (!formData.cardNumber.trim() || !formData.expirationMonth || 
          !formData.expirationDate || !formData.cvv.trim()) {
        alert('Please fill in all payment details');
        setIsLoading(false);
        return;
      }
      
      // Get auth token
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        alert('Authentication required. Please login again.');
        navigate('/login');
        return;
      }
      
      // Get existing order data from checkout
      const storedOrderData = localStorage.getItem('orderData');
      if (!storedOrderData) {
        alert('Order data not found. Please try checking out again.');
        navigate('/checkout');
        return;
      }
      
      const orderData = JSON.parse(storedOrderData);
      console.log('Processing payment for order:', orderData.orderNumber);
      
      // Simulate payment processing (in real app, integrate with payment gateway)
      // For now, we'll just simulate a successful payment
      const paymentSuccess = await simulatePaymentProcessing();
      
      if (paymentSuccess) {
        console.log('Payment processed successfully');
        
        // Update order data with payment status
        const updatedOrderData = {
          ...orderData,
          paymentStatus: 'paid',
          paymentMethod: 'online',
          cardLastFour: formData.cardNumber.slice(-4).replace(/\s/g, '')
        };
        
        localStorage.setItem('orderData', JSON.stringify(updatedOrderData));
        
        // Clear cart after successful payment
        localStorage.removeItem('flowerShopCart');
        localStorage.removeItem('flowerShopFullCart');
        localStorage.removeItem('checkoutFormData');
        
        // Trigger cart update event for navbar
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        setIsLoading(false);
        navigate('/order-success');
        
      } else {
        throw new Error('Payment processing failed');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error.message}`);
      setIsLoading(false);
    }
  };
  
  // Simulate payment processing
  const simulatePaymentProcessing = () => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // In a real app, this would integrate with Stripe, PayPal, etc.
        // For demo purposes, always succeed
        resolve(true);
      }, 2000);
    });
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return 250; // Fixed shipping fee
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  // Generate month and date options
  const months = [
    { value: '', label: 'Month' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = [
    { value: '', label: 'Date' },
    ...Array.from({ length: 10 }, (_, i) => {
      const year = currentYear + i;
      return { value: year.toString(), label: year.toString() };
    })
  ];

  return (
    <div className="payment-page">
      <Navbar />
      <MiniNavbar 
        breadcrumbs={breadcrumbData}
        showFilters={false}
      />
      
      <div className="payment-container">
        <ProgressSteps currentStep={2} />

        <div className="payment-content">
          <div className="payment-form-container">
            <h2 className="payment-title">Card number</h2>
            
            <form onSubmit={handleSubmit} className="payment-form">
              <div className="form-group card-number-group">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="Card Number"
                  className="form-input card-number-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group expiration-group">
                  <h3 className="field-title">Expiration date</h3>
                  <div className="expiration-fields">
                    <div className="select-wrapper">
                      <select
                        name="expirationMonth"
                        value={formData.expirationMonth}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                      >
                        {months.map(month => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="select-arrow" />
                    </div>
                    
                    <div className="select-wrapper">
                      <select
                        name="expirationDate"
                        value={formData.expirationDate}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                      >
                        {years.map(year => (
                          <option key={year.value} value={year.value}>
                            {year.label}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="select-arrow" />
                    </div>
                  </div>
                </div>

                <div className="form-group cvv-group">
                  <h3 className="field-title">CVV</h3>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleCvvChange}
                    placeholder="3-4 digit code"
                    className="form-input cvv-input"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="pay-button"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'PAY'}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Payment;
