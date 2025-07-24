import React, { useState, useEffect } from 'react';

const Farmers = () => {
  const images = [
    "/zpj/download1.jpg",
    "/zpj/download2.jpg",
    "/zpj/download3.jpg",
    "/zpj/download4.jpg",
    "/zpj/download10.jpg",
    "/zpj/images8.jpg",
    "/zpj/images7.jpg",
    "/zpj/images1.jpg",
    "/zpj/images9.jpg",
    "/zpj/works2.jpg",
    "/zpj/works1.jpg",
    "/zpj/works3.jpg"
  ];

  const imagesPerSlide = 6;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        (prev + 1) % images.length
      );
    }, 2000); // Change every 2 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  // Take 6 consecutive images from currentIndex
  const currentImages = [];
  for (let i = 0; i < imagesPerSlide; i++) {
    currentImages.push(images[(currentIndex + i) % images.length]);
  }

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      (prev - 1 + images.length) % images.length
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      (prev + 1) % images.length
    );
  };

  return (
    <div className="p-2 bg-white rounded-md shadow relative overflow-hidden max-w-7xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 transition-all duration-700">
        {currentImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index}`}
            className="w-full h-40 object-cover rounded-md"
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 transition"
      >
        &#8592;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 transition"
      >
        &#8594;
      </button>
    </div>
  );
};

export default Farmers;
