import React from 'react';
import './OrderSuccess.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProgressSteps from '../components/ProgressSteps';

const OrderSuccess = () => {
  // Sample order data - in a real app, this would come from props or state
  const orderData = {
    orderNumber: "26953",
    orderDate: "15 Aug 2025",
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
      shipping: 25,
      tax: 5,
      total: 288
    }
  };

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
    <div className="order-success-page">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <div className="breadcrumb-container">
          <span className="breadcrumb-item">🏠</span>
          <span className="breadcrumb-arrow">➤</span>
          <span className="breadcrumb-item">Checkout</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="progress-section">
        <ProgressSteps currentStep={3} />
      </div>

      {/* Main Content */}
      <div className="order-success-container">
        <div className="order-content">
          {/* Header Section */}
          <div className="order-header">
            <h1 className="order-number">Order #{orderData.orderNumber}</h1>
            <h2 className="thank-you-title">Thank You for Your Purchase !</h2>
            <p className="thank-you-message">
              Thanks for shopping with us. We've received your order and we're already getting 
              started on it. You'll get an email soon with all the details.
            </p>
          </div>

          {/* Order Details Section */}
          <div className="order-details-section">
            <div className="order-info-grid">
              <div className="order-info-item">
                <h3 className="section-title">Order Numbers</h3>
                <p className="section-content">{orderData.orderNumber}</p>
              </div>
              <div className="order-info-item">
                <h3 className="section-title">Order Date</h3>
                <p className="section-content">{orderData.orderDate}</p>
              </div>
            </div>

            <div className="shipping-address">
              <h3 className="section-title">Shipping Address</h3>
              <div className="address-content">
                <p>{orderData.shippingAddress.line1}</p>
                <p>{orderData.shippingAddress.line2}</p>
                <p>{orderData.shippingAddress.line3}</p>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="items-section">
            <div className="items-header">
              <h3 className="items-title">Items</h3>
              <span className="qty-header">Qty</span>
              <span className="price-header">Price</span>
            </div>
            
            <div className="items-divider"></div>

            {orderData.items.map((item) => (
              <div key={item.id} className="item-row">
                <div className="item-image-container">
                  <img src={item.image} alt={item.name} className="item-image" />
                </div>
                <div className="item-details">
                  <h4 className="item-name">{item.name}</h4>
                  <p className="item-category">{item.category}</p>
                  <p className="item-price">$ {item.price}</p>
                  <span className="mobile-qty">Qty: {item.quantity}</span>
                  <span className="mobile-total">Total: $ {item.total}</span>
                </div>
                <div className="item-quantity">{item.quantity}</div>
                <div className="item-total">$ {item.total}</div>
              </div>
            ))}

            <div className="items-bottom-divider"></div>

            {/* Pricing Summary */}
            <div className="pricing-summary">
              <div className="pricing-row">
                <span className="pricing-label">Items Total</span>
                <span className="pricing-value">$ {orderData.pricing.itemsTotal}</span>
              </div>
              <div className="pricing-row">
                <span className="pricing-label">Discount</span>
                <span className="pricing-value">$ {orderData.pricing.discount}</span>
              </div>
              <div className="pricing-row">
                <span className="pricing-label">Shipping</span>
                <span className="pricing-value">$ {orderData.pricing.shipping}</span>
              </div>
              <div className="pricing-row">
                <span className="pricing-label">Tax</span>
                <span className="pricing-value">$ {orderData.pricing.tax}</span>
              </div>
            </div>

            <div className="total-divider"></div>

            <div className="total-section">
              <div className="total-row">
                <span className="total-label">Total</span>
                <span className="total-value">$ {orderData.pricing.total}</span>
              </div>
              <button className="share-button" onClick={handleShare}>
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
