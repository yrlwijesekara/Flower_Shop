import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { HiHeart } from 'react-icons/hi';
import wishlistService from '../services/wishlistService';
import './ProductCard.css';

// Fallback SVG Heart Icons
const HeartOutlineIcon = ({ size = 20, color = "#666", style = {} }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ display: 'block', ...style }}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const HeartFilledIcon = ({ size = 20, color = "#ffffff", style = {} }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color} 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ display: 'block', ...style }}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ProductCard = ({
  id,
  name = "SNAKE PLANT",
  category = "Cactus",
  price = 149,
  image = "/images/snake-plant.jpg",
  onAddToCart,
  onToggleFavorite,
  onProductClick,
  className = ""
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  // Initialize wishlist service and load favorite status
  useEffect(() => {
    const initWishlist = async () => {
      try {
        // Always initialize wishlist service to ensure it's ready
        await wishlistService.init();
        
        // Set initial favorite status
        setIsFavorite(wishlistService.isInWishlist(id));
        
        // Listen for wishlist changes
        const unsubscribe = wishlistService.addListener((wishlistIds) => {
          setIsFavorite(wishlistIds.includes(id?.toString()));
        });
        
        // Cleanup listener on unmount
        return unsubscribe;
      } catch (error) {
        console.error('Failed to initialize wishlist:', error);
        // Fallback to localStorage
        const savedFavorites = localStorage.getItem('flowerShopFavorites');
        if (savedFavorites) {
          try {
            const favorites = JSON.parse(savedFavorites);
            setIsFavorite(favorites.includes(id));
          } catch (parseError) {
            console.error('Error parsing favorites from localStorage:', parseError);
          }
        }
      }
    };
    
    const cleanup = initWishlist();
    
    // Return cleanup function
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [id]);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ id, name, category, price, image });
    }
    console.log(`Added ${name} to cart`);
  };

  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick();
    }
    navigate(`/product/${id}`);
  };

  const handleToggleFavorite = async () => {
    try {
      // Optimistically update UI
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);
      
      // Update database through wishlist service
      const success = await wishlistService.toggleWishlist(id);
      
      if (!success) {
        // Revert optimistic update if failed
        setIsFavorite(!newFavoriteStatus);
        console.error('Failed to update wishlist');
        return;
      }
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('wishlistChanged', {
        detail: { productId: id, isInWishlist: success }
      }));
      
      // Also dispatch the old event for backward compatibility
      window.dispatchEvent(new CustomEvent('favoritesChanged'));
      
      // Call parent callback if provided
      if (onToggleFavorite) {
        onToggleFavorite(id, success);
      }
      
      console.log(`${success ? 'Added to' : 'Removed from'} wishlist: ${name}`);
      
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      // Revert optimistic update
      setIsFavorite(!isFavorite);
    }
  };

  return (
    <div className={`product-card ${className}`}>
      {/* Card Background - Rectangle 2 */}
      <div className="card-background">
        
        {/* Product Image Frame */}
        <div className="image-frame">
          {/* Favorite Heart Icon */}
          <button 
            className={`favorite-btn ${isFavorite ? 'favorite' : ''}`}
            onClick={handleToggleFavorite}
            aria-label={`${isFavorite ? 'Remove from' : 'Add to'} favorites`}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            {/* Always show the fallback SVG as primary */}
            {isFavorite ? (
              <HeartFilledIcon 
                size={20} 
                color="#ffffff" 
                style={{ display: 'block' }} 
              />
            ) : (
              <HeartOutlineIcon 
                size={20} 
                color="#666" 
                style={{ display: 'block' }} 
              />
            )}
          </button>
          
          <div className="image-container">
            <img 
              src={image} 
              alt={name}
              className="product-image"
              onClick={handleProductClick}
              style={{ cursor: 'pointer' }}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzM0IiBoZWlnaHQ9IjMzNCIgdmlld0JveD0iMCAwIDMzNCAzMzQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMzQiIGhlaWdodD0iMzM0IiBmaWxsPSIjRjBGMEYwIiByeD0iNSIvPgo8cGF0aCBkPSJNMTUwIDEwMEwxODQgMTM0TDE1MCAxNjhMMTE2IDEzNEwxNTAgMTAwWiIgZmlsbD0iIzVCQzU1OSIvPgo8cGF0aCBkPSJNMTY3IDIwMEwyMDEgMjM0TDE2NyAyNjhMMTMzIDIzNEwxNjcgMjAwWiIgZmlsbD0iIzVCQzU1OSIvPgo8L3N2Zz4K';
              }}
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="product-info">
          <div className="product-header">
            <h3 className="product-name">{name}</h3>
            <span className="product-price">${price}</span>
          </div>
          <p className="product-category">{category}</p>
        </div>

        {/* Add to Cart Button */}
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          aria-label={`Add ${name} to cart`}
        >
          <span className="btn-text">ADD TO CART</span>
          <div className="cart-icon">
            <FiShoppingCart size={18} color="#FFFFFF" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
