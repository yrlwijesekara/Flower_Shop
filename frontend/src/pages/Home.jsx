import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import MiniNavbar from '../components/MiniNavbar';
import Footer from '../components/Footer';
import { FiHome } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const breadcrumbData = [
    { 
      icon: <FiHome size={25} color="#000000" />, 
      href: '/' 
    },
    { 
      label: 'Products', 
      href: '/products' 
    }
  ];

  const handleFilterToggle = (isOpen) => {
    setIsFilterOpen(isOpen);
    console.log('Filters are now:', isOpen ? 'open' : 'closed');
  };

  return (
    <div className="home-page">
      <Navbar />
      <MiniNavbar 
        breadcrumbs={breadcrumbData}
        showFilters={true}
        onFilterToggle={handleFilterToggle}
        isFilterOpen={isFilterOpen}
      />
      
      <main className="home-content">
        <div className="home-container">
          <h1 className="home-title">Welcome to Flora Shop</h1>
          <p className="home-description">Discover our beautiful collection of fresh flowers and arrangements for every occasion.</p>
          
          <div className="hero-section">
            <div className="hero-placeholder">
              <p>Hero content coming soon...</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;