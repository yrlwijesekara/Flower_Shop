import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Login attempt:', formData);
    
    // Basic validation
    if (!formData.username || !formData.password) {
      alert('Please enter both username and password');
      return;
    }
    
    // Check if this is an admin login attempt
    if (formData.username === 'admin@flowershop.com' || formData.username === 'admin') {
      alert('Admin users should use the admin login page. Redirecting...');
      navigate('/admin/login');
      return;
    }
    
    // Here you would typically make an API call to authenticate
    // For now, I'll simulate a successful login
    try {
      // Simulate successful login
      // In a real app, you'd validate credentials with your backend
      
      // Set user as logged in
      localStorage.setItem('userLoggedIn', 'true');
      
      // Store user data (you can customize this based on your needs)
      const userData = {
        username: formData.username,
        firstName: 'User',
        lastName: 'Name',
        email: formData.username.includes('@') ? formData.username : 'user@example.com',
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('flowerShopUser', JSON.stringify(userData));
      
      console.log('Login successful, redirecting to profile...');
      
      // Redirect to profile page
      navigate('/profile');
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  const handleAdminLogin = () => {
    navigate('/admin/login');
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <p className="login-subtitle">Please Enter Your Login Information</p>
            <h1 className="login-title">Welcome Back</h1>
          </div>
          
          <div className="login-form">
            <div className="input-group">
              <input
                type="text"
                name="username"
                placeholder="Username or Email Address"
                value={formData.username}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            
            <button 
              type="button" 
              className="forgot-password-link"
              onClick={handleForgotPassword}
            >
              Forgot Password
            </button>
            
            <button 
              type="button" 
              className="login-button"
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
          
          <div className="signup-section">
            <span className="signup-text">Don't have an account? </span>
            <button 
              type="button" 
              className="signup-link"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          </div>
          
          <div className="admin-login-section">
            <button 
              type="button" 
              className="admin-login-link"
              onClick={handleAdminLogin}
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}