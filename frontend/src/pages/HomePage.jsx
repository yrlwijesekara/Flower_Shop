import React from 'react'
import Navbar from '../components/Navbar'
import Carousel from '../components/Carousel'
import ShopnowCard from '../components/shopnowCard'
import TopSellingFlowers from '../components/TopSelling'
import Footer from '../components/Footer'
import './HomePage.css'

function HomePage() {
    
  return (
    <div>
        <Navbar />
        <Carousel/>
        <ShopnowCard/>
        <TopSellingFlowers/>
        <div className="categories-container">
      <h1 className="categories-title">
        <span className="green-text">MOST POPULAR</span> CATEGORIES
      </h1>

      <div className="categories-grid">
        {/* Valentine Category */}
        <div className="category-card valentine-card">
          <div className="category-content">
            <div className="category-image">
              <img 
                src="/popular/popular1.jpg" 
                alt="Valentine flowers"
                className="category-img"
              />
            </div>
            <div className="category-text">
              <h2 className="category-name">Valentine</h2>
              <p className="category-description">
                Dorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Etiam eu turpis molestie, dictum est a, mattis tellus. Sed 
                dignissim, metus nec fringilla accumsan, risus sem 
                sollicitudin lacus, ut interdum tellus elit sed risus. 
                Maecenas eget condimentum velit, sit amet feugiat lectus. 
                Class aptent taciti
              </p>
              <button className="checkout-btn">Checkout</button>
            </div>
          </div>
        </div>

        {/* Wedding Category */}
        <div className="category-card wedding-card">
          <div className="category-content">
            <div className="category-text">
              <h2 className="category-name">Wedding</h2>
              <p className="category-description">
                Dorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Etiam eu turpis in lacus, ut interdum tellus elit sed risus. 
                Maecenas eget condimentum velit, sit amet feugiat lectus. 
                Class aptent taciti
              </p>
              <button className="checkout-btn">Checkout</button>
            </div>
            <div className="category-image">
              <img 
                src="/popular/popular2.png" 
                alt="Wedding flowers"
                className="category-img"
              />
            </div>
          </div>
        </div>

        {/* House Plants Category */}
        <div className="category-card house-plants-card">
          <div className="category-content">
            <div className="category-image">
              <img 
                src="/popular/popular3.jpg" 
                alt="House plants"
                className="category-img"
              />
            </div>
            <div className="category-text">
              <h2 className="category-name">House Plants</h2>
              <p className="category-description">
                Dorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Etiam eu turpis molestie, dictum est a, mattis tellus. 
                fringilla accumsan, risus sem sollicitudin lacus, ut 
                interdum tellus elit sed risus. Maecenas eget 
                condimentum velit, sit amet feugiat lectus. Class aptent 
                taciti
              </p>
              <button className="checkout-btn">Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>

        <div className="hero-container">
      <div className="hero-background">
        <img 
          src="/herosection/herosection.jpg" 
          alt="Gardening with gloves and plants"
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <div className="play-button">
          <div className="play-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 5v14l11-7z" fill="currentColor"/>
            </svg>
          </div>
        </div>
        
        <div className="info-card">
          <h2 className="info-title">HOW IT WORKS ?</h2>
          <p className="info-description">
            A flower, sometimes known as a bloom or blossom, 
            is the reproductive structure found in flowering 
            plants (plants of the division Magnoliophyta, also 
            called angiosperms).
          </p>
          <div className="arrow-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <Footer />
    </div>
  )
}

export default HomePage