import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MiniNavbar from '../components/MiniNavbar';
import Footer from '../components/Footer';
import { FiHome, FiChevronRight } from 'react-icons/fi';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    apartment: '',
    townCity: '',
    postcode: '',
    phoneNumber: '',
    emailAddress: ''
  });

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('flowerShopCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      // Add some sample items for demonstration if cart is empty
      const sampleCart = [
        {
          id: 1,
          name: "Homolomena",
          price: 200,
          image: "/images/homalomena.jpg",
          quantity: 1
        },
        {
          id: 2,
          name: "Alovera",
          price: 250,
          image: "/images/candelabra-aloe.jpg",
          quantity: 1
        }
      ];
      setCart(sampleCart);
    }
  }, []);

  const breadcrumbData = [
    { 
      icon: <FiHome size={25} color="#000000" />, 
      label: 'Home',
      href: '/' 
    },
    { 
      label: 'Checkout', 
      href: '/checkout' 
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleOrderSubmit = () => {
    setIsLoading(true);
    // Simulate order processing
    setTimeout(() => {
      setIsLoading(false);
      alert('Order placed successfully!');
      // Clear cart and redirect to order complete page
      localStorage.removeItem('flowerShopCart');
      navigate('/order-complete');
    }, 2000);
  };

  // If cart is empty, redirect to cart page
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <Navbar />
      <MiniNavbar 
        breadcrumbs={breadcrumbData}
        showFilters={false}
      />
      
      <div className="checkout-container">
        {/* Progress Steps */}
        <div className="progress-steps">
          <div className="step completed">
            <div className="step-circle">
              <span>1</span>
            </div>
            <span className="step-label">Shopping Cart</span>
            <div className="step-arrow"></div>
          </div>
          
          <div className="step active">
            <div className="step-circle">
              <span>2</span>
            </div>
            <span className="step-label">Checkout Details</span>
            <div className="step-arrow"></div>
          </div>
          
          <div className="step">
            <div className="step-circle">
              <span>3</span>
            </div>
            <span className="step-label">Order Complete</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="checkout-content">
          {/* Checkout Form */}
          <div className="checkout-form">
            <form onSubmit={(e) => { e.preventDefault(); handleOrderSubmit(); }}>
              <div className="form-row">
                <div className="form-group half-width">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Jemas"
                    required
                  />
                </div>
                <div className="form-group half-width">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Von"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="streetAddress">Street address</label>
                <input
                  type="text"
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  placeholder="1234 Elm Street"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="apartment"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  placeholder="Apt 56B"
                />
              </div>

              <div className="form-group">
                <label htmlFor="townCity">Town / City</label>
                <input
                  type="text"
                  id="townCity"
                  name="townCity"
                  value={formData.townCity}
                  onChange={handleInputChange}
                  placeholder="Brooklyn"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="postcode">Postcode / Zip</label>
                <input
                  type="text"
                  id="postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleInputChange}
                  placeholder="236748"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="076 235 6789"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="emailAddress">Email Address</label>
                <input
                  type="email"
                  id="emailAddress"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  placeholder="abc@gmail.com"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="order-button"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'ORDER'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p className="price">Rs. {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>Rs. {calculateSubtotal()}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>Rs. {calculateShipping()}</span>
              </div>
              <div className="total-row final-total">
                <span>Total:</span>
                <span>Rs. {calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
