import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import banner1 from '../../../assets/images/beautiful-street-market-sunset.jpg';
import banner2 from '../../../assets/images/medium-shot-women-holding-shopping-bags.jpg';
import banner3 from '../../../assets/images/side-view-women-shopping-groceries.jpg';
import { Link } from 'react-router-dom';

const slides = [
  { img: banner1, title: 'Welcome to Farmer Market', subtitle: 'Taste the freshness direct from local farms' },
  { img: banner2, title: 'Organic & Pure', subtitle: 'Healthier choices for your family and home' },
  { img: banner3, title: 'Join Our Community', subtitle: 'Support sustainable, small-scale farmers'
  },
];

const Banner = () => (
  <Carousel
    showThumbs={false}
    showStatus={false}
    infiniteLoop
    autoPlay
    interval={4000}
    transitionTime={600}
  >
    {slides.map((slide, idx) => (
      <div key={idx} className="relative">
        <img
          src={slide.img}
          alt={slide.title}
          className="w-full h-[350px] md:h-[530px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-white text-2xl md:text-3xl font-bold">{slide.title}</h2>
          <p className="text-white text-md md:text-lg mt-1">{slide.subtitle}</p>
          <div className='mt-2'>
           <Link className=" inline-block p-1 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 rounded-full">
  <span className="block bg-lime-400 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300 ease-in-out hover:bg-transparent hover:text-white">
    Shop new
  </span>
</Link>


          </div>
        </div>
      </div>
    ))}
  </Carousel>
);

export default Banner;
