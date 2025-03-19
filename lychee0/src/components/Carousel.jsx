import React, { useState, useEffect } from "react";
import "../ComponentsCss/Carousel.css";
import { Link } from "react-router-dom";

const Carousel = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Handle automatic slideshow
  useEffect(() => {
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        setCurrentSlide((prevSlide) =>
          prevSlide === slides.length - 1 ? 0 : prevSlide + 1
        );
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoplay, slides.length]);

  // Navigation functions
  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === slides.length - 1 ? 0 : prevSlide + 1
    );
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Pause autoplay when user interacts
  const handleMouseEnter = () => {
    setAutoplay(false);
  };

  const handleMouseLeave = () => {
    setAutoplay(true);
  };

  return (
    <div
      className="carousel-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="carousel-wrapper">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-slide ${
              index === currentSlide ? "active" : ""
            }`}
            style={{
              transform: `translateX(${100 * (index - currentSlide)}%)`,
            }}
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

      {/* Navigation buttons */}
      <button className="carousel-control prev" onClick={goToPrevSlide}>
        &#10094;
      </button>
      <button className="carousel-control next" onClick={goToNextSlide}>
        &#10095;
      </button>

      {/* Slide indicators */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
