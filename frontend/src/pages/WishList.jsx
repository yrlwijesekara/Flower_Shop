import React, { useState } from 'react';
import { FiHome } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import MiniNavbar from '../components/MiniNavbar';
import Footer from '../components/Footer';
import './WishList.css';
import TopSellingFlowers from '../components/TopSelling';

const WishList = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'SNAKE PLANT',
      category: 'Cactus',
      price: 149,
      quantity: 1,
      image: '/topselling/top1.jpg',
      selected: false
    },
    {
      id: 2,
      name: 'CANDELABRA ALOE',
      category: 'Aloe Vera',
      price: 149,
      quantity: 1,
      image: '/topselling/top2.jpg',
      selected: false
    },
    {
      id: 3,
      name: 'GOLDEN POTHOS',
      category: 'Pothos',
      price: 69,
      quantity: 1,
      image: '/topselling/top3.jpg',
      selected: true
    },
    {
      id: 4,
      name: 'HOMALOMENA',
      category: 'Bonsai',
      price: 119,
      quantity: 1,
      image: '/topselling/top4.jpg',
      selected: false
    }
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const toggleSelection = (id) => {
    setCartItems(items =>
      items.map(item => ({
        ...item,
        selected: item.id === id
      }))
    );
  };

  // const calculateTotals = () => {
  //   const selectedItem = cartItems.find(item => item.selected);
  //   const itemsTotal = selectedItem ? selectedItem.price * selectedItem.quantity : 0;
  //   const shipping = 5;
  //   const discount = 0;
  //   const total = itemsTotal - discount + shipping;
    
  //   return { itemsTotal, shipping, discount, total };
  // };

  // const { itemsTotal, shipping, discount, total } = calculateTotals();
  // const selectedItem = cartItems.find(item => item.selected);

  return (
    <>
      <Navbar />
      <MiniNavbar 
        breadcrumbs={[
          { icon: <FiHome size={25} color="#000000" />, href: '/' },
          { label: 'Wishlist', href: '/wishlist' }
        ]}
        showFilters={false}
      />
      <div className="cart-container">
      <div className="cart-main">
        <h1 className="cart-title">WISH LIST</h1>
        
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-checkbox">
                <input
                  type="radio"
                  checked={item.selected}
                  onChange={() => toggleSelection(item.id)}
                  className="checkbox"
                />
              </div>
              
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-category">{item.category}</p>
                <div className="item-price">${item.price}</div>
              </div>
              
              <div className="item-actions">
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  REMOVE
                </button>
                
                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    +
                  </button>
                </div>
                
                <button className="checkout-btn">
                  ADD TO CART ↗
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* <div className="cart-sidebar">
        <div className="summary-section">
          <h2 className="summary-title">SUMMARY</h2>
          
          <div className="summary-image">
            <img 
              src={selectedItem ? selectedItem.image : "/api/placeholder/80/80"} 
              alt={selectedItem ? selectedItem.name : "No item selected"} 
            />
          </div>
          
          <div className="summary-details">
            <div className="summary-row">
              <span>Items Total</span>
              <span>$ {itemsTotal}</span>
            </div>
            <div className="summary-row">
              <span>Items Discount</span>
              <span>$ {discount}</span>
            </div>
            <div className="summary-row">
              <span>Sub Total</span>
              <span>$ 0</span>
            </div>
            <div className="summary-row">
              <span>Shipping Cost</span>
              <span>$ {shipping}</span>
            </div>
            <div className="summary-row total-row">
              <span>Estimated Total</span>
              <span>$ {total}</span>
            </div>
          </div>
          
          <button className="main-checkout-btn">
            CHECK OUT ↗
          </button>
        </div>
        
        <div className="payment-section">
          <h3 className="payment-title">PAY WITH</h3>
          <div className="payment-icons">
            <span className="payment-icon">💳</span>
            <span className="payment-icon">👤</span>
          </div>
        </div>
        
        <div className="protection-section">
          <h3 className="protection-title">BUYER PROTECTION</h3>
          <p className="protection-text">
            Get a full refund if the item is not as described or not delivered.
          </p>
        </div>
      </div> */}
    </div>
    <TopSellingFlowers
      titleFirst='YOU MAY'
      titleSecond='ALSO LIKE'
    />
    <Footer />
    </>
  );
};

export default WishList;