import React, { useState, useEffect, useCallback } from 'react'
import '../components/carousel.css'


const slides = [
  { src: "/carousel/carousel1.jpg", alt: "Slide 1" },
  { src: "/carousel/carousel2.webp", alt: "Slide 2" },
  { src: "/carousel/carousel3.jpg", alt: "Slide 3" },
];
function Carousel() {
    const [current, setCurrent] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);
    const autoPlayInterval = 5000; // 5 seconds between slides

    const prevSlide = useCallback(() => {
      setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }, []);

    const nextSlide = useCallback(() => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, []);
    
    // Auto-play functionality
    useEffect(() => {
      let interval;
      
      if (autoPlay) {
        interval = setInterval(() => {
          nextSlide();
        }, autoPlayInterval);
      }
      
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [autoPlay, nextSlide, autoPlayInterval]);
    
    // Pause auto-play when hovering over carousel
    const handleMouseEnter = () => setAutoPlay(false);
    const handleMouseLeave = () => setAutoPlay(true);
  return (
    <div 
      className="carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="carousel-track"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {slides.map((slide, idx) => (
          <div className="carousel-slide" key={idx}>
            <img src={slide.src} alt={slide.alt} />
          </div>
        ))}
      </div>
      <button className="carousel-btn prev" onClick={prevSlide}>&lt;</button>
      <button className="carousel-btn next" onClick={nextSlide}>&gt;</button>
      <button className="carousel-order-btn">ORDER NOW</button>
      
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <button 
            key={index} 
            className={`carousel-dot ${current === index ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel