import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MiniNavbar from '../components/MiniNavbar';
import Footer from '../components/Footer';
import { FiHome, FiCheckCircle, FiShoppingBag } from 'react-icons/fi';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any remaining cart data
    localStorage.removeItem('flowerShopCart');
  }, []);

  const breadcrumbData = [
    { 
      icon: <FiHome size={25} color="#000000" />, 
      label: 'Home',
      href: '/' 
    },
    { 
      label: 'Order Success', 
      href: '/order-success' 
    }
  ];

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="order-success-page">
      <Navbar />
      <MiniNavbar 
        breadcrumbs={breadcrumbData}
        showFilters={false}
      />
      
      <div className="order-success-container">
        <div className="order-success-content">
          <div className="success-icon">
            <FiCheckCircle size={80} color="#164C0D" />
          </div>
          
          <h1 className="success-title">Payment Successful!</h1>
          <p className="success-message">
            Thank you for your order. Your payment has been processed successfully.
          </p>
          
          <div className="order-details">
            <div className="order-info">
              <h3>Order Information</h3>
              <p><strong>Order ID:</strong> #FLW-{Date.now()}</p>
              <p><strong>Payment Method:</strong> Online Payment</p>
              <p><strong>Status:</strong> Processing</p>
            </div>
          </div>
          
          <div className="success-actions">
            <button className="primary-btn" onClick={handleContinueShopping}>
              <FiShoppingBag size={20} />
              Continue Shopping
            </button>
            <button className="secondary-btn" onClick={handleGoHome}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderSuccess;
