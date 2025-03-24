import React, { useState, useEffect } from "react";
import "../ComponentsCss/Carousel.css";
import { Link } from "react-router-dom";

const Carousel = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // SWIPE HANDLING STATES
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Autoplay effect
  useEffect(() => {
    let interval;
    if (autoplay && !isHovered) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [autoplay, isHovered, slides.length]);

  // Navigation functions
  const goToNextSlide = () =>
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const goToPrevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  // Handle swipe logic
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const swipeDistance = touchStart - touchEnd;

    if (swipeDistance > 50) {
      // Swipe left
      goToNextSlide();
    }
    if (swipeDistance < -50) {
      // Swipe right
      goToPrevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div
      className="carousel-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="carousel-wrapper"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentSlide ? "active" : ""
              }`}
          >
            <div className="slide-content">
              <div className="slide-text">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
                {slide.buttonText && slide.buttonLink && (
                  <Link to={slide.buttonLink} className="slide-button">
                    {slide.buttonText}
                  </Link>
                )}
              </div>
              <div
                className="slide-image"
                style={{ backgroundImage: `url(${slide.imageUrl})` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="carousel-control prev" onClick={goToPrevSlide}>
        ❮
      </button>
      <button className="carousel-control next" onClick={goToNextSlide}>
        ❯
      </button>

      {/* Indicators */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Autoplay toggle */}
      <button
        className="autoplay-toggle"
        onClick={() => setAutoplay(!autoplay)}
        title={autoplay ? "Pause" : "Play"}
      >
        {autoplay ? "⏸" : "▶"}
      </button>
    </div>
  );
};

export default Carousel;
