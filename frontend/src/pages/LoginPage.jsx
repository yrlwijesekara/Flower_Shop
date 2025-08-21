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

  const handleSubmit = async () => {
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
    
    try {
      console.log('Sending login request to backend...');
      
      // Make API call to authenticate with backend
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.username,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Login successful:', data);
        
        // Set user as logged in
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('authToken', data.data.token);
        
        // Dispatch custom auth change event
        window.dispatchEvent(new CustomEvent('authChange'));
        
        // Store user data from backend response
        const userData = {
          username: data.data.user.email,
          firstName: data.data.user.name.split(' ')[0] || 'User',
          lastName: data.data.user.name.split(' ').slice(1).join(' ') || '',
          name: data.data.user.name,
          email: data.data.user.email,
          phone: data.data.user.phone || '',
          phoneNumber: data.data.user.phone || '', // For compatibility
          country: data.data.user.address?.country || '',
          isLoggedIn: true,
          userId: data.data.user.id,
          token: data.data.token,
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('flowerShopUser', JSON.stringify(userData));
        
        console.log('Login successful, redirecting to profile...');
        alert('Login successful! Welcome back!');
        
        // Redirect to profile page
        navigate('/profile');
        
      } else {
        console.error('Login failed:', data.message);
        alert(`Login failed: ${data.message}`);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your connection and try again.');
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
                className="login-form-input"
              />
            </div>
            
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="login-form-input"
              />
            </div>
            
            <button 
              type="button" 
              className="login-forgot-password-link"
              onClick={handleForgotPassword}
            >
              Forgot Password
            </button>
            
            <button 
              type="button" 
              className="login-submit-button"
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
          
          <div className="signup-section">
            <span className="signup-text">Don't have an account? </span>
            <button 
              type="button" 
              className="login-signup-link"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          </div>
          
          <div className="admin-login-section">
            <button 
              type="button" 
              className="login-admin-link"
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