import React from 'react';
import { FiHome, FiChevronRight } from 'react-icons/fi';
import './MiniNavbar.css';

const MiniNavbar = () => {
  return (
    <div className="mini-navbar">
      <div className="mini-navbar-container">
        <div className="mini-nav-content">
          <FiHome size={25} color="#000000" />
          <FiChevronRight size={24} color="#000000" />
        </div>
      </div>
    </div>
  );
};

export default MiniNavbar;