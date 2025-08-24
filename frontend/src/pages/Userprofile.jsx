import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Userprofile.css';

function Userprofile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('flowerShopUser');
    localStorage.removeItem('authToken');
    
    // Clear any other user-related data if needed
    localStorage.removeItem('flowerShopCart'); // Optional: clear cart on logout
    
    // Dispatch custom auth change event
    window.dispatchEvent(new CustomEvent('authChange'));
    
    console.log('User logged out successfully');
    
    // Redirect to home page
    navigate('/');
  };
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    phoneNumber: '',
    userId: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showOrdersPopup, setShowOrdersPopup] = useState(false);
  const [showCouponsPopup, setShowCouponsPopup] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [editableData, setEditableData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    
    if (isLoggedIn !== 'true') {
      navigate('/login');
      return;
    }

    // Fetch user data from backend API
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
          console.log('No auth token found, redirecting to login');
          navigate('/login');
          return;
        }

        console.log('Fetching user data from backend API...');
        
        // Fetch fresh user data from backend
        const response = await fetch('http://localhost:8000/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          console.log('User data fetched from backend:', data.data.user);
          
          const backendUser = data.data.user;
          
          // Split name into firstName and lastName
          const nameParts = backendUser.name.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          const userDataWithId = {
            firstName,
            lastName,
            email: backendUser.email || '',
            country: backendUser.address?.country || '',
            phoneNumber: backendUser.phone || '',
            userId: backendUser.id || ''
          };
          
          setUserData(userDataWithId);
          setEditableData({
            firstName,
            lastName,
            email: backendUser.email || '',
            country: backendUser.address?.country || '',
            phoneNumber: backendUser.phone || ''
          });
          
          
        } else {
          throw new Error(data.message || 'Failed to fetch user data');
        }
        
      } catch (error) {
        console.error('Error fetching user data from backend:', error);
        
        // Fallback to localStorage data
        console.log('Falling back to localStorage data...');
        try {
          const storedUser = localStorage.getItem('flowerShopUser');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            
            const userDataWithId = {
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || '',
              country: user.country || '',
              phoneNumber: user.phoneNumber || user.phone || '',
              userId: user.userId || `${user.firstName?.toLowerCase() || ''}${Math.floor(Math.random() * 1000)}`
            };
            
            setUserData(userDataWithId);
            setEditableData({
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || '',
              country: user.country || '',
              phoneNumber: user.phoneNumber || user.phone || ''
            });
          } else {
            console.log('No fallback data available, redirecting to login');
            navigate('/login');
          }
        } catch (fallbackError) {
          console.error('Error with fallback data:', fallbackError);
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // When entering edit mode, set editable data to current user data
      setEditableData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        country: userData.country,
        phoneNumber: userData.phoneNumber
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSaveChanges = async () => {
    // Validate fields
    const newErrors = {};
    
    if (!editableData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!editableData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!editableData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editableData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (editableData.phoneNumber && !/^\d+$/.test(editableData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number should contain only digits';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Start saving state
    setIsSaving(true);
    
    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Authentication token not found. Please login again.');
      }
      
      // Prepare data for backend API
      const updateData = {
        name: `${editableData.firstName} ${editableData.lastName}`,
        email: editableData.email,
        phone: editableData.phoneNumber,
        address: {
          country: editableData.country || 'United States'
        }
      };
      
      console.log('Updating profile with backend API...');
      
      // Make API call to update profile
      const response = await fetch('http://localhost:8000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updateData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Profile updated successfully:', data);
        
        // Create updated user data object for localStorage
        const updatedUser = {
          ...editableData,
          name: `${editableData.firstName} ${editableData.lastName}`,
          phone: editableData.phoneNumber,
          isLoggedIn: true,
          userId: userData.userId,
          token: authToken
        };

        // Save to localStorage
        localStorage.setItem('flowerShopUser', JSON.stringify(updatedUser));

        // Update state with new data
        setUserData({
          ...editableData,
          userId: userData.userId // Keep the same userId
        });

        // Exit edit mode and clear saving state
        setIsEditing(false);
        setIsSaving(false);
        
        // Show success message
        alert('Profile updated successfully in database!');
        
      } else {
        console.error('Profile update failed:', data.message);
        // Show specific error message from backend
        if (data.message.includes('Email already exists')) {
          alert('This email is already used by another user. Please choose a different email.');
        } else {
          alert(`Profile update failed: ${data.message}`);
        }
        setIsSaving(false);
      }
      
    } catch (error) {
      console.error('Profile update error:', error);
      alert(`Profile update failed: ${error.message}`);
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset editable data and exit edit mode
    setEditableData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      country: userData.country,
      phoneNumber: userData.phoneNumber
    });
    // Clear any errors
    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: ''
    });
    setIsEditing(false);
  };
  
  const handleOrdersClick = async () => {
    setShowOrdersPopup(true);
    await fetchUserOrders();
  };
  
  const fetchUserOrders = async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    
    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data.orders);
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrdersError(error.message);
    } finally {
      setOrdersLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'pending': return '#FFA500';
      case 'confirmed': return '#4CAF50';
      case 'processing': return '#2196F3';
      case 'shipped': return '#9C27B0';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#F44336';
      case 'returned': return '#FF5722';
      default: return '#757575';
    }
  };
  
  const closeOrdersPopup = () => {
    setShowOrdersPopup(false);
  };
  
  const handleCouponsClick = () => {
    setShowCouponsPopup(true);
  };
  
  const closeCouponsPopup = () => {
    setShowCouponsPopup(false);
  };
  
  
  const handleCancelOrder = async (orderNumber) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`http://localhost:8000/api/orders/${orderNumber}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: 'Cancelled by customer'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Order cancelled successfully');
        // Refresh the orders list
        await fetchUserOrders();
      } else {
        throw new Error(data.message || 'Failed to cancel order');
      }
      
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert(`Failed to cancel order: ${error.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className='myprofile'>
        <h1>My Profile</h1>

        <div className='profile-details'>
            <div className='propic'><img src='/About/User.jpg' alt='Profile' /></div>

            <div className='profile-info'>
                
                <div className='ProName'>
                  <h1>{userData.firstName.toUpperCase()} {userData.lastName.toUpperCase()}</h1>
                  <div className='profile-actions'>
                    {isEditing ? (
                      <div className='edit-buttons'>
                        <button className='save-button' onClick={handleSaveChanges} disabled={isSaving}>
                          {isSaving ? 'SAVING...' : 'SAVE'}
                        </button>
                        <button className='cancel-button' onClick={handleCancelEdit} disabled={isSaving}>CANCEL</button>
                      </div>
                    ) : (
                      <>
                        <button onClick={handleEditToggle}>EDIT PROFILE</button>
                        <button className='logout-button' onClick={handleLogout}>LOGOUT</button>
                      </>
                    )}
                  </div>
                </div>
                
                {isEditing ? (
                  <div className='edit-form'>
                    <div className='edit-form-row'>
                      <div className='edit-form-group'>
                        <label>First Name</label>
                        <input
                          type='text'
                          name='firstName'
                          value={editableData.firstName}
                          onChange={handleInputChange}
                          className={errors.firstName ? 'input-error' : ''}
                        />
                        {errors.firstName && <span className='error-message'>{errors.firstName}</span>}
                      </div>
                      <div className='edit-form-group'>
                        <label>Last Name</label>
                        <input
                          type='text'
                          name='lastName'
                          value={editableData.lastName}
                          onChange={handleInputChange}
                          className={errors.lastName ? 'input-error' : ''}
                        />
                        {errors.lastName && <span className='error-message'>{errors.lastName}</span>}
                      </div>
                    </div>
                    
                    <div className='edit-form-group'>
                      <label>Email</label>
                      <input
                        type='email'
                        name='email'
                        value={editableData.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'input-error' : ''}
                      />
                      {errors.email && <span className='error-message'>{errors.email}</span>}
                    </div>
                    
                    <div className='edit-form-row'>
                      <div className='edit-form-group'>
                        <label>Country</label>
                        <input
                          type='text'
                          name='country'
                          value={editableData.country}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className='edit-form-group'>
                        <label>Phone Number</label>
                        <div className='phone-input-container'>
                          <span className='phone-prefix'>+94</span>
                          <input
                            type='tel'
                            name='phoneNumber'
                            value={editableData.phoneNumber}
                            onChange={handleInputChange}
                            className={errors.phoneNumber ? 'input-error' : ''}
                          />
                        </div>
                        {errors.phoneNumber && <span className='error-message'>{errors.phoneNumber}</span>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='user-details'>
                    <div>
                      <h1>USER ID</h1>
                      <p>{userData.userId}</p>
                    </div>
                    <div>
                      <h1>EMAIL</h1> 
                      <p>{userData.email}</p>
                    </div>
                    <div>
                      <h1>COUNTRY</h1> 
                      <p>{userData.country}</p>
                    </div>
                    <div>
                      <h1>PHONE NUMBER</h1> 
                      <p>+94 {userData.phoneNumber}</p>
                    </div>
                  </div>
                )}

                <div className='action-buttons'>
                    <button onClick={handleOrdersClick}>MY ORDERS</button>
                </div>

            </div>
        </div>
      </div>
      
      {/* Orders Popup */}
      {showOrdersPopup && (
        <div className="popup-overlay" onClick={closeOrdersPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>My Orders</h2>
              <button className="close-btn" onClick={closeOrdersPopup}>&times;</button>
            </div>
            <div className="popup-body">
              {ordersLoading ? (
                <div className="orders-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading your orders...</p>
                </div>
              ) : ordersError ? (
                <div className="orders-error">
                  <p>Error: {ordersError}</p>
                  <button className="retry-btn" onClick={fetchUserOrders}>Try Again</button>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-orders">
                  <h3>No Orders Yet</h3>
                  <p>You haven't placed any orders yet.</p>
                  <button className="shop-now-btn" onClick={() => navigate('/products')}>SHOP NOW</button>
                </div>
              ) : (
                <div className="order-list">
                  {orders.map(order => (
                    <div className="order-item" key={order._id}>
                      <div className="order-header">
                        <div>
                          <h4>Order #{order.orderNumber}</h4>
                          <p>{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                          <span className="order-status" style={{ backgroundColor: getStatusColor(order.orderStatus) }}>
                            {order.orderStatus.toUpperCase()}
                          </span>
                          <p className="order-total">${order.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="order-details">
                        <h5>Items:</h5>
                        {order.items.map((item, index) => (
                          <div className="order-product" key={index}>
                            <img 
                              src={item.productSnapshot.image || '/products/default.jpg'} 
                              alt={item.productSnapshot.name}
                              onError={(e) => { e.target.src = '/products/default.jpg'; }}
                            />
                            <div>
                              <h6>{item.productSnapshot.name}</h6>
                              <p>Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                        <div className="order-summary">
                          <p><strong>Total: ${order.totalAmount.toFixed(2)}</strong></p>
                          <p>Status: {order.orderStatus}</p>
                          {(['pending', 'confirmed'].includes(order.orderStatus.toLowerCase())) && (
                            <button className="cancel-order-btn" onClick={() => handleCancelOrder(order.orderNumber)}>
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Coupons Popup */}
      {showCouponsPopup && (
        <div className="popup-overlay" onClick={closeCouponsPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>My Coupons</h2>
              <button className="close-btn" onClick={closeCouponsPopup}>&times;</button>
            </div>
            <div className="popup-body">
              {/* Available coupons section */}
              <div className="coupons-container">
                <h3 className="coupons-section-title">Available Coupons</h3>
                
                <div className="empty-coupons">
                  <img src="/About/empty-coupon.png" alt="No Coupons" className="empty-coupons-img" />
                  <h3>No Available Coupons</h3>
                  <p>You don't have any active coupons at the moment. Check back later or subscribe to our newsletter for special offers!</p>
                </div>
                
                {/* This would show when coupons are available */}
                {/*
                <div className="coupon-list">
                  <div className="coupon-item">
                    <div className="coupon-left">
                      <div className="discount-amount">20% OFF</div>
                      <div className="coupon-code">BLOOM20</div>
                    </div>
                    <div className="coupon-right">
                      <h4>Summer Special Discount</h4>
                      <p>Valid until: September 30, 2025</p>
                      <p className="coupon-description">Get 20% off on all summer bouquets</p>
                      <button className="copy-code-btn">COPY CODE</button>
                    </div>
                  </div>
                  
                  <div className="coupon-item">
                    <div className="coupon-left">
                      <div className="discount-amount">$10 OFF</div>
                      <div className="coupon-code">FLOWER10</div>
                    </div>
                    <div className="coupon-right">
                      <h4>New Customer Special</h4>
                      <p>Valid until: December 31, 2025</p>
                      <p className="coupon-description">$10 off on your first order above $50</p>
                      <button className="copy-code-btn">COPY CODE</button>
                    </div>
                  </div>
                </div>
                */}
              </div>
              
              <div className="coupon-subscribe">
                <h3>Want More Discounts?</h3>
                <p>Subscribe to our newsletter to receive exclusive coupons and special offers!</p>
                <button className="subscribe-btn" onClick={() => navigate('/contact')}>SUBSCRIBE NOW</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
}

export default Userprofile;
