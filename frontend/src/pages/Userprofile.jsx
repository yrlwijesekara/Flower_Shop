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
    
    // Clear any other user-related data if needed
    localStorage.removeItem('flowerShopCart'); // Optional: clear cart on logout
    
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
  const [showPaymentsPopup, setShowPaymentsPopup] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState('history');
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [savedCards, setSavedCards] = useState([]);
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
  const [cardErrors, setCardErrors] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    
    if (isLoggedIn !== 'true') {
      navigate('/login');
      return;
    }

    // Get user data from localStorage
    try {
      const storedUser = localStorage.getItem('flowerShopUser');
      console.log('Retrieved from localStorage:', storedUser);
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log('Parsed user data:', user);
        
        const userDataWithId = {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          country: user.country || '',
          phoneNumber: user.phoneNumber || '',
          userId: `${user.firstName?.toLowerCase() || ''}${Math.floor(Math.random() * 1000)}`
        };
        
        setUserData(userDataWithId);
        setEditableData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          country: user.country || '',
          phoneNumber: user.phoneNumber || ''
        });
        
        // Load saved cards if available
        if (user.savedCards && Array.isArray(user.savedCards)) {
          setSavedCards(user.savedCards);
        }
      } else {
        console.log('No user data found, redirecting to login');
        // Redirect to login if no user data is found
        navigate('/login');
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
      navigate('/login');
    }
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

  const handleSaveChanges = () => {
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
    
    // Create updated user data object
    const updatedUser = {
      ...editableData,
      isLoggedIn: true
    };

    // Simulate a network delay
    setTimeout(() => {
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
      alert('Profile updated successfully!');
    }, 1000);
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
  
  const handleOrdersClick = () => {
    setShowOrdersPopup(true);
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
  
  const handlePaymentsClick = () => {
    setShowPaymentsPopup(true);
  };
  
  const closePaymentsPopup = () => {
    setShowPaymentsPopup(false);
    // Reset states when closing popup
    setActivePaymentTab('history');
    setShowAddCardForm(false);
  };
  
  const handlePaymentTabChange = (tab) => {
    setActivePaymentTab(tab);
    setShowAddCardForm(false);
  };
  
  const handleShowAddCardForm = () => {
    setShowAddCardForm(true);
  };
  
  const handleCancelAddCard = () => {
    setShowAddCardForm(false);
    setCardDetails({
      cardNumber: '',
      cardName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    });
    setCardErrors({
      cardNumber: '',
      cardName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    });
  };
  
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user types
    if (cardErrors[name]) {
      setCardErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      // Remove any non-digit characters
      const cleaned = value.replace(/\D/g, '');
      // Add a space after every 4 digits
      const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
      // Limit to 19 characters (16 digits + 3 spaces)
      const limited = formatted.slice(0, 19);
      
      setCardDetails(prev => ({
        ...prev,
        [name]: limited
      }));
    } else {
      setCardDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSaveCard = () => {
    // Validate card details
    const newErrors = {};
    
    if (!cardDetails.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!cardDetails.cardName.trim()) {
      newErrors.cardName = 'Name on card is required';
    }
    
    if (!cardDetails.expiryMonth) {
      newErrors.expiryMonth = 'Month is required';
    }
    
    if (!cardDetails.expiryYear) {
      newErrors.expiryYear = 'Year is required';
    }
    
    if (!cardDetails.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setCardErrors(newErrors);
      return;
    }
    
    // Determine card type based on first digit
    let cardType = 'unknown';
    const firstDigit = cardDetails.cardNumber.charAt(0);
    
    if (firstDigit === '4') {
      cardType = 'visa';
    } else if (firstDigit === '5') {
      cardType = 'mastercard';
    } else if (firstDigit === '3') {
      cardType = 'amex';
    } else if (firstDigit === '6') {
      cardType = 'discover';
    }
    
    // Create new card object
    const newCard = {
      id: Date.now(),
      cardNumber: cardDetails.cardNumber,
      cardName: cardDetails.cardName,
      expiry: `${cardDetails.expiryMonth}/${cardDetails.expiryYear.slice(-2)}`,
      type: cardType,
      isDefault: savedCards.length === 0 // Make it default if it's the first card
    };
    
    // Add to saved cards
    const updatedCards = [...savedCards, newCard];
    setSavedCards(updatedCards);
    
    // Save to localStorage
    try {
      const storedUser = localStorage.getItem('flowerShopUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const updatedUser = {
          ...user,
          savedCards: updatedCards
        };
        localStorage.setItem('flowerShopUser', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error saving cards to localStorage:', error);
    }
    
    // Reset form
    setCardDetails({
      cardNumber: '',
      cardName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    });
    
    // Hide form
    setShowAddCardForm(false);
    
    // Show success message
    alert('Card added successfully!');
  };
  
  const handleSetDefaultCard = (cardId) => {
    const updatedCards = savedCards.map(card => ({
      ...card,
      isDefault: card.id === cardId
    }));
    
    setSavedCards(updatedCards);
    
    // Save to localStorage
    try {
      const storedUser = localStorage.getItem('flowerShopUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const updatedUser = {
          ...user,
          savedCards: updatedCards
        };
        localStorage.setItem('flowerShopUser', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error saving cards to localStorage:', error);
    }
  };
  
  const handleRemoveCard = (cardId) => {
    if (window.confirm('Are you sure you want to remove this card?')) {
      const updatedCards = savedCards.filter(card => card.id !== cardId);
      
      // If we removed the default card and there are other cards, make the first one default
      if (updatedCards.length > 0 && !updatedCards.some(card => card.isDefault)) {
        updatedCards[0].isDefault = true;
      }
      
      setSavedCards(updatedCards);
      
      // Save to localStorage
      try {
        const storedUser = localStorage.getItem('flowerShopUser');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const updatedUser = {
            ...user,
            savedCards: updatedCards
          };
          localStorage.setItem('flowerShopUser', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error('Error saving cards to localStorage:', error);
      }
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
                    <button onClick={handlePaymentsClick}>MY PAYMENTS</button>
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
              {/* If no orders, show empty state */}
              <div className="empty-orders">
                <img src="/About/empty-orders.png" alt="No Orders" className="empty-orders-img" />
                <h3>No Orders Yet</h3>
                <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
                <button className="shop-now-btn" onClick={() => navigate('/products')}>SHOP NOW</button>
              </div>
              
              {/* Order list would go here when there are orders */}
              {/* This is just a placeholder */}
              {/* 
              <div className="order-list">
                <div className="order-item">
                  <div className="order-header">
                    <span>Order #1234</span>
                    <span>Placed on: August 10, 2025</span>
                    <span className="order-status">Delivered</span>
                  </div>
                  <div className="order-details">
                    <div className="order-product">
                      <img src="/products/flower1.jpg" alt="Product" />
                      <div>
                        <h4>Rose Bouquet</h4>
                        <p>Quantity: 1</p>
                        <p>Price: $50</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              */}
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
      
      {/* Payments Popup */}
      {showPaymentsPopup && (
        <div className="popup-overlay" onClick={closePaymentsPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>My Payments</h2>
              <button className="close-btn" onClick={closePaymentsPopup}>&times;</button>
            </div>
            <div className="popup-body">
              <div className="payment-tabs">
                <button 
                  className={`payment-tab ${activePaymentTab === 'history' ? 'active' : ''}`}
                  onClick={() => handlePaymentTabChange('history')}
                >
                  Payment History
                </button>
                <button 
                  className={`payment-tab ${activePaymentTab === 'cards' ? 'active' : ''}`}
                  onClick={() => handlePaymentTabChange('cards')}
                >
                  Saved Cards
                </button>
              </div>
              
              <div className="payment-content">
                {/* Payment History Tab Content */}
                <div className="payment-history-container" style={{display: activePaymentTab === 'history' ? 'block' : 'none'}}>
                  <div className="empty-payments">
                    <img src="/About/empty-payment.png" alt="No Payments" className="empty-payments-img" />
                    <h3>No Payment History</h3>
                    <p>You haven't made any payments yet. Your payment history will appear here once you place an order.</p>
                  </div>
                </div>
                
                {/* Saved Cards Tab Content */}
                <div className="saved-cards-container" style={{display: activePaymentTab === 'cards' ? 'block' : 'none'}}>
                  {!showAddCardForm && (
                    <>
                      {savedCards.length === 0 ? (
                        <div className="empty-cards">
                          <img src="/About/empty-card.png" alt="No Saved Cards" className="empty-cards-img" />
                          <h3>No Saved Cards</h3>
                          <p>You haven't saved any payment methods yet. Your saved cards will appear here for easy checkout.</p>
                          <button className="add-card-btn" onClick={handleShowAddCardForm}>ADD A PAYMENT METHOD</button>
                        </div>
                      ) : (
                        <div className="cards-list">
                          {savedCards.map(card => (
                            <div className="card-item" key={card.id}>
                              <div className="card-left">
                                <img 
                                  src={`/icons/${card.type}.png`} 
                                  alt={card.type.toUpperCase()} 
                                  className="card-logo"
                                  onError={(e) => { e.target.src = "/icons/card-generic.png"; }}
                                />
                              </div>
                              <div className="card-middle">
                                <div className="card-number">
                                  •••• •••• •••• {card.cardNumber.slice(-4)}
                                </div>
                                <div className="card-name">{card.cardName}</div>
                                <div className="card-expiry">Expires: {card.expiry}</div>
                              </div>
                              <div className="card-right">
                                {card.isDefault ? (
                                  <button className="card-default-btn active">Default</button>
                                ) : (
                                  <button 
                                    className="card-default-btn" 
                                    onClick={() => handleSetDefaultCard(card.id)}
                                  >
                                    Set as Default
                                  </button>
                                )}
                                <button 
                                  className="card-remove-btn"
                                  onClick={() => handleRemoveCard(card.id)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                          <button className="add-another-card-btn" onClick={handleShowAddCardForm}>
                            <span>+</span> Add Another Card
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Add Card Form */}
                  {showAddCardForm && (
                    <div className="add-card-form">
                      <h3>Add New Card</h3>
                      <div className="card-form-group">
                        <label>Card Number</label>
                        <input 
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={handleCardInputChange}
                          className={cardErrors.cardNumber ? 'input-error' : ''}
                          maxLength="19"
                        />
                        {cardErrors.cardNumber && <span className="error-message">{cardErrors.cardNumber}</span>}
                      </div>
                      
                      <div className="card-form-group">
                        <label>Name on Card</label>
                        <input 
                          type="text"
                          name="cardName"
                          placeholder="John Doe"
                          value={cardDetails.cardName}
                          onChange={handleCardInputChange}
                          className={cardErrors.cardName ? 'input-error' : ''}
                        />
                        {cardErrors.cardName && <span className="error-message">{cardErrors.cardName}</span>}
                      </div>
                      
                      <div className="card-form-row">
                        <div className="card-form-group expiry-group">
                          <label>Expiration Date</label>
                          <div className="expiry-inputs">
                            <select 
                              name="expiryMonth"
                              value={cardDetails.expiryMonth}
                              onChange={handleCardInputChange}
                              className={cardErrors.expiryMonth ? 'input-error' : ''}
                            >
                              <option value="">Month</option>
                              {Array.from({ length: 12 }, (_, i) => {
                                const month = i + 1;
                                return (
                                  <option key={month} value={month < 10 ? `0${month}` : month.toString()}>
                                    {month < 10 ? `0${month}` : month}
                                  </option>
                                );
                              })}
                            </select>
                            <select 
                              name="expiryYear"
                              value={cardDetails.expiryYear}
                              onChange={handleCardInputChange}
                              className={cardErrors.expiryYear ? 'input-error' : ''}
                            >
                              <option value="">Year</option>
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = new Date().getFullYear() + i;
                                return (
                                  <option key={year} value={year.toString()}>
                                    {year}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          {(cardErrors.expiryMonth || cardErrors.expiryYear) && (
                            <span className="error-message">
                              {cardErrors.expiryMonth || cardErrors.expiryYear}
                            </span>
                          )}
                        </div>
                        
                        <div className="card-form-group cvv-group">
                          <label>CVV</label>
                          <input 
                            type="password"
                            name="cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={handleCardInputChange}
                            className={cardErrors.cvv ? 'input-error' : ''}
                            maxLength="4"
                          />
                          {cardErrors.cvv && <span className="error-message">{cardErrors.cvv}</span>}
                        </div>
                      </div>
                      
                      <div className="card-form-actions">
                        <button className="save-card-btn" onClick={handleSaveCard}>Save Card</button>
                        <button className="cancel-card-btn" onClick={handleCancelAddCard}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="secure-payment-info">
                <div className="secure-payment-header">
                  <i className="secure-icon">🔒</i>
                  <h3>Secure Payments</h3>
                </div>
                <p>We use industry-standard encryption to protect your personal information and payment details. Your transactions are secure with us.</p>
                <div className="payment-methods-icons">
                  <span className="payment-icon">💳</span>
                  <span className="payment-icon">💰</span>
                  <span className="payment-icon">🏦</span>
                </div>
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
