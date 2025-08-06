import React from 'react';
import './OtherProducts.css';

const OtherProducts = ({ className = "" }) => {
  const otherProducts = [
    {
      id: 1,
      name: "CANDELABRA ALOE",
      price: 28,
      rating: 5,
      image: "/images/candelabra-aloe.jpg"
    },
    {
      id: 2,
      name: "",
      price: 25,
      rating: 4,
      image: "/images/homalomena.jpg"
    },
    {
      id: 3,
      name: "SNAKE PLANT",
      price: 48,
      rating: 3,
      image: "/images/snake-plant.jpg"
    },
    {
      id: 4,
      name: "GOLDEN POTHOS",
      price: 17,
      rating: 2,
      image: "/images/golden-pothos.jpg"
    },
    {
      id: 5,
      name: "cactus",
      price: 8,
      rating: 5,
      image: "/images/placeholder.jpg"
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <div key={`full-${i}`} className="other-products-star other-products-full-star"></div>
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="other-products-star other-products-half-star"></div>
      );
    }

    return stars;
  };

  return (
    <div className={`other-products-container ${className}`}>
      {/* Other Products Header */}
      <div className="other-products-header">
        <div className="other-products-header-background">
          <h2 className="other-products-header-title">Other Products</h2>
        </div>
      </div>

      {/* Products List */}
      <div className="other-products-list">
        {otherProducts.map((product, index) => (
          <div key={product.id} className="other-products-item">
            <div className="other-products-card-frame">
              <div className="other-products-card-background">
                {/* Product Image */}
                <div className="other-products-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="other-products-image"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEzIiBoZWlnaHQ9IjExMyIgdmlld0JveD0iMCAwIDExMyAxMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMTMiIGhlaWdodD0iMTEzIiBmaWxsPSIjRjBGMEYwIiByeD0iNTYuNSIvPgo8cGF0aCBkPSJNNDUgMzVMNTUgNDVMNDUgNTVMMzUgNDVMNDUgMzVaIiBmaWxsPSIjNUJDNTU5Ii8+CjxwYXRoIGQ9Ik02OCA2MEw3OCA3MEw2OCA4MEw1OCA3MEw2OCA2MFoiIGZpbGw9IiM1QkM1NTkiLz4KPC9zdmc+Cg==';
                    }}
                  />
                </div>

                {/* Product Name */}
                {product.name && (
                  <h3 className="other-products-name">{product.name}</h3>
                )}

                {/* Rating Stars */}
                <div className="other-products-rating-container">
                  {renderStars(product.rating)}
                </div>

                {/* Price */}
                <div className="other-products-price-container">
                  <div className="other-products-price-background">
                    <span className="other-products-price-text">${product.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherProducts;
