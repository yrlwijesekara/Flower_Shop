import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiChevronLeft, FiChevronRight, FiHome } from 'react-icons/fi';
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

  // Generate shop URL with preserved state
  const getShopUrl = () => {
    const savedState = sessionStorage.getItem('returnFromProduct');
    if (savedState) {
      const state = JSON.parse(savedState);
      const params = new URLSearchParams();
      
      if (state.categoryFilter && state.categoryFilter !== 'all') {
        params.set('filter', state.categoryFilter);
      }
      if (state.activeTab && state.activeTab !== 'recent') {
        params.set('tab', state.activeTab);
      }
      if (state.searchQuery && state.searchQuery.trim()) {
        params.set('search', encodeURIComponent(state.searchQuery));
      }
      
      return params.toString() ? `/shop?${params.toString()}` : '/shop';
    }
    return '/shop';
  };

  // Sample product data - in a real app, this would come from an API
  const productData = {
    1: {
      id: 1,
      name: "Snake Plant",
      category: "Cactus",
      price: 149,
      rating: 5,
      description: "The Snake Plant, scientifically known as Sansevieria trifasciata, is the ultimate low-maintenance houseplant. With its striking sword-like leaves featuring dark green coloration and yellow edges, this architectural plant adds modern elegance to any space. Known as one of the best air-purifying plants, it releases oxygen at night, making it perfect for bedrooms. The Snake Plant is incredibly drought-tolerant and can survive in low light conditions, making it ideal for busy plant parents or those new to plant care. Its upright growth pattern makes it a perfect floor plant for corners and tight spaces.",
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
    2: {
      id: 2,
      name: "Candelabra Aloe",
      category: "Aloe Vera",
      price: 39,
      rating: 5,
      description: "The Candelabra Aloe is a spectacular architectural succulent that commands attention with its unique tree-like structure. This striking plant features thick, fleshy stems that branch out like a candelabra, topped with rosettes of blue-green, serrated leaves. Native to South Africa, this drought-tolerant beauty can grow up to 6 feet tall, making it an impressive floor plant. The Candelabra Aloe requires minimal water and thrives in bright light, making it perfect for sunny windows or outdoor patios in warm climates. Its sculptural form and low-maintenance nature make it ideal for modern, minimalist spaces or xerophytic gardens.",
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
    },
    3: {
      id: 3,
      name: "Golden Pothos",
      category: "Pothos",
      price: 69,
      rating: 5,
      description: "The Golden Pothos is one of the most popular and easy-to-care-for houseplants. Known for its heart-shaped leaves with beautiful golden variegation, this trailing plant is perfect for hanging baskets or climbing up moss poles. It's incredibly forgiving and can thrive in various light conditions, making it ideal for beginners. The Golden Pothos is also known for its air-purifying qualities, helping to remove common household toxins from the air. This fast-growing plant can reach impressive lengths and creates a lush, tropical atmosphere in any space.",
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
    4: {
      id: 4,
      name: "Homalomena",
      category: "Tropical",
      price: 119,
      rating: 4,
      description: "Homalomena is an exotic tropical houseplant that brings lush, jungle vibes to any indoor space. Known for its stunning heart-shaped leaves with unique silver-green patterns and burgundy undersides, this plant is a true conversation starter. Native to Southeast Asia, Homalomena thrives in warm, humid conditions and bright, indirect light. Its compact growth habit makes it perfect for tabletops, shelves, or as part of a plant collection. The plant's beautiful foliage changes color throughout the day as light shifts, creating a dynamic display of natural artistry. Easy to care for once established, it's perfect for plant enthusiasts looking for something unique.",
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
    5: {
      id: 5,
      name: "Fiddle Leaf Fig",
      category: "Indoor Tree",
      price: 89,
      rating: 5,
      description: "The Fiddle Leaf Fig is the ultimate statement plant for modern homes. With its large, violin-shaped leaves and impressive height potential (up to 6-10 feet indoors), this stunning plant creates a dramatic focal point in any room. Native to western Africa, the Fiddle Leaf Fig features thick, glossy leaves with prominent veining that catches and reflects light beautifully. While it requires bright, indirect light and consistent care, the reward is a magnificent tree-like plant that brings natural architecture to your space. Perfect for corners, next to windows, or as a living sculpture in minimalist interiors.",
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
    6: {
      id: 6,
      name: "Peace Lily",
      category: "Flowering",
      price: 45,
      rating: 5,
      description: "The Peace Lily is an elegant flowering houseplant renowned for its stunning white blooms and glossy, dark green foliage. This graceful plant naturally indicates when it needs water by gently drooping its leaves, making plant care intuitive and stress-free. Peace Lilies are exceptional air purifiers, removing harmful toxins like ammonia, benzene, and formaldehyde from indoor air. They thrive in medium to low light conditions and prefer consistent moisture. When happy, they produce beautiful white spathes that can bloom throughout the year, bringing natural beauty and serenity to any living space.",
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
    7: {
      id: 7,
      name: "Monstera Deliciosa",
      category: "Tropical",
      price: 79,
      rating: 5,
      description: "The Monstera Deliciosa, also known as the Swiss Cheese Plant, is a stunning tropical houseplant famous for its large, glossy leaves with distinctive natural holes called fenestrations. This Instagram-worthy plant creates dramatic split leaves as it matures, making it a true statement piece in any home. Native to Central America, the Monstera is a climbing plant that can grow quite large indoors with proper support. It's surprisingly easy to care for and thrives in bright, indirect light with regular watering. The unique leaf patterns and rapid growth make it a favorite among plant enthusiasts and interior designers alike.",
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
    8: {
      id: 8,
      name: "Rubber Plant",
      category: "Indoor Tree",
      price: 59,
      rating: 4,
      description: "The Rubber Plant (Ficus elastica) is a classic houseplant known for its thick, glossy, deep green leaves and impressive height potential. This elegant plant can grow into a beautiful indoor tree, making it perfect for corners that need a bold, natural focal point. Originally from India, the Rubber Plant is incredibly hardy and forgiving, tolerating various light conditions and occasional neglect. Its waxy leaves are easy to clean and maintain their shine with minimal care. The plant's upright growth habit and substantial presence make it an excellent choice for both modern and traditional home decor.",
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
    9: {
      id: 9,
      name: "ZZ Plant",
      category: "Low Light",
      price: 35,
      rating: 5,
      description: "The ZZ Plant (Zamioculcas zamiifolia) is the ultimate low-maintenance houseplant, perfect for anyone who wants greenery without the commitment. With its thick, waxy leaves that store water and its ability to thrive in low light conditions, the ZZ Plant is virtually indestructible. This resilient beauty can go weeks without water and still look stunning. Its glossy, dark green foliage grows in an attractive upright pattern, adding modern sophistication to any space. Native to Eastern Africa, the ZZ Plant is drought-tolerant and can adapt to various indoor environments, making it perfect for offices, apartments, or homes with limited natural light.",
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
    10: {
      id: 10,
      name: "Philodendron",
      category: "Tropical",
      price: 55,
      rating: 4,
      description: "The Philodendron is a diverse family of tropical plants beloved for their heart-shaped leaves and easy-going nature. These versatile plants come in both climbing and non-climbing varieties, with beautiful foliage that ranges from deep green to variegated patterns. Philodendrons are perfect for beginners as they're very forgiving and adapt well to indoor conditions. They thrive in bright, indirect light and prefer their soil to dry out slightly between waterings. Many varieties can be trained to climb moss poles or left to trail gracefully from hanging baskets, making them incredibly versatile for any home decor style.",
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
    11: {
      id: 11,
      name: "Spider Plant",
      category: "Air Purifying",
      price: 25,
      rating: 4,
      description: "The Spider Plant (Chlorophytum comosum) is a cheerful, fast-growing houseplant known for its long, arching leaves and adorable baby plantlets that dangle like spiders from the mother plant. This NASA-approved air purifier is excellent at removing formaldehyde and xylene from indoor air. Spider Plants are incredibly easy to propagate - simply pot up the baby plants to create new plants for friends or to expand your collection. They thrive in bright, indirect light and are very tolerant of different growing conditions. With their cascading growth habit, they're perfect for hanging baskets or elevated planters where their babies can cascade freely.",
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
    12: {
      id: 12,
      name: "Dracaena",
      category: "Low Light",
      price: 65,
      rating: 4,
      description: "The Dracaena is an elegant, architectural plant known for its sword-like leaves and striking upright growth pattern. This diverse genus includes many varieties with different leaf colors and patterns, from solid green to dramatic red and yellow stripes. Dracaenas are excellent air purifiers and can tolerate low light conditions, making them perfect for offices or darker corners of your home. They're also very drought-tolerant and prefer to dry out between waterings. With their clean lines and modern appearance, Dracaenas add a touch of sophistication to any space while requiring minimal care and attention.",
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
    13: {
      id: 13,
      name: "Bridal Bouquet Rose",
      category: "Wedding Flowers",
      price: 189,
      rating: 5,
      description: "Our exquisite Bridal Bouquet Rose arrangement is crafted with the finest premium white and blush roses, symbolizing pure love and new beginnings. Each bouquet is hand-selected and artfully arranged by our master florists using only the freshest, most beautiful blooms. The soft color palette and elegant design make this bouquet perfect for weddings, anniversaries, or any romantic occasion. Wrapped in luxurious satin ribbon and finished with delicate baby's breath, this timeless arrangement captures the essence of romance and sophistication. Every rose is carefully chosen for its perfect bloom and lasting freshness to ensure your special day is absolutely perfect.",
      features: [
        "Hand-selected premium roses",
        "Same-day delivery available",
        "Professionally arranged by master florists"
      ],
      images: [
        "/images/wedding-1.jpg",
        "/images/product-1.png",
        "/images/product-2.png",
        "/images/product-3.png"
      ],
      inStock: true
    },
    14: {
      id: 14,
      name: "White Lily Arrangement",
      category: "Wedding Flowers",
      price: 145,
      rating: 4,
      description: "The White Lily Arrangement embodies pure elegance and grace, featuring stunning white lilies that symbolize rebirth and purity. This sophisticated arrangement is perfect for weddings, memorials, or any occasion requiring a touch of serene beauty. Each lily is carefully selected for its pristine white petals and sweet fragrance that fills the room with natural perfume. Our skilled florists arrange these majestic blooms with complementary greenery and delicate accent flowers to create a harmonious display. The timeless beauty of white lilies makes this arrangement a classic choice that never goes out of style.",
      features: [
        "Fresh, fragrant white lilies",
        "Professional floral design",
        "Suitable for various occasions"
      ],
      images: [
        "/images/wedding-2.jpg",
        "/images/product-1.png",
        "/images/product-2.png",
        "/images/product-3.png"
      ],
      inStock: true
    },
    15: {
      id: 15,
      name: "Wedding Centerpiece",
      category: "Wedding Flowers",
      price: 225,
      rating: 5,
      description: "Our spectacular Wedding Centerpiece is designed to be the crowning jewel of your reception tables. This luxurious arrangement features a carefully curated selection of premium flowers including roses, peonies, and seasonal blooms in romantic whites and soft pastels. Each centerpiece is custom-designed to complement your wedding theme while creating an atmosphere of romance and celebration. The arrangement includes elegant candles and sophisticated greenery to create depth and ambiance. Perfect for head tables, guest tables, or ceremony displays, this centerpiece will create unforgettable memories and stunning photographs that will last a lifetime.",
      features: [
        "Custom-designed for your wedding",
        "Premium seasonal flowers",
        "Includes elegant candle accents"
      ],
      images: [
        "/images/wedding-3.jpg",
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
          { icon: <FiHome size={25} color="#000000" />, href: '/' },
          { label: 'Shop', href: getShopUrl() },
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
