import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo Section */}
          <div className="footer-logo">
            <img src="/navbar/nav.png" alt="Adora Flower Shop" className="logo-img" />
          </div>

          {/* Links Section */}
          <div className="footer-section">
            <h3 className="footer-title">LINKS</h3>
            <ul className="footer-links">
              <li><a href="/">HOME</a></li>
              <li><a href="/shop">SHOP</a></li>
              <li><a href="/category">CATEGORY</a></li>
              <li><a href="/about">ABOUT</a></li>
              <li><a href="/contact">CONTACT</a></li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="footer-section">
            <h3 className="footer-title">CONTACT US</h3>
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon location-icon"></div>
                <span>No. 45, Flower Garden Road,<br />Colombo 07,<br />Sri Lanka.</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon email-icon"></div>
                <a href="mailto:adoraflower@gmail.com">adoraflower@gmail.com</a>
              </div>
              <div className="contact-item">
                <div className="contact-icon phone-icon"></div>
                <span>+94 76 123 4567</span>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="footer-section">
            <h3 className="footer-title">SOCIAL MEDIA</h3>
            <div className="social-icons">
              <a href="#" className="social-icon whatsapp"></a>
              <a href="#" className="social-icon tiktok"></a>
              <a href="#" className="social-icon instagram"></a>
              <a href="#" className="social-icon facebook"></a>
            </div>
          </div>

          {/* Working Hours Section */}
          <div className="footer-section">
            <h3 className="footer-title">WORKING HOURS</h3>
            <div className="working-hours">
              <p>Mon – Sat: 9:00 AM – 7:00 PM</p>
              <p>Sun: 10:00 AM – 2:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>Copyright @ 2025. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
