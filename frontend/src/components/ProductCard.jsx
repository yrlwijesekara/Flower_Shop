import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import './ProductCard.css';

const ProductCard = ({
  id,
  name = "SNAKE PLANT",
  category = "Cactus",
  price = 149,
  image = "/images/snake-plant.jpg",
  onAddToCart,
  className = ""
}) => {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ id, name, category, price, image });
    }
    console.log(`Added ${name} to cart`);
  };

  return (
    <div className={`product-card ${className}`}>
      {/* Card Background - Rectangle 2 */}
      <div className="card-background">
        
        {/* Product Image Frame */}
        <div className="image-frame">
          <div className="image-container">
            <img 
              src={image} 
              alt={name}
              className="product-image"
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
