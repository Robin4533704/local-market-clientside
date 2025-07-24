import React from "react";
import Marquee from "react-fast-marquee";

const logos = [
  "/zpj/logo1.jpg",
  "/zpj/logo8.jpg",
  "/zpj/logo3.jpg",
  "/zpj/logo4.jpg",
  "/zpj/logo5.jpg",
  "/zpj/logo6.jpg",
  "/zpj/logo7.jpg",
  "/zpj/logo9.jpg",
  "/zpj/logo10.jpg",
  "/zpj/logo11.jpg",
];

const LogoMarquee = () => {
  return (
    <div className="bg-white py-6 shadow-inner">
      <Marquee gradient={false} speed={40}>
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Logo ${index + 1}`}
            className="mx-4 h-36 w-auto object-contain"
          />
        ))}
      </Marquee>
    </div>
  );
};

export default LogoMarquee;
