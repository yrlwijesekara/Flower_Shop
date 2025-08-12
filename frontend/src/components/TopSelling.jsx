import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import "./TopSelling.css"

const TopSellingFlowers = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('flowerShopCart');
    if (savedCart && savedCart !== '[]') {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart && parsedCart.length > 0) {
          setCart(parsedCart);
        }
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
    setIsCartLoaded(true);
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem('flowerShopCart', JSON.stringify(cart));
      // Trigger cart update event for navbar after localStorage is updated
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
  }, [cart, isCartLoaded]);

  const plants = [
    {
      id: 101,
      name: "SNAKE PLANT",
      category: "Cactus",
      price: 149,
      image: "/topselling/top1.jpg"
    },
    {
      id: 102,
      name: "CANDELABRA ALOE",
      category: "Aloe Vera",
      price: 39,
      image: "/topselling/top2.jpg"
    },
    {
      id: 103,
      name: "GOLDEN POTHOS",
      category: "Pothos",
      price: 69,
      image: "/topselling/top3.jpg"
    },
    {
      id: 104,
      name: "HOMALOMENA",
      category: "Bonnie",
      price: 119,
      image: "/topselling/top4.jpg"
    }
  ];

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    
    // Simple notification
    alert(`${product.name} added to cart!`);
  };

  const handleViewMore = () => {
    navigate('/shop');
  };

  return (
    <div className="top-selling-container">
      <h1 className="top-selling-title">
        <span className="green">TOP SELLING</span> FLOWERS
      </h1>

      <div className="top-selling-plants-grid">
        {plants.map((plant) => (
          <ProductCard
            key={plant.id}
            id={plant.id}
            name={plant.name}
            category={plant.category}
            price={plant.price}
            image={plant.image}
            onAddToCart={handleAddToCart}
            className="top-selling-card"
          />
        ))}
      </div>

      <div className="top-selling-view-more-container">
        <button className="top-selling-view-more-btn" onClick={handleViewMore}>
          View More
        </button>
      </div>
    </div>
  );
};

export default TopSellingFlowers;