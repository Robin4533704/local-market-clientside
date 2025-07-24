import React from 'react';

const categories = [
  {
    image: "/zpj/tomato.jpg",
    title: 'Fresh Vegetables',
    description: 'Tomatoes, lettuce, carrots, and more.',
  },
  {
    image:"/zpj/griens.jpg",
    title: 'Grains & Legumes',
    description: 'Wheat, corn, soybeans, and lentils.',
  },
  {
    image: "/zpj/apple.jpg",
    title: 'Seasonal Fruits',
    description: 'Apples, strawberries, blueberries, and peaches.',
  },
  {
    image: "/zpj/liyapi.jpg",
    title: 'Leafy Greens',
    description: 'Organic kale, lettuce, baby spinach, and more.',
  },
  {
    image: "/zpj/egg.jpg",
    title: 'Free-Range Poultry',
    description: 'Eggs and poultry raised with care.',
  },
];

const ShopCategorie = () => (
  <div className="bg-wheat-100 p-5" style={{ backgroundColor: '#f5deb3' }}>
  <h2 className="text-center mb-5 text-xl font-semibold">Shop by Category:</h2>
  <div className="flex flex-wrap justify-center gap-5">
  {categories.map((category, index) => (
    <div
      key={index}
      className="relative w-full sm:w-[45%] md:w-[200px] h-[280px] rounded-lg overflow-hidden shadow-md bg-white cursor-pointer transition-transform transition-shadow duration-300"
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
      }}
      style={{
        backgroundImage: `url(${category.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Linear Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70"></div>

      {/* Text content */}
      <div className="absolute bottom-0 z-10 p-3 text-white">
        <h4 className="m-0 text-base font-semibold drop-shadow-sm">{category.title}</h4>
        <p className="m-0 text-xs drop-shadow-sm">{category.description}</p>
      </div>
    </div>
  ))}
</div>

</div>

);

export default ShopCategorie;
