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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Get form data from checkout if available
    const storedFormData = localStorage.getItem('checkoutFormData');
    const checkoutFormData = storedFormData ? JSON.parse(storedFormData) : {};
    
    // Generate and save order data with current cart items
    const generateOrderNumber = () => {
      return Math.floor(Math.random() * 90000) + 10000;
    };

    const getCurrentDate = () => {
      const now = new Date();
      return now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };

    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + shipping + tax;

    const orderData = {
      orderNumber: generateOrderNumber().toString(),
      orderDate: getCurrentDate(),
      shippingAddress: {
        line1: checkoutFormData.streetAddress ? `${checkoutFormData.streetAddress},` : "Address not provided,",
        line2: checkoutFormData.apartment ? `${checkoutFormData.apartment},` : "",
        line3: checkoutFormData.townCity ? `${checkoutFormData.townCity}.` : "City not provided."
      },
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category || "Plant",
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
        image: item.image
      })),
      pricing: {
        itemsTotal: subtotal,
        discount: 0,
        shipping: shipping,
        tax: tax,
        total: total
      },
      paymentMethod: 'online'
    };

    // Save order data before clearing cart
    localStorage.setItem('orderData', JSON.stringify(orderData));
    
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      // Clear cart after order data is saved
      localStorage.removeItem('flowerShopCart');
      navigate('/order-success');
    }, 2000);
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
