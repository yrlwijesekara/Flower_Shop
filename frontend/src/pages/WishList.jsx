import React, { useState, useEffect } from 'react';
import { FiHome } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import MiniNavbar from '../components/MiniNavbar';
import Footer from '../components/Footer';
import './WishList.css';
import TopSellingFlowers from '../components/TopSelling';

const WishList = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Product data - ideally this would come from an API or context
  const productData = {
    1: {
      id: 1,
      name: 'SNAKE PLANT',
      category: 'Cactus',
      price: 149,
      image: '/topselling/top1.jpg'
    },
    2: {
      id: 2,
      name: 'CANDELABRA ALOE',
      category: 'Aloe Vera',
      price: 149,
      image: '/topselling/top2.jpg'
    },
    3: {
      id: 3,
      name: 'GOLDEN POTHOS',
      category: 'Pothos',
      price: 69,
      image: '/topselling/top3.jpg'
    },
    4: {
      id: 4,
      name: 'HOMALOMENA',
      category: 'Tropical',
      price: 119,
      image: '/topselling/top4.jpg'
    },
    5: {
      id: 5,
      name: 'FIDDLE LEAF FIG',
      category: 'Indoor Tree',
      price: 89,
      image: '/images/fiddle-leaf.jpg'
    },
    6: {
      id: 6,
      name: 'PEACE LILY',
      category: 'Flowering',
      price: 45,
      image: '/images/peace-lily.jpg'
    },
    7: {
      id: 7,
      name: 'MONSTERA DELICIOSA',
      category: 'Tropical',
      price: 79,
      image: '/images/fiddle-leaf.jpg'
    },
    8: {
      id: 8,
      name: 'RUBBER PLANT',
      category: 'Indoor Tree',
      price: 59,
      image: '/images/fiddle-leaf.jpg'
    },
    9: {
      id: 9,
      name: 'ZZ PLANT',
      category: 'Low Light',
      price: 35,
      image: '/images/fiddle-leaf.jpg'
    },
    10: {
      id: 10,
      name: 'PHILODENDRON',
      category: 'Tropical',
      price: 55,
      image: '/images/fiddle-leaf.jpg'
    },
    11: {
      id: 11,
      name: 'SPIDER PLANT',
      category: 'Air Purifying',
      price: 25,
      image: '/images/fiddle-leaf.jpg'
    },
    12: {
      id: 12,
      name: 'DRACAENA',
      category: 'Low Light',
      price: 65,
      image: '/images/fiddle-leaf.jpg'
    },
    13: {
      id: 13,
      name: 'BRIDAL BOUQUET ROSE',
      category: 'Wedding Flowers',
      price: 189,
      image: '/images/wedding-1.jpg'
    },
    14: {
      id: 14,
      name: 'WHITE LILY ARRANGEMENT',
      category: 'Wedding Flowers',
      price: 145,
      image: '/images/wedding-2.jpg'
    },
    15: {
      id: 15,
      name: 'WEDDING CENTERPIECE',
      category: 'Wedding Flowers',
      price: 225,
      image: '/images/wedding-3.jpg'
    }
  };

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const loadWishlistItems = () => {
      const savedFavorites = localStorage.getItem('flowerShopFavorites');
      if (savedFavorites) {
        try {
          const favoriteIds = JSON.parse(savedFavorites);
          const wishlistProducts = favoriteIds
            .map(id => {
              const product = productData[id];
              return product ? {
                ...product,
                quantity: 1,
                selected: false
              } : null;
            })
            .filter(item => item !== null);
          
          setWishlistItems(wishlistProducts);
        } catch (error) {
          console.error('Error parsing favorites from localStorage:', error);
          setWishlistItems([]);
        }
      }
    };

    loadWishlistItems();

    // Listen for storage changes to update wishlist in real-time
    const handleStorageChange = (e) => {
      if (e.key === 'flowerShopFavorites') {
        loadWishlistItems();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when favorites change in the same tab
    const handleFavoritesChange = () => {
      loadWishlistItems();
    };

    window.addEventListener('favoritesChanged', handleFavoritesChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesChanged', handleFavoritesChange);
    };
  }, []);

  const updateQuantity = (id, change) => {
    setWishlistItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    // Remove from wishlist state
    setWishlistItems(items => items.filter(item => item.id !== id));
    
    // Remove from localStorage favorites
    const savedFavorites = localStorage.getItem('flowerShopFavorites');
    if (savedFavorites) {
      try {
        let favorites = JSON.parse(savedFavorites);
        favorites = favorites.filter(fav => fav !== id);
        localStorage.setItem('flowerShopFavorites', JSON.stringify(favorites));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('favoritesChanged'));
      } catch (error) {
        console.error('Error updating favorites in localStorage:', error);
      }
    }
  };

  const toggleSelection = (id) => {
    setWishlistItems(items =>
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
    <div className="wishlist-page">
      <Navbar />
      <MiniNavbar 
        breadcrumbs={[
          { icon: <FiHome size={25} color="#000000" />, href: '/' },
          { label: 'Wishlist', href: '/wishlist' }
        ]}
        showFilters={false}
      />
      <div className="wishlist-container">
      <div className="wishlist-main">
        <h1 className="wishlist-title">WISH LIST</h1>
        
        <div className="wishlist-items">
          {wishlistItems.length > 0 ? (
            wishlistItems.map(item => (
            <div key={item.id} className="wishlist-item">
              <div className="wishlist-item-checkbox">
                <input
                  type="radio"
                  checked={item.selected}
                  onChange={() => toggleSelection(item.id)}
                  className="wishlist-checkbox"
                />
              </div>
              
              <div className="wishlist-item-image">
                <img src={item.image} alt={item.name} />
              </div>
              
              <div className="wishlist-item-details">
                <h3 className="wishlist-item-name">{item.name}</h3>
                <p className="wishlist-item-category">{item.category}</p>
                <div className="wishlist-item-price">${item.price}</div>
              </div>
              
              <div className="wishlist-item-actions">
                <button
                  className="wishlist-remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  REMOVE
                </button>
                
                <div className="wishlist-quantity-controls">
                  <button
                    className="wishlist-qty-btn"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    -
                  </button>
                  <span className="wishlist-quantity">{item.quantity}</span>
                  <button
                    className="wishlist-qty-btn"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    +
                  </button>
                </div>
                
                <button className="wishlist-add-to-cart-btn">
                  ADD TO CART ↗
                </button>
              </div>
            </div>
            ))
          ) : (
            <div className="empty-wishlist">
              <div className="empty-wishlist-content">
                <div className="empty-wishlist-icon">💝</div>
                <h2 className="empty-wishlist-title">Your Wishlist is Empty</h2>
                <p className="empty-wishlist-text">
                  Start adding your favorite plants by clicking the heart icon on product cards!
                </p>
                <a href="/shop" className="browse-products-btn">
                  Browse Products
                </a>
              </div>
            </div>
          )}
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
    </div>
  );
};

export default WishList;