import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSuccess.css';
import Navbar from '../components/Navbar';
import MiniNavbar from '../components/MiniNavbar';
import Footer from '../components/Footer';
import ProgressSteps from '../components/ProgressSteps';
import { FiHome } from 'react-icons/fi';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

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
      label: 'Order Success', 
      href: '/order-success' 
    }
  ];

  // Load order data from localStorage on component mount
  useEffect(() => {
    // Check if user is logged in first
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    const authToken = localStorage.getItem('authToken');
    
    if (isLoggedIn !== 'true' || !authToken) {
      console.log('User not logged in, redirecting to login page');
      navigate('/login');
      return;
    }
    
    const loadOrderData = () => {
      // Get order data from localStorage
      const storedOrderData = localStorage.getItem('orderData');

      if (storedOrderData) {
        // Use stored order data
        const orderData = JSON.parse(storedOrderData);
        setOrderData(orderData);
        
        // Ensure purchased items are removed from cart
        const savedFullCart = localStorage.getItem('flowerShopFullCart');
        if (savedFullCart) {
          try {
            const fullCart = JSON.parse(savedFullCart);
            const purchasedItemIds = orderData.items.map(item => item.id);
            const remainingItems = fullCart.filter(item => !purchasedItemIds.includes(item.id));
            
            if (remainingItems.length > 0) {
              localStorage.setItem('flowerShopCart', JSON.stringify(remainingItems));
            } else {
              localStorage.setItem('flowerShopCart', JSON.stringify([]));
            }
            // Always clear the full cart after successful purchase
            localStorage.removeItem('flowerShopFullCart');
            
            // Trigger cart update event for navbar
            window.dispatchEvent(new CustomEvent('cartUpdated'));
          } catch (error) {
            console.error('Error updating cart after successful order:', error);
          }
        } else {
          // If no full cart exists, clear the regular cart since order was successful
          localStorage.setItem('flowerShopCart', JSON.stringify([]));
          // Trigger cart update event for navbar
          window.dispatchEvent(new CustomEvent('cartUpdated'));
        }
      } else {
        // Fallback to sample data if no order data found
        const fallbackOrderData = {
          orderNumber: "26953",
          orderDate: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          shippingAddress: {
            line1: "48, SRI WAJIRAGANA MAWATHA,",
            line2: "DEMATAGOA ROAD,",
            line3: "MARADANA."
          },
          items: [
            {
              id: 1,
              name: "Golden Pothos",
              category: "Pothos",
              price: 129,
              quantity: 2,
              total: 258,
              image: "/images/golden-pothos.jpg"
            }
          ],
          pricing: {
            itemsTotal: 258,
            discount: 0,
            shipping: 250,
            tax: 25,
            total: 533
          }
        };
        setOrderData(fallbackOrderData);
      }
    };

    loadOrderData();
  }, [navigate]);

  // Show loading state while order data is being processed
  if (!orderData) {
    return (
      <div className="ordersuccess-page">
        <Navbar />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          fontSize: '18px',
          color: '#164C0D'
        }}>
          Loading your order details...
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    // Handle share functionality
    if (navigator.share) {
      navigator.share({
        title: `Order #${orderData.orderNumber} - Flower Shop`,
        text: `Thank you for your purchase! Order #${orderData.orderNumber}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Order link copied to clipboard!');
    }
  };

  return (
    <div className="ordersuccess-page">
      <Navbar />
      
      <MiniNavbar 
        breadcrumbs={breadcrumbData}
        showFilters={false}
      />
      
      <div className="ordersuccess-progress-section">
        <ProgressSteps currentStep={3} />
      </div>

      {/* Main Content */}
      <div className="ordersuccess-container">
        <div className="ordersuccess-content">
          {/* Header Section */}
          <div className="ordersuccess-header">
            <h1 className="ordersuccess-number">Order #{orderData.orderNumber}</h1>
            <h2 className="ordersuccess-thank-you-title">Thank You for Your Purchase !</h2>
            <p className="ordersuccess-thank-you-message">
              Thanks for shopping with us. We've received your order and we're already getting 
              started on it. You'll get an email soon with all the details.
            </p>
          </div>

          {/* Order Details Section */}
          <div className="ordersuccess-details-section">
            <div className="ordersuccess-info-grid">
              <div className="ordersuccess-info-item">
                <h3 className="ordersuccess-section-title">Order Numbers</h3>
                <p className="ordersuccess-section-content">{orderData.orderNumber}</p>
              </div>
              <div className="ordersuccess-info-item">
                <h3 className="ordersuccess-section-title">Order Date</h3>
                <p className="ordersuccess-section-content">{orderData.orderDate}</p>
              </div>
            </div>

            <div className="ordersuccess-shipping-address">
              <h3 className="ordersuccess-section-title">Shipping Address</h3>
              <div className="ordersuccess-address-content">
                <p>{orderData.shippingAddress.line1}</p>
                <p>{orderData.shippingAddress.line2}</p>
                <p>{orderData.shippingAddress.line3}</p>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="ordersuccess-items-section">
            <div className="ordersuccess-items-header">
              <h3 className="ordersuccess-items-title">Items</h3>
              <span className="ordersuccess-qty-header">Qty</span>
              <span className="ordersuccess-price-header">Price</span>
            </div>
            
            <div className="ordersuccess-items-divider"></div>

            {orderData.items.map((item) => (
              <div key={item.id} className="ordersuccess-item-row">
                <div className="ordersuccess-item-image-container">
                  <img src={item.image} alt={item.name} className="ordersuccess-item-image" />
                </div>
                <div className="ordersuccess-item-details">
                  <h4 className="ordersuccess-item-name">{item.name}</h4>
                  <p className="ordersuccess-item-category">{item.category}</p>
                  <p className="ordersuccess-item-price">$ {item.price}</p>
                  <span className="ordersuccess-mobile-qty">Qty: {item.quantity}</span>
                  <span className="ordersuccess-mobile-total">Total: $ {item.total}</span>
                </div>
                <div className="ordersuccess-item-quantity">{item.quantity}</div>
                <div className="ordersuccess-item-total">$ {item.total}</div>
              </div>
            ))}

            <div className="ordersuccess-items-bottom-divider"></div>

            {/* Pricing Summary */}
            <div className="ordersuccess-pricing-summary">
              <div className="ordersuccess-pricing-row">
                <span className="ordersuccess-pricing-label">Items Total</span>
                <span className="ordersuccess-pricing-value">$ {orderData.pricing.itemsTotal}</span>
              </div>
              <div className="ordersuccess-pricing-row">
                <span className="ordersuccess-pricing-label">Discount</span>
                <span className="ordersuccess-pricing-value">$ {orderData.pricing.discount}</span>
              </div>
              <div className="ordersuccess-pricing-row">
                <span className="ordersuccess-pricing-label">Shipping</span>
                <span className="ordersuccess-pricing-value">$ {orderData.pricing.shipping}</span>
              </div>
              <div className="ordersuccess-pricing-row">
                <span className="ordersuccess-pricing-label">Tax</span>
                <span className="ordersuccess-pricing-value">$ {orderData.pricing.tax}</span>
              </div>
            </div>

            <div className="ordersuccess-total-divider"></div>

            <div className="ordersuccess-total-section">
              <div className="ordersuccess-total-row">
                <span className="ordersuccess-total-label">Total</span>
                <span className="ordersuccess-total-value">$ {orderData.pricing.total}</span>
              </div>
              <button className="ordersuccess-share-button" onClick={handleShare}>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
