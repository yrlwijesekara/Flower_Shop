import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products = [], onAddToCart, className = "" }) => {
  // Default sample products if none provided
  const defaultProducts = [
    {
      id: 1,
      name: "SNAKE PLANT",
      category: "Cactus",
      price: 149,
      image: "/images/snake-plant.jpg"
    },
    {
      id: 2,
      name: "CANDELABRA ALOE",
      category: "Aloe Vera",
      price: 39,
      image: "/images/candelabra-aloe.jpg"
    },
    {
      id: 3,
      name: "GOLDEN POTHOS",
      category: "Pothos",
      price: 69,
      image: "/images/golden-pothos.jpg"
    },
    {
      id: 4,
      name: "HOMALOMENA",
      category: "Tropical",
      price: 119,
      image: "/images/homalomena.jpg"
    },
    {
      id: 5,
      name: "FIDDLE LEAF FIG",
      category: "Indoor Tree",
      price: 89,
      image: "/images/fiddle-leaf.jpg"
    },
    {
      id: 6,
      name: "PEACE LILY",
      category: "Flowering",
      price: 45,
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
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
