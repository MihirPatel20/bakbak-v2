import React, { useState } from "react";
import "./ImageCarousel.scss"; // Create this CSS file for styling
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useSwipeable } from "react-swipeable"; // Import useSwipeable hook

const ImageCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  // Use the useSwipeable hook to handle swipe gestures
  const handlers = useSwipeable({
    onSwipedLeft: () => goToNextSlide(),
    onSwipedRight: () => goToPrevSlide(),
  });

  return (
    <div className="carousel-container" {...handlers}>
      <div className="carousel-navigation">
        <div className="image-side left" onClick={goToPrevSlide}>
          <ArrowBackIosNewIcon fontSize="small" />
        </div>
        <div className="image-side right" onClick={goToNextSlide}>
          <ArrowForwardIosIcon fontSize="small" />
        </div>
      </div>

      <div
        className="carousel-wrapper"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="carousel-card">
            <ImageWithSkeletonLoader src={item.url} alt="post image" />
          </div>
        ))}
      </div>

      <div className="carousel-pagination">
        {items.map((_, index) => (
          <div
            key={index}
            className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

const ImageWithSkeletonLoader = ({ src, alt = "image", className = "" }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`image-skeleton-wrapper ${!isLoaded ? "skeleton-loader" : ""}`}
    >
      <img
        src={src}
        alt={alt}
        className={`skeleton-image ${className}`}
        style={{ opacity: isLoaded ? 1 : 0 }}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
    </div>
  );
};

export default ImageCarousel;
