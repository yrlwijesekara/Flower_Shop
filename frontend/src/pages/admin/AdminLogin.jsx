import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  
  // Add admin-page class to body to prevent navbar padding
  useEffect(() => {
    document.body.classList.add('admin-page');
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('admin-page');
    };
  }, []);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Admin credentials (in a real app, this would be handled by backend authentication)
  const ADMIN_CREDENTIALS = {
    email: 'admin@flowershop.com',
    password: 'Admin@123'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // Call real backend API
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success && data.data.user.role === 'admin') {
        // Store admin token and data
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUser', JSON.stringify(data.data.user));
        
        // Redirect to admin dashboard
        navigate('/admin');
        
      } else if (data.success && data.data.user.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
      
    } catch (error) {
      console.error('Admin login error:', error);
      setError('Login failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1 className="admin-login-title">Admin Login</h1>
          <p className="admin-login-subtitle">Access the administrative dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <label htmlFor="email" className="input-label">Admin Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter admin email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              disabled={isLoading}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password" className="input-label">Admin Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter admin password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="admin-login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <button 
            type="button" 
            className="back-to-home-link"
            onClick={handleBackToHome}
          >
            ← Back to Home
          </button>
          
          <div className="admin-credentials-info">
            <p className="credentials-title">Admin Credentials:</p>
            <p className="credentials-text">Email: admin@flowershop.com</p>
            <p className="credentials-text">Password: Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
