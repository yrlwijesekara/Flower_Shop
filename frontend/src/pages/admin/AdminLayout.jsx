import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/other-products', label: 'Other Products' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/contacts', label: 'Contacts' },
  { to: '/admin/comments', label: 'Comments' },
  { to: '/admin/reset-password', label: 'Reset Password' }
];

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check admin authentication and set body class
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    const adminUserData = localStorage.getItem('adminUser');
    
    // Add admin-page class to body to prevent navbar padding
    document.body.classList.add('admin-page');
    
    if (isAdminLoggedIn !== 'true' || !adminUserData) {
      navigate('/admin/login');
      return;
    }
    
    try {
      const userData = JSON.parse(adminUserData);
      setAdminUser(userData);
    } catch (error) {
      console.error('Error parsing admin user data:', error);
      navigate('/admin/login');
    }
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('admin-page');
    };
  }, [navigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Logout handler
  const handleLogout = () => {
    // Clear admin authentication
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
    navigate('/admin/login'); // Redirect to admin login
  };
  
  // Show loading if admin user is not loaded yet
  if (!adminUser) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#164C0D'
      }}>
        Loading admin panel...
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container" data-admin-panel="true">
      <button className="admin-mobile-menu-toggle" onClick={toggleSidebar}>☰</button>
      <div
        className={`admin-sidebar-overlay ${isSidebarOpen ? 'admin-sidebar-open' : ''}`}
        onClick={toggleSidebar}
      ></div>
      <div className={`admin-sidebar ${isSidebarOpen ? 'admin-sidebar-open' : ''}`}>
        <div className="admin-logo-section">
          <div className="admin-logo-header">
            <div className="admin-logo-leaf">
              <svg className="admin-leaf-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </div>
            <span className="admin-logo-text">Admin Panel</span>
          </div>
          <div className="admin-user-info">
            <span className="admin-welcome">Welcome, {adminUser.name}</span>
            <span className="admin-role">{adminUser.role}</span>
          </div>
        </div>
        <ul className="admin-sidebar-nav">
          {navLinks.map(link => (
            <li className="admin-nav-item" key={link.to}>
              <Link
                className={`admin-nav-link${location.pathname === link.to ? ' active' : ''}`}
                to={link.to}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="admin-nav-item">
            <button className="admin-nav-link admin-logout-link" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
      <div className="admin-main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;