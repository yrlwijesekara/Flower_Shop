import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { HiHeart } from 'react-icons/hi';
import './ProductCard.css';

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

  // Load favorite status from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('flowerShopFavorites');
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        setIsFavorite(favorites.includes(id));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
      }
    }
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

  const handleToggleFavorite = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    // Update localStorage
    const savedFavorites = localStorage.getItem('flowerShopFavorites');
    let favorites = [];
    if (savedFavorites) {
      try {
        favorites = JSON.parse(savedFavorites);
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
      }
    }

    if (newFavoriteStatus) {
      if (!favorites.includes(id)) {
        favorites.push(id);
      }
    } else {
      favorites = favorites.filter(fav => fav !== id);
    }

    localStorage.setItem('flowerShopFavorites', JSON.stringify(favorites));

    // Call parent callback if provided
    if (onToggleFavorite) {
      onToggleFavorite(id, newFavoriteStatus);
    }

    console.log(`${newFavoriteStatus ? 'Added to' : 'Removed from'} favorites: ${name}`);
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
          >
            {isFavorite ? (
              <HiHeart className="heart-icon filled" size={20} />
            ) : (
              <FiHeart className="heart-icon outline" size={20} />
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
