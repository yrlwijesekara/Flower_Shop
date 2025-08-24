import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from './ProductCard';
import "./TopSelling.css"

const TopSellingFlowers = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Fetch popular products
  useEffect(() => {
    const fetchPopularProducts = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fetch popular products from API
        const response = await productAPI.getProducts({
          tab: 'popular',
          limit: 4
        });
        
        if (response.success && response.data) {
          setPopularProducts(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch popular products');
        }
        
      } catch (error) {
        console.error('Error fetching popular products:', error);
        setError('Failed to load popular products');
        
        // Fallback to hardcoded products if API fails
        setPopularProducts([
          {
            id: 1,
            name: "SNAKE PLANT",
            category: "Cactus",
            price: 149,
            image: "/topselling/top1.jpg"
          },
          {
            id: 2,
            name: "CANDELABRA ALOE",
            category: "Aloe Vera",
            price: 39,
            image: "/topselling/top2.jpg"
          },
          {
            id: 3,
            name: "GOLDEN POTHOS",
            category: "Pothos",
            price: 69,
            image: "/topselling/top3.jpg"
          },
          {
            id: 4,
            name: "HOMALOMENA",
            category: "Tropical",
            price: 119,
            image: "/topselling/top4.jpg"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

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

      {loading ? (
        <div className="top-selling-loading" style={{
          textAlign: 'center',
          padding: '2rem',
          fontSize: '1.1rem',
          color: '#666'
        }}>
          Loading popular products...
        </div>
      ) : error ? (
        <div className="top-selling-error" style={{
          textAlign: 'center',
          padding: '2rem',
          fontSize: '1rem',
          color: '#e74c3c',
          backgroundColor: '#fee',
          margin: '1rem 0',
          borderRadius: '8px',
          border: '1px solid #e74c3c'
        }}>
          {error}
        </div>
      ) : (
        <>
          <div className="top-selling-plants-grid">
            {popularProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                id={product._id || product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                image={product.image}
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
        </>
      )}
    </div>
  );
};

export default TopSellingFlowers;