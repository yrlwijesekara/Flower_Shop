import React from 'react';
import "./TopSelling.css"

const PlantCard = ({ name, category, price, image, alt }) => {
  return (
    <div className="top-selling-plant-card">
      <div className="top-selling-plant-image-container">
        <img src={image} alt={alt} className="top-selling-plant-image" />
      </div>
      <div className="top-selling-plant-info">
        <div className='top-selling-plant-des'>
            <h3 className="top-selling-plant-name">{name}</h3>
            <p className="top-selling-plant-price">${price}</p>
        </div>
        <p className="top-selling-plant-category">{category}</p>
        <button className="top-selling-add-to-cart-btn">
          ADD TO CART 🛒
        </button>
      </div>
    </div>
  );
};

const TopSellingFlowers = () => {
  const plants = [
    {
      name: "SNAKE PLANT",
      category: "Cactus",
      price: "149",
      image: "/topselling/top1.jpg",
      alt: "Snake Plant"
    },
    {
      name: "CANDELABRA ALOE",
      category: "Aloe Vera",
      price: "39",
      image: "/topselling/top2.jpg",
      alt: "Candelabra Aloe"
    },
    {
      name: "GOLDEN POTHOS",
      category: "Pothos",
      price: "69",
      image: "/topselling/top3.jpg",
      alt: "Golden Pothos"
    },
    {
      name: "HOMALOMENA",
      category: "Bonnie",
      price: "119",
      image: "/topselling/top4.jpg",
      alt: "Homalomena"
    }
  ];

  return (
    <div className="top-selling-container">
      <h1 className="top-selling-title">
        <span className="green">TOP SELLING</span> FLOWERS
      </h1>

      <div className="top-selling-plants-grid">
        {plants.map((plant, index) => (
          <PlantCard
            key={index}
            name={plant.name}
            category={plant.category}
            price={plant.price}
            image={plant.image}
            alt={plant.alt}
          />
        ))}
      </div>

      <div className="top-selling-view-more-container">
        <button className="top-selling-view-more-btn">View More</button>
      </div>
    </div>
  );
};

export default TopSellingFlowers;