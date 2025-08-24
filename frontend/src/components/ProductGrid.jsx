import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products = [], onAddToCart, onProductClick, className = "" }) => {
  // Default sample products if none provided
  const defaultProducts = [
    {
      id: 2,
      name: "SNAKE PLANT",
      category: "Cactus",
      price: 149,
      image: "/images/snake-plant.jpg"
    },
    {
      id: 6,
      name: "CANDELABRA ALOE",
      category: "Aloe Vera",
      price: 39,
      image: "/images/candelabra-aloe.jpg"
    },
    {
      id: 1,
      name: "GOLDEN POTHOS",
      category: "Pothos",
      price: 129,
      image: "/images/golden-pothos.jpg"
    },
    {
      id: 5,
      name: "HOMALOMENA",
      category: "Tropical",
      price: 119,
      image: "/images/homalomena.jpg"
    },
    {
      id: 4,
      name: "FIDDLE LEAF FIG",
      category: "Indoor Tree",
      price: 199,
      image: "/images/fiddle-leaf.jpg"
    },
    {
      id: 3,
      name: "PEACE LILY",
      category: "Flowering",
      price: 89,
      image: "/images/peace-lily.jpg"
    },
    
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  return (
    <div className={`product-grid ${className}`}>
      <div className="grid-container">
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            category={product.category}
            price={product.price}
            image={product.image}
            onAddToCart={onAddToCart}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
