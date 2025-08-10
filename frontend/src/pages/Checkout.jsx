import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MiniNavbar from '../components/MiniNavbar';
import Footer from '../components/Footer';
import ProgressSteps from '../components/ProgressSteps';
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
    
    // Save checkout form data 
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
    
    // Get selected payment method from localStorage (set by cart page)
    const selectedPayment = localStorage.getItem('selectedPaymentMethod') || 'cod';
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (selectedPayment === 'online') {
        // Redirect to payment page for online payment
        navigate('/payment');
      } else {
        // Process COD order directly and go to success page
        processOrder('cod');
      }
    }, 1000);
  };

  const processOrder = (paymentMethod) => {
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
        line1: formData.streetAddress ? `${formData.streetAddress},` : "Address not provided,",
        line2: formData.apartment ? `${formData.apartment},` : "",
        line3: formData.townCity ? `${formData.townCity}.` : "City not provided."
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
      paymentMethod: paymentMethod
    };

    // Save order data before clearing cart
    localStorage.setItem('orderData', JSON.stringify(orderData));
    
    // Remove purchased items from full cart if it exists
    const savedFullCart = localStorage.getItem('flowerShopFullCart');
    if (savedFullCart) {
      try {
        const fullCart = JSON.parse(savedFullCart);
        const purchasedItemIds = cart.map(item => item.id);
        const remainingItems = fullCart.filter(item => !purchasedItemIds.includes(item.id));
        
        if (remainingItems.length > 0) {
          localStorage.setItem('flowerShopCart', JSON.stringify(remainingItems));
        } 
        // Always clear the full cart after successful purchase
        localStorage.removeItem('flowerShopFullCart');
      } catch (error) {
        console.error('Error updating full cart:', error);
      }
    }
    
    navigate('/order-success');
  };

  // Show loading or empty state while cart is being loaded
  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '300px',
          fontSize: '18px',
          color: '#164C0D'
        }}>
          Loading...
        </div>
        <Footer />
      </div>
    );
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
        <ProgressSteps currentStep={2} />

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
                {isLoading ? 'Processing...' : ' ORDER'}
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
                    <p className="price">$ {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>$ {calculateSubtotal()}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>$ {calculateShipping()}</span>
              </div>
              <div className="total-row final-total">
                <span>Total:</span>
                <span>$ {calculateTotal()}</span>
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
