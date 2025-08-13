import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Registration attempt:', formData);
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    // Store user data in localStorage
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      country: formData.country,
      phoneNumber: formData.phoneNumber,
      isLoggedIn: true
    };
    
    localStorage.setItem('flowerShopUser', JSON.stringify(userData));
    
    // Redirect to the user profile page
    navigate('/profile');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
    <Navbar />
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <p className="register-subtitle">Please Enter Your Information</p>
          <h1 className="register-title">Welcome !</h1>
        </div>
        
        <div className="register-form">
          <div className="form-row">
            <div className="input-group">
              <label className="input-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="input-group full-width">
            <label className="input-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className="input-label">Country</label>
              <div className="country-input">
                <div className="flag-container">
                  <span className="flag">🇱🇰</span>
                </div>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="form-input country-field"
                />
              </div>
            </div>
            
            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <div className="phone-input">
                <span className="country-code">+94</span>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="form-input phone-field"
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input password-field"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  👁
                </button>
              </div>
            </div>
            
            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <div className="password-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input password-field"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  👁
                </button>
              </div>
            </div>
          </div>
          
          <button 
            type="button" 
            className="register-button"
            onClick={handleSubmit}
          >
            Register
          </button>
        </div>
        
        <div className="signin-section">
          <span className="signin-text">Already have an account? </span>
          <button 
            type="button" 
            className="signin-link"
            onClick={handleSignIn}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
     <Footer />
    </>
  );
}