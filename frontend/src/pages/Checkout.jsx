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
    state: '',
    postcode: '',
    country: 'Sri Lanka',
    phoneNumber: '',
    emailAddress: ''
  });


  // Load cart and user data on component mount
  useEffect(() => {
    // Check if user is logged in first
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    const authToken = localStorage.getItem('authToken');
    
    if (isLoggedIn !== 'true' || !authToken) {
      console.log('User not logged in, redirecting to login page');
      navigate('/login');
      return;
    }
    
    // Fetch user data to auto-fill form
    const fetchUserData = async () => {
      try {
        console.log('Fetching user data for checkout auto-fill...');
        
        const response = await fetch('http://localhost:8000/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.success) {
            const user = data.data.user;
            console.log('User data fetched:', user);
            
            // Split name into firstName and lastName
            const nameParts = user.name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            // Auto-fill form data with user information
            setFormData(prev => ({
              ...prev,
              firstName,
              lastName,
              emailAddress: user.email || '',
              phoneNumber: user.phone || '',
              townCity: user.address?.city || '',
              state: user.address?.state || '',
              country: user.address?.country || 'Sri Lanka'
            }));
          }
        } else {
          console.warn('Failed to fetch user data for auto-fill');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    // Then check cart
    const savedCart = localStorage.getItem('flowerShopCart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      if (parsedCart && parsedCart.length > 0) {
        setCart(parsedCart);
        fetchUserData(); // Only fetch user data if cart has items
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

  const handleOrderSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Validate required fields on frontend
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.streetAddress.trim() || 
          !formData.townCity.trim() || !formData.state.trim() || !formData.postcode.trim() || 
          !formData.country.trim() || !formData.phoneNumber.trim() || !formData.emailAddress.trim()) {
        alert('Please fill in all required fields');
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
      
      // Get selected payment method from localStorage (set by cart page)
      const selectedPayment = localStorage.getItem('selectedPaymentMethod') || 'cod';
      
      // Prepare checkout data for API
      const checkoutData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        streetAddress: formData.streetAddress,
        apartment: formData.apartment,
        townCity: formData.townCity,
        state: formData.state,
        postcode: formData.postcode,
        country: formData.country,
        phoneNumber: formData.phoneNumber,
        emailAddress: formData.emailAddress,
        cartItems: cart,
        paymentMethod: selectedPayment
      };
      
      console.log('Submitting checkout data:', checkoutData);
      
      // Submit order to database
      const response = await fetch('http://localhost:8000/api/checkout/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(checkoutData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Order created successfully:', data);
        
        // Save order data for success page
        const orderData = {
          orderNumber: data.data.order.orderNumber,
          orderDate: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          shippingAddress: {
            line1: `${formData.streetAddress}${formData.apartment ? ', ' + formData.apartment : ''},`,
            line2: `${formData.townCity},`,
            line3: `${formData.postcode}.`
          },
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category || "Product",
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
            image: item.image
          })),
          pricing: {
            itemsTotal: calculateSubtotal(),
            discount: 0,
            shipping: calculateShipping(),
            tax: Math.round(calculateSubtotal() * 0.1),
            total: calculateTotal()
          },
          paymentMethod: selectedPayment
        };
        
        localStorage.setItem('orderData', JSON.stringify(orderData));
        
        setIsLoading(false);
        
        if (selectedPayment === 'online') {
          // Save checkout form data for payment page
          localStorage.setItem('checkoutFormData', JSON.stringify(formData));
          // Don't clear cart yet - payment page needs it
          // Redirect to payment page for online payment
          navigate('/payment');
        } else {
          // Clear cart after successful COD order
          localStorage.removeItem('flowerShopCart');
          localStorage.removeItem('flowerShopFullCart');
          
          // Trigger cart update event for navbar
          window.dispatchEvent(new CustomEvent('cartUpdated'));
          
          // Go directly to success page for COD
          navigate('/order-success');
        }
        
      } else {
        console.error('Order creation failed:', data.message);
        console.error('Full error response:', data);
        
        // Show more specific error message
        let errorMessage = data.message;
        if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.join(', ');
        }
        
        alert(`Order failed: ${errorMessage}`);
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(`Order failed: ${error.message}`);
      setIsLoading(false);
    }
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
              <div className="checkout-form-row">
                <div className="checkout-form-group half-width">
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
                <div className="checkout-form-group half-width">
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

              <div className="checkout-form-group">
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

              <div className="checkout-form-group">
                <input
                  type="text"
                  id="apartment"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  placeholder="Apt 56B"
                />
              </div>

              <div className="checkout-form-row">
                <div className="checkout-form-group half-width">
                  <label htmlFor="townCity">Town / City</label>
                  <input
                    type="text"
                    id="townCity"
                    name="townCity"
                    value={formData.townCity}
                    onChange={handleInputChange}
                    placeholder="Colombo"
                    required
                  />
                </div>
                <div className="checkout-form-group half-width">
                  <label htmlFor="state">State / Province</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Western Province"
                    required
                  />
                </div>
              </div>

              <div className="checkout-form-row">
                <div className="checkout-form-group half-width">
                  <label htmlFor="postcode">Postcode / Zip</label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    placeholder="10100"
                    required
                  />
                </div>
                <div className="checkout-form-group half-width">
                  <label htmlFor="country">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>

              <div className="checkout-form-group">
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

              <div className="checkout-form-group">
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
                className="checkout-order-button"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : ' ORDER'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-order-summary">
            <h3>Order Summary</h3>
            
            <div className="checkout-cart-items">
              {cart.map((item) => (
                <div key={item.id} className="checkout-cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="checkout-item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p className="price">$ {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="checkout-order-totals">
              <div className="checkout-total-row">
                <span>Subtotal:</span>
                <span>$ {calculateSubtotal()}</span>
              </div>
              <div className="checkout-total-row">
                <span>Shipping:</span>
                <span>$ {calculateShipping()}</span>
              </div>
              <div className="checkout-total-row checkout-final-total">
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
