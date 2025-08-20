import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiChevronLeft, FiChevronRight, FiHome } from 'react-icons/fi';
import { productAPI } from '../services/api';
import Navbar from '../components/Navbar';
import MiniNavbar from '../components/MiniNavbar';
import Footer from '../components/Footer';
import TopSellingFlowers from '../components/TopSelling';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  // Enhanced fallback product data with full database schema structure
  const productData = {
    1: {
      id: 1,
      name: "SNAKE PLANT",
      category: "Cactus",
      price: 149,
      rating: 5,
      description: "The Snake Plant, scientifically known as Sansevieria trifasciata, is the ultimate low-maintenance houseplant. With its striking sword-like leaves featuring dark green coloration and yellow edges, this architectural plant adds modern elegance to any space. Known as one of the best air-purifying plants, it releases oxygen at night, making it perfect for bedrooms. The Snake Plant is incredibly drought-tolerant and can survive in low light conditions, making it ideal for busy plant parents or those new to plant care. Its upright growth pattern makes it a perfect floor plant for corners and tight spaces.",
      features: [
        "Free shipping on all orders over $100",
        "14 days easy refund & returns",
        "Product taxes and customs duties included"
      ],
      image: "/images/snake-plant.jpg",
      gallery: [
        "/images/product-1.png",
        "/images/product-2.png",
        "/images/product-3.png"
      ],
      images: [
        "/images/snake-plant.jpg",
        "/images/product-1.png",
        "/images/product-2.png",
        "/images/product-3.png"
      ],
      specifications: {
        size: "Medium (12-16 inches tall)",
        height: "12-16 inches",
        potSize: "6 inch decorative pot",
        origin: "West Africa"
      },
      plantDetails: {
        sunlight: "Low Light",
        water: "Every 2 weeks",
        soil: "Well-draining potting mix",
        temperature: "65-75°F (18-24°C)",
        humidity: "Low (30-40%)",
        toxicity: "Toxic to cats and dogs"
      },
      careInstructions: {
        difficulty: "Easy",
        placement: "Perfect for bedrooms, offices, or any low-light area",
        watering: "Water when soil is completely dry, typically every 2-3 weeks. Overwatering is the most common cause of problems.",
        feeding: "Feed monthly during spring and summer with diluted liquid fertilizer",
        pruning: "Remove dead or damaged leaves at the base. Wipe leaves with damp cloth monthly.",
        repotting: "Repot every 2-3 years or when rootbound"
      },
      reviews: [
        {
          id: 1,
          name: "Sarah Johnson",
          rating: 5,
          date: "2024-01-15",
          comment: "Amazing plant! I've had it for 6 months and it's thriving with minimal care. Perfect for beginners like me. The leaves are so beautiful and architectural.",
          verified: true
        },
        {
          id: 2,
          name: "Mike Chen",
          rating: 5,
          date: "2024-01-08",
          comment: "This snake plant is exactly what I needed for my bedroom. It really does purify the air and I love that it releases oxygen at night. Highly recommend!",
          verified: true
        },
        {
          id: 3,
          name: "Emma Williams",
          rating: 4,
          date: "2023-12-22",
          comment: "Great quality plant, arrived in perfect condition. It's been growing steadily and looks fantastic in my living room corner.",
          verified: true
        },
        {
          id: 4,
          name: "David Rodriguez",
          rating: 5,
          date: "2023-12-18",
          comment: "I'm terrible with plants but this one is impossible to kill! It's been 4 months and it still looks amazing. The packaging was excellent too.",
          verified: true
        }
      ],
      inStock: true
    },
    2: {
      id: 2,
      name: "CANDELABRA ALOE",
      category: "Aloe Vera",
      price: 39,
      rating: 5,
      description: "The Candelabra Aloe is a spectacular architectural succulent that commands attention with its unique tree-like structure. This striking plant features thick, fleshy stems that branch out like a candelabra, topped with rosettes of blue-green, serrated leaves. Native to South Africa, this drought-tolerant beauty can grow up to 6 feet tall, making it an impressive floor plant. The Candelabra Aloe requires minimal water and thrives in bright light, making it perfect for sunny windows or outdoor patios in warm climates. Its sculptural form and low-maintenance nature make it ideal for modern, minimalist spaces or xerophytic gardens.",
      features: [
        "Free shipping on all orders over $100",
        "14 days easy refund & returns",
        "Product taxes and customs duties included"
      ],
      image: "/images/candelabra-aloe.jpg",
      gallery: [
        "/images/product-1.png",
        "/images/product-2.png",
        "/images/product-3.png"
      ],
      images: [
        "/images/candelabra-aloe.jpg",
        "/images/product-1.png",
        "/images/product-2.png",
        "/images/product-3.png"
      ],
      specifications: {
        size: "Large (2-4 feet tall)",
        height: "2-4 feet",
        potSize: "10 inch pot",
        origin: "South Africa"
      },
      plantDetails: {
        sunlight: "Bright Indirect Light",
        water: "Every 2-3 weeks",
        soil: "Cactus/Succulent mix",
        temperature: "70-80°F (21-27°C)",
        humidity: "Low (30-40%)",
        toxicity: "Pet Safe"
      },
      careInstructions: {
        difficulty: "Easy",
        placement: "Bright window with indirect sunlight, can handle some direct morning sun",
        watering: "Water deeply but infrequently. Allow soil to dry completely between waterings.",
        feeding: "Feed once in spring and once in summer with cactus fertilizer",
        pruning: "Remove dead or damaged branches. Use gloves as sap can be irritating."
      },
      reviews: [
        {
          id: 1,
          name: "Lisa Park",
          rating: 5,
          date: "2024-01-20",
          comment: "Absolutely stunning succulent! The candelabra shape is so unique and adds such character to my patio. Very drought tolerant as advertised.",
          verified: true
        },
        {
          id: 2,
          name: "James Thompson",
          rating: 5,
          date: "2024-01-12",
          comment: "Perfect for my modern minimalist space. The architectural form is exactly what I was looking for. Great value for money!",
          verified: true
        },
        {
          id: 3,
          name: "Anna Martinez",
          rating: 4,
          date: "2023-12-28",
          comment: "Beautiful plant, smaller than expected but still gorgeous. It's been thriving in my sunny window for weeks.",
          verified: true
        }
      ],
      inStock: true
    },
    3: {
      id: 3,
      name: "GOLDEN POTHOS",
      category: "Pothos",
      price: 69,
      rating: 5,
      description: "The Golden Pothos is one of the most popular and easy-to-care-for houseplants. Known for its heart-shaped leaves with beautiful golden variegation, this trailing plant is perfect for hanging baskets or climbing up moss poles. It's incredibly forgiving and can thrive in various light conditions, making it ideal for beginners. The Golden Pothos is also known for its air-purifying qualities, helping to remove common household toxins from the air. This fast-growing plant can reach impressive lengths and creates a lush, tropical atmosphere in any space.",
      features: [
        "Free shipping on all orders over $100",
        "14 days easy refund & returns",
        "Product taxes and customs duties included"
      ],
      image: "/images/golden-pothos.jpg",
      gallery: [
        "/images/product-1.png",
        "/images/product-2.png",
        "/images/product-3.png"
      ],
      images: [
        "/images/golden-pothos.jpg",
        "/images/product-1.png",
        "/images/product-2.png",
        "/images/product-3.png"
      ],
      specifications: {
        size: "Trailing (6-10 feet when mature)",
        height: "Trails up to 10 feet",
        potSize: "6-8 inch hanging basket",
        origin: "Solomon Islands"
      },
      plantDetails: {
        sunlight: "Medium Light",
        water: "Weekly",
        soil: "Regular potting soil",
        temperature: "65-75°F (18-24°C)",
        humidity: "Medium (40-60%)",
        toxicity: "Toxic to cats and dogs"
      },
      careInstructions: {
        difficulty: "Easy",
        placement: "Bright, indirect light. Can tolerate lower light conditions",
        watering: "Water when top inch of soil is dry, typically weekly",
        feeding: "Feed monthly during growing season with balanced liquid fertilizer",
        pruning: "Pinch back to encourage bushier growth. Propagate cuttings in water."
      },
      reviews: [
        {
          id: 1,
          name: "Rachel Green",
          rating: 5,
          date: "2024-01-18",
          comment: "Love this trailing plant! It's growing so fast and the golden variegation is beautiful. Perfect for my hanging basket.",
          verified: true
        },
        {
          id: 2,
          name: "Tom Wilson",
          rating: 5,
          date: "2024-01-10",
          comment: "Super easy to care for and propagate. I've already made 3 new plants from this one! Great air purifier too.",
          verified: true
        },
        {
          id: 3,
          name: "Maria Garcia",
          rating: 4,
          date: "2023-12-30",
          comment: "Beautiful plant that arrived healthy. It's been growing steadily and adds such a tropical feel to my home.",
          verified: true
        },
        {
          id: 4,
          name: "Alex Kim",
          rating: 5,
          date: "2023-12-25",
          comment: "Perfect beginner plant! Forgiving and beautiful. The heart-shaped leaves are so cute.",
          verified: true
        }
      ],
      inStock: true
    },
    4: {
      id: 4,
      name: "HOMALOMENA",
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
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      
      try {
        console.log('Fetching product with ID:', id);
        const response = await productAPI.getProduct(id);
        
        if (response.success && response.data) {
          console.log('Product fetched successfully:', response.data);
          // Ensure images array is properly formatted
          const productWithImages = {
            ...response.data,
            images: response.data.images || (response.data.image ? 
              [response.data.image, ...(response.data.gallery || [])] : 
              ['/images/placeholder.jpg'])
          };
          setProduct(productWithImages);
          setSelectedImage(0);
        } else {
          throw new Error(response.message || 'Product not found');
        }
        
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.message || 'Failed to load product');
        
        // Try to find product in fallback data
        const fallbackProduct = productData[id];
        if (fallbackProduct) {
          console.log('Using fallback product data');
          setProduct(fallbackProduct);
          setError('');
        } else {
          setTimeout(() => {
            navigate('/shop');
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
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
      
      // Trigger cart update event for navbar
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      // Show notification banner
      setNotification(`Added ${quantity} ${product.name}(s) to cart!`);
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification('');
      }, 3000);
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

  const calculateReviewStats = (reviews) => {
    if (!reviews || reviews.length === 0) return null;
    
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    reviews.forEach(review => {
      ratingCounts[review.rating]++;
    });

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingCounts
    };
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
      
      {/* Notification */}
      {notification && (
        <div className="product-details-notification">
          {notification}
        </div>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="product-details-loading" style={{
          textAlign: 'center',
          padding: '3rem',
          fontSize: '1.2rem',
          color: '#666'
        }}>
          Loading product details...
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="product-details-error" style={{
          backgroundColor: '#fee',
          color: 'red',
          padding: '1rem',
          margin: '1rem 2rem',
          borderRadius: '8px',
          border: '1px solid red',
          textAlign: 'center'
        }}>
          {error}
          {error.includes('Failed to load') && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Redirecting to shop page in 3 seconds...
            </p>
          )}
        </div>
      )}
      
      {/* Product Content - Only show if product is loaded and no error */}
      {!loading && product && !error && (
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
                  src={product.images && product.images.length > 0 ? product.images[selectedImage] : (product.image || '/images/placeholder.jpg')} 
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
              {product.images && product.images.length > 1 && product.images.map((image, index) => (
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
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviews ? product.reviews.length : 0})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'care' ? 'active' : ''}`}
              onClick={() => setActiveTab('care')}
            >
              Care Guide
            </button>
            <button 
              className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
            <button 
              className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
              onClick={() => setActiveTab('shipping')}
            >
              Shipping & Returns
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'description' && (
              <>
                <div className="tab-section">
                  <h3 className="section-title">Product Description</h3>
                  <p className="section-description">
                    {product.description}
                  </p>
                  {product.shortDescription && (
                    <p className="section-description short-desc">
                      {product.shortDescription}
                    </p>
                  )}
                </div>
                
                {product.plantDetails && (
                  <div className="tab-section">
                    <h3 className="section-title">Quick Care Overview</h3>
                    <div className="care-overview-grid">
                      {product.plantDetails.sunlight && (
                        <div className="care-item">
                          <strong>☀️ Light:</strong> {product.plantDetails.sunlight}
                        </div>
                      )}
                      {product.plantDetails.water && (
                        <div className="care-item">
                          <strong>💧 Water:</strong> {product.plantDetails.water}
                        </div>
                      )}
                      {product.plantDetails.difficulty && (
                        <div className="care-item">
                          <strong>🎯 Difficulty:</strong> {product.careInstructions?.difficulty || 'Easy'}
                        </div>
                      )}
                      {product.plantDetails.toxicity && (
                        <div className="care-item">
                          <strong>🐕 Pet Safety:</strong> {product.plantDetails.toxicity}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {product.features && product.features.length > 0 && (
                  <div className="tab-section">
                    <h3 className="section-title">What's Included</h3>
                    <ul className="features-list">
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-section">
                {product.reviews && product.reviews.length > 0 ? (
                  <>
                    <div className="reviews-summary">
                      <div className="rating-overview">
                        <div className="average-rating">
                          <span className="rating-number">{calculateReviewStats(product.reviews)?.averageRating || 0}</span>
                          <div className="rating-stars">
                            {renderStars(Math.round(calculateReviewStats(product.reviews)?.averageRating || 0))}
                          </div>
                          <span className="review-count">
                            {calculateReviewStats(product.reviews)?.totalReviews || 0} reviews
                          </span>
                        </div>
                        
                        <div className="rating-breakdown">
                          {[5, 4, 3, 2, 1].map(rating => {
                            const stats = calculateReviewStats(product.reviews);
                            const count = stats?.ratingCounts[rating] || 0;
                            const percentage = stats ? (count / stats.totalReviews) * 100 : 0;
                            
                            return (
                              <div key={rating} className="rating-bar">
                                <span className="rating-label">{rating} ★</span>
                                <div className="bar-container">
                                  <div 
                                    className="bar-fill" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="rating-count">({count})</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="reviews-list">
                      <h3 className="section-title">Customer Reviews</h3>
                      {product.reviews.map((review, index) => (
                        <div key={review.id} className="review-item">
                          <div className="review-header">
                            <div className="reviewer-info">
                              <span className="reviewer-name">{review.name}</span>
                              {review.verified && (
                                <span className="verified-badge">✓ Verified Purchase</span>
                              )}
                            </div>
                            <div className="review-meta">
                              <div className="review-rating">
                                {renderStars(review.rating)}
                              </div>
                              <span className="review-date">
                                {new Date(review.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                          </div>
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="no-reviews">
                    <h3>No reviews yet</h3>
                    <p>Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'care' && (
              <>
                {product.careInstructions && (
                  <>
                    {product.careInstructions.placement && (
                      <div className="tab-section">
                        <h3 className="section-title">🏠 Placement</h3>
                        <p className="section-description">{product.careInstructions.placement}</p>
                      </div>
                    )}
                    
                    {product.careInstructions.watering && (
                      <div className="tab-section">
                        <h3 className="section-title">💧 Watering</h3>
                        <p className="section-description">{product.careInstructions.watering}</p>
                      </div>
                    )}
                    
                    {product.careInstructions.feeding && (
                      <div className="tab-section">
                        <h3 className="section-title">🌱 Feeding</h3>
                        <p className="section-description">{product.careInstructions.feeding}</p>
                      </div>
                    )}
                    
                    {product.careInstructions.pruning && (
                      <div className="tab-section">
                        <h3 className="section-title">✂️ Pruning & Maintenance</h3>
                        <p className="section-description">{product.careInstructions.pruning}</p>
                      </div>
                    )}
                    
                    {product.careInstructions.repotting && (
                      <div className="tab-section">
                        <h3 className="section-title">🏺 Repotting</h3>
                        <p className="section-description">{product.careInstructions.repotting}</p>
                      </div>
                    )}
                    
                    {product.careInstructions.commonIssues && (
                      <div className="tab-section">
                        <h3 className="section-title">⚠️ Common Issues</h3>
                        <p className="section-description">{product.careInstructions.commonIssues}</p>
                      </div>
                    )}
                  </>
                )}
                
                {product.plantDetails && (
                  <div className="tab-section">
                    <h3 className="section-title">📊 Plant Requirements</h3>
                    <div className="plant-details-grid">
                      {product.plantDetails.sunlight && (
                        <div className="detail-item">
                          <span className="detail-label">☀️ Sunlight:</span>
                          <span className="detail-value">{product.plantDetails.sunlight}</span>
                        </div>
                      )}
                      {product.plantDetails.water && (
                        <div className="detail-item">
                          <span className="detail-label">💧 Watering:</span>
                          <span className="detail-value">{product.plantDetails.water}</span>
                        </div>
                      )}
                      {product.plantDetails.soil && (
                        <div className="detail-item">
                          <span className="detail-label">🌱 Soil:</span>
                          <span className="detail-value">{product.plantDetails.soil}</span>
                        </div>
                      )}
                      {product.plantDetails.temperature && (
                        <div className="detail-item">
                          <span className="detail-label">🌡️ Temperature:</span>
                          <span className="detail-value">{product.plantDetails.temperature}</span>
                        </div>
                      )}
                      {product.plantDetails.humidity && (
                        <div className="detail-item">
                          <span className="detail-label">💨 Humidity:</span>
                          <span className="detail-value">{product.plantDetails.humidity}</span>
                        </div>
                      )}
                      {product.plantDetails.toxicity && (
                        <div className="detail-item">
                          <span className="detail-label">🐕 Pet Safety:</span>
                          <span className="detail-value">{product.plantDetails.toxicity}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
            
            {activeTab === 'specifications' && (
              <>
                {product.specifications && (
                  <div className="tab-section">
                    <h3 className="section-title">📏 Plant Specifications</h3>
                    <div className="specifications-grid">
                      {product.specifications.size && (
                        <div className="spec-item">
                          <span className="spec-label">Size:</span>
                          <span className="spec-value">{product.specifications.size}</span>
                        </div>
                      )}
                      {product.specifications.height && (
                        <div className="spec-item">
                          <span className="spec-label">Height:</span>
                          <span className="spec-value">{product.specifications.height}</span>
                        </div>
                      )}
                      {product.specifications.spread && (
                        <div className="spec-item">
                          <span className="spec-label">Spread:</span>
                          <span className="spec-value">{product.specifications.spread}</span>
                        </div>
                      )}
                      {product.specifications.potSize && (
                        <div className="spec-item">
                          <span className="spec-label">Pot Size:</span>
                          <span className="spec-value">{product.specifications.potSize}</span>
                        </div>
                      )}
                      {product.specifications.weight && (
                        <div className="spec-item">
                          <span className="spec-label">Weight:</span>
                          <span className="spec-value">{product.specifications.weight}</span>
                        </div>
                      )}
                      {product.specifications.origin && (
                        <div className="spec-item">
                          <span className="spec-label">Origin:</span>
                          <span className="spec-value">{product.specifications.origin}</span>
                        </div>
                      )}
                      {product.specifications.bloomTime && (
                        <div className="spec-item">
                          <span className="spec-label">Bloom Time:</span>
                          <span className="spec-value">{product.specifications.bloomTime}</span>
                        </div>
                      )}
                      {product.specifications.hardiness && (
                        <div className="spec-item">
                          <span className="spec-label">Hardiness:</span>
                          <span className="spec-value">{product.specifications.hardiness}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {product.tags && product.tags.length > 0 && (
                  <div className="tab-section">
                    <h3 className="section-title">🏷️ Tags</h3>
                    <div className="tags-container">
                      {product.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'shipping' && (
              <>
                <div className="tab-section">
                  <h3 className="section-title">Shipping Information</h3>
                  <ul className="shipping-list">
                    {product.shipping?.freeShipping ? (
                      <li>✓ Free shipping included</li>
                    ) : (
                      <li>Free shipping on orders over $100</li>
                    )}
                    <li>{product.shipping?.shippingTime || 'Standard delivery: 3-5 business days'}</li>
                    <li>Express delivery: 1-2 business days (additional charges apply)</li>
                    <li>{product.shipping?.packaging || 'Carefully packaged to ensure plant safety'}</li>
                    <li>Tracking information provided via email</li>
                  </ul>
                </div>
                
                <div className="tab-section">
                  <h3 className="section-title">Returns & Refunds</h3>
                  <ul className="shipping-list">
                    <li>{product.shipping?.returnPolicy || '14-day return policy for live plants'}</li>
                    <li>Plants must be in original condition</li>
                    <li>Photo documentation required for damaged plants</li>
                    <li>Refunds processed within 5-7 business days</li>
                    <li>Return shipping costs covered for damaged items</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      )}
      
      <TopSellingFlowers
        titleFirst='YOU MAY'
        titleSecond='ALSO LIKE'
      />
      
      <Footer />
    </div>
  );
};

export default ProductDetails;
