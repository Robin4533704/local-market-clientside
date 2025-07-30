import React from 'react';
import { FaBoxOpen, FaClipboardList, FaHandshake } from 'react-icons/fa';
import { MdOutlineAddHomeWork } from 'react-icons/md';

const services = [
  {
    icon: <MdOutlineAddHomeWork className="w-6 h-6 text-black" />,
    title: 'Family-Owned & Operated',
    desc: 'We’ve been growing with care for generations, right here on our land.',
  },
  {
    icon: <FaBoxOpen className="w-6 h-6 text-black" />,
    title: 'Seasonal Farm Boxes',
    desc: 'Get a rotating selection of what’s fresh, local, and in-season.',
  },
  {
    icon: <FaClipboardList className="w-6 h-6 text-black" />,
    title: 'Sustainable & Eco-Friendly',
    desc: 'We use regenerative farming methods and minimal packaging.',
  },
  {
    icon: <FaHandshake className="w-6 h-6 text-black" />,
    title: 'Delivered to Your Door',
    desc: 'Convenient local delivery and pickup options make eating well easy.',
  },
];

const Services = () => (
 <section className="py-10 bg-[#fef2e7]">
  <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {services.map((s, idx) => (
      <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
        <div className="bg-yellow-300 rounded-full p-4 flex items-center justify-center">
          {s.icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1 text-gray-800">{s.title}</h3>
          <p className="text-gray-600 text-sm">{s.desc}</p>
        </div>
      </div>
    ))}
  </div>
</section>

);

export default Services;
