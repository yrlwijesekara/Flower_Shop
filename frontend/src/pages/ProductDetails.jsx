import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import MiniNavbar from '../components/MiniNavbar';
import Footer from '../components/Footer';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);

  // Sample product data - in a real app, this would come from an API
  const productData = {
    1: {
      id: 1,
      name: "Golden Pothos",
      category: "Pothos",
      price: 129,
      rating: 5,
      description: "Plants are mainly multicellular organisms, predominantly photosynthetic eukaryotes of the kingdom Plantae. Historically, plants were treated as one of two kingdoms including all living things that were not animals, and all algae and fungi were treated as plants. However, all current definitions of Plantae exclude the fungi and some algae, as well as the prokaryotes.",
      features: [
        "Free shipping on all orders over $100",
        "14 days easy refund & returns",
        "Product taxes and customs duties included"
      ],
      images: [
        "/images/golden-pothos.jpg",
        "/images/product-1.png",
        "/images/product-2.png",
        "/images/product-3.png"
      ],
      inStock: true
    },
    2: {
      id: 2,
      name: "Snake Plant",
      category: "Cactus",
      price: 149,
      rating: 5,
      description: "The Snake Plant, also known as Sansevieria, is a hardy succulent that can grow anywhere between 6 inches to several feet. These plants are very easy to grow and require minimal care, making them perfect for beginners.",
      features: [
        "Free shipping on all orders over $100",
        "14 days easy refund & returns",
        "Product taxes and customs duties included"
      ],
      images: [
        "/images/snake-plant.jpg",
        "/images/product-1.png",
        "/images/product-2.png",
        "/images/product-3.png"
      ],
      inStock: true
    },
    3: {
      id: 3,
      name: "Peace Lily",
      category: "Lily",
      price: 89,
      rating: 4,
      description: "Peace Lilies are beautiful flowering plants that thrive in low light conditions. They're excellent for improving indoor air quality and add a touch of elegance to any space.",
      features: [
        "Free shipping on all orders over $100",
        "14 days easy refund & returns",
        "Product taxes and customs duties included"
      ],
      images: [
        "/images/peace-lily.jpg",
        "/images/product-1.png",
        "/images/product-2.png",
        "/images/product-3.png"
      ],
      inStock: true
    },
    4: {
      id: 4,
      name: "Fiddle Leaf",
      category: "Fig",
      price: 199,
      rating: 5,
      description: "The Fiddle Leaf Fig is a popular indoor tree with large, glossy leaves. It's a statement piece that can grow quite tall and adds a dramatic touch to any room.",
      features: [
        "Free shipping on all orders over $100",
        "14 days easy refund & returns",
        "Product taxes and customs duties included"
      ],
      images: [
        "/images/fiddle-leaf.jpg",
        "/images/product-1.png",
        "/images/product-2.png",
        "/images/product-3.png"
      ],
      inStock: true
    },
    5: {
      id: 5,
      name: "Homalomena",
      category: "Tropical",
      price: 119,
      rating: 4,
      description: "Homalomena is a beautiful tropical plant with heart-shaped leaves. It's perfect for adding a tropical feel to your indoor garden and thrives in medium to bright indirect light.",
      features: [
        "Free shipping on all orders over $100",
        "14 days easy refund & returns",
        "Product taxes and customs duties included"
      ],
      images: [
        "/images/homalomena.jpg",
        "/images/product-1.png",
        "/images/product-2.png",
        "/images/product-3.png"
      ],
      inStock: true
    },
    6: {
      id: 6,
      name: "Candelabra Aloe",
      category: "Succulent",
      price: 89,
      rating: 5,
      description: "The Candelabra Aloe is a striking succulent with tall, branching stems. It's drought-tolerant and perfect for those who want a low-maintenance plant with architectural appeal.",
      features: [
        "Free shipping on all orders over $100",
        "14 days easy refund & returns",
        "Product taxes and customs duties included"
      ],
      images: [
        "/images/candelabra-aloe.jpg",
        "/images/product-1.png",
        "/images/product-2.png",
        "/images/product-3.png"
      ],
      inStock: true
    }
  };

  useEffect(() => {
    const foundProduct = productData[id];
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // If product not found, redirect to shop page
      navigate('/shop');
    }
  }, [id, navigate]);

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    if (product) {
      // Add to cart logic here
      const cartItem = {
        ...product,
        quantity,
        image: product.images[selectedImage]
      };
      
      // Get existing cart items
      const existingCart = JSON.parse(localStorage.getItem('flowerShopCart') || '[]');
      
      // Check if item already exists
      const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        existingCart.push(cartItem);
      }
      
      localStorage.setItem('flowerShopCart', JSON.stringify(existingCart));
      
      // Show success message or redirect
      alert(`Added ${quantity} ${product.name}(s) to cart!`);
    }
  };

  const nextImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  if (!product) {
    return (
      <div className="loading-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <Navbar />
      <MiniNavbar 
        breadcrumbs={[
          { icon: <span>🏠</span>, href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: 'Product Details', href: '#' }
        ]}
        showFilters={false}
      />
      
      <div className="product-details-container">
        <div className="product-content">
          {/* Photo Frame */}
          <div className="photo-frame">
            <div className="main-image-container">
              <button className="nav-btn prev-btn" onClick={prevImage}>
                <FiChevronLeft size={24} />
              </button>
              
              <div className="main-image">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDc1IiBoZWlnaHQ9IjUzNCIgdmlld0JveD0iMCAwIDQ3NSA1MzQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0NzUiIGhlaWdodD0iNTM0IiBmaWxsPSIjRjBGMEYwIiByeD0iNSIvPgo8cGF0aCBkPSJNMjAwIDIwMEwyNzUgMjc1TDIwMCAzNTBMMTI1IDI3NUwyMDAgMjAwWiIgZmlsbD0iIzVCQzU1OSIvPgo8cGF0aCBkPSJNMjUwIDMwMEwzMjUgMzc1TDI1MCA0NTBMMTU1IDM3NUwyNTAgMzAwWiIgZmlsbD0iIzVCQzU1OSIvPgo8L3N2Zz4K';
                  }}
                />
              </div>
              
              <button className="nav-btn next-btn" onClick={nextImage}>
                <FiChevronRight size={24} />
              </button>
            </div>
            
            <div className="thumbnail-container">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA5MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjkwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjRjBGMEYwIiByeD0iNSIvPgo8cGF0aCBkPSJNMzAgMzBMNjAgNjBMMzAgOTBMMCA2MEwzMCAzMFoiIGZpbGw9IiM1QkM1NTkiLz4KPC9zdmc+Cg==';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-category">{product.category}</p>
            
            <div className="rating-container">
              {renderStars(product.rating)}
            </div>
            
            <div className="price-container">
              <span className="price">${product.price}</span>
            </div>
            
            <div className="description-container">
              <p className="description">{product.description}</p>
            </div>
            
            {/* Quantity Selector */}
            <div className="quantity-section">
              <button 
                className="quantity-btn minus"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button 
                className="quantity-btn plus"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
            
            {/* Add to Cart Button */}
            <button className="add-to-cart-main" onClick={handleAddToCart}>
              <span className="cart-text">ADD TO CART</span>
              <FiShoppingCart className="cart-icon" size={20} />
            </button>
            
            {/* Product Features */}
            <div className="features-container">
              {product.features.map((feature, index) => (
                <p key={index} className="feature-item">• {feature}</p>
              ))}
            </div>
            
            {/* Secure Payments */}
            <div className="secure-payments">
              <p className="secure-text">Secure Payments</p>
              <div className="payment-icons">
                <div className="payment-icon visa"></div>
                <div className="payment-icon mastercard"></div>
                <div className="payment-icon amex"></div>
                <div className="payment-icon paypal"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="product-tabs">
          <div className="tab-nav">
            <button className="tab-btn active">Description</button>
            <button className="tab-btn">Reviews</button>
            <button className="tab-btn">Shipping & Returns</button>
          </div>
          
          <div className="tab-content">
            <div className="tab-section">
              <h3 className="section-title">Your Personal Assistant</h3>
              <p className="section-description">
                Welcome to the next generation of assistance with our Future Helper Robot. Engineered with cutting-edge artificial intelligence, this robotic companion serves as your personal assistant, seamlessly integrating into your daily routine to enhance productivity and convenience. Whether you need help with scheduling, organization, or simply a friendly chat, our Future Helper Robot is always at your service, learning from your preferences and adapting to your needs over time.
              </p>
            </div>
            
            <div className="tab-section">
              <h3 className="section-title">Effortless Household Management</h3>
              <p className="section-description">
                Say goodbye to mundane chores and hello to newfound freedom with our Future Helper Robot. Equipped with nimble mobility and dexterous manipulators, it effortlessly navigates through your home, tackling tasks with precision and efficiency.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetails;
