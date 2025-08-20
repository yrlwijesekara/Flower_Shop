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

  const handleSubmit = async () => {
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
    
    try {
      // Prepare data for backend API
      const registrationData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: formData.phoneNumber,
        address: {
          country: formData.country || 'Sri Lanka'
        }
      };
      
      console.log('Sending registration request to backend...');
      
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Registration successful:', data);
        
        // Store user data and token in localStorage
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          country: formData.country,
          phoneNumber: formData.phoneNumber,
          phone: formData.phoneNumber, // Also store as 'phone' to match backend
          isLoggedIn: true,
          token: data.data.token,
          userId: data.data.user.id
        };
        
        localStorage.setItem('flowerShopUser', JSON.stringify(userData));
        localStorage.setItem('authToken', data.data.token);
        
        alert('Registration successful! Welcome to Flower Shop!');
        
        // Redirect to the user profile page
        navigate('/profile');
      } else {
        console.error('Registration failed:', data.message);
        alert(`Registration failed: ${data.message}`);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please check your connection and try again.');
    }
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
                className="register-form-input"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="register-form-input"
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
                  className="register-form-input register-country-field"
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
                  className="register-form-input register-phone-field"
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
                  className="register-form-input register-password-field"
                />
                <button
                  type="button"
                  className="register-password-toggle"
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
                  className="register-form-input register-password-field"
                />
                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  👁
                </button>
              </div>
            </div>
          </div>
          
          <button 
            type="button" 
            className="register-submit-button"
            onClick={handleSubmit}
          >
            Register
          </button>
        </div>
        
        <div className="signin-section">
          <span className="signin-text">Already have an account? </span>
          <button 
            type="button" 
            className="register-signin-link"
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