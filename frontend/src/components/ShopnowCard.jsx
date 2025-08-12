import React from 'react';
import './ShopnowCard.css'

function ShopnowCard() {
  return (
    <div className="home-card">
      <div className='home-card-left'>
        <div className='des'>
            <h2>Valentine's day amazing offer!</h2>
            
            <p>
                Valentine's Day, also called Saint Valentine's Day or the Feast of Saint Valentine, is celebrated annually on February 14.
            </p>
            
            <button className="home-card-btn">SHOP NOW</button>
        </div>
      </div>
      <div className='home-card-right'>
        <div className='shopCard-img'>
            <img src='/shopnow/bouquet1.png'></img>
        </div>
      </div>
    </div>
  );
}

export default ShopnowCard;