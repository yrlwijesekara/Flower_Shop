import React, { useState } from 'react';
import { FiHome, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import MiniNavbar from '../components/MiniNavbar';
import MapComponent from '../components/MapComponent';
import './contact.css';
import Footer from '../components/Footer';

const Contact = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const breadcrumbData = [
    { icon: <FiHome size={25} color="#000000" />, label: 'Home', link: '/' },
    { label: 'Contact' }
  ];

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setTimeout(() => setSuccess(false), 5000); // Hide success message after 5 seconds
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <form className="contact-page-form" onSubmit={handleSubmit}>
            <h2 className="contact-form-title">Contact Us</h2>
            
            {/* Success Message */}
            {success && (
              <div className="contact-success-message">
                ✅ Thank you! Your message has been sent successfully. We'll get back to you soon!
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="contact-error-message">
                ❌ {error}
              </div>
            )}
            
            <div className="contact-form-row">
              <div className="contact-form-group">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name (*)" 
                  required 
                  className="contact-form-input"
                  maxLength="100"
                />
              </div>
              <div className="contact-form-group">
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
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
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone" 
                  className="contact-form-input"
                  maxLength="20"
                />
              </div>
              <div className="contact-form-group">
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="contact-form-select"
                  required
                >
                  <option value="">Subject (*)</option>
                  <option value="Sales Inquiry">Sales Inquiry</option>
                  <option value="Wedding Flowers">Wedding Flowers</option>
                  <option value="Event Decoration">Event Decoration</option>
                  <option value="Corporate Orders">Corporate Orders</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Complaint">Complaint</option>
                  <option value="Support">Support</option>
                </select>
              </div>
            </div>
            
            <div className="contact-form-group">
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your Message (*)"
                rows="6"
                className="contact-form-textarea"
                required
                maxLength="1000"
              ></textarea>
              <div className="char-count">
                {formData.message.length}/1000 characters
              </div>
            </div>
            
            <div className="contact-form-submit">
              <button 
                type="submit" 
                className="contact-submit-button"
                disabled={loading}
              >
                {loading ? 'SENDING...' : 'SUBMIT'}
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