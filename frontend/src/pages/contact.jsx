import React, { useState } from 'react';
import { FiHome, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import MiniNavbar from '../components/MiniNavbar';
import MapComponent from '../components/MapComponent';
import './contact.css';
import Footer from '../components/Footer';

const Contact = () => {
  const [showFilters, setShowFilters] = useState(false);

  const breadcrumbData = [
    { icon: <FiHome size={25} color="#000000" />, label: 'Home', link: '/' },
    { label: 'Contact' }
  ];

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="contact-page">
      <Navbar />

      <MiniNavbar 
        breadcrumbs={breadcrumbData}
        showFilters={showFilters}
        onFilterToggle={handleFilterToggle}
      />
      
      {/* Contact Information Section */}
      <div className="contact-info-section">
        <div className="contact-info-container">
          <div className="contact-info-item">
            <div className="contact-icon-1">
              <FiMail />
            </div>
            <h3>Email</h3>
            <p>adoraflower@gmail.com</p>
          </div>
          
          <div className="contact-info-item">
            <div className="contact-icon-1">
              <FiPhone />
            </div>
            <h3>Phone</h3>
            <p>+94 761 234 567</p>
          </div>
          
          <div className="contact-info-item">
            <div className="contact-icon-1">
              <FiMapPin />
            </div>
            <h3>Address</h3>
            <p>No. 45, Flower Garden Road,<br />Colombo 07,<br />Sri Lanka.</p>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="map-section">
        <div className="map-section-container">
          <MapComponent />
        </div>
      </div>
      
      {/* Contact Form Section */}
      <div className="contact-form-section">
        <div className="contact-form-container">
          <form className="contact-page-form">
            <h2 className="contact-form-title">Contact Us</h2>
            <div className="contact-form-row">
              <div className="contact-form-group">
                <input 
                  type="text" 
                  placeholder="Your Name (*)" 
                  required 
                  className="contact-form-input"
                />
              </div>
              <div className="contact-form-group">
                <input 
                  type="email" 
                  placeholder="Your Email (*)" 
                  required 
                  className="contact-form-input"
                />
              </div>
            </div>
            
            <div className="contact-form-row">
              <div className="contact-form-group">
                <input 
                  type="tel" 
                  placeholder="Phone" 
                  className="contact-form-input"
                />
              </div>
              <div className="contact-form-group">
                <select className="contact-form-select">
                  <option value="">Business Department</option>
                  <option value="sales">Sales</option>
                  <option value="wedding">Wedding Flowers</option>
                  <option value="events">Event Decoration</option>
                  <option value="corporate">Corporate Orders</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>
            </div>
            
            <div className="contact-form-group">
              <textarea 
                placeholder="Your Question"
                rows="6"
                className="contact-form-textarea"
              ></textarea>
            </div>
            
            <div className="contact-form-submit">
              <button type="submit" className="contact-submit-button">
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
    
  );
  
};

export default Contact;