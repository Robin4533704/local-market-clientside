import React from 'react';
import BangladeshMap from '../BangladeshMap';
import { useLoaderData } from 'react-router-dom'; // ✅ এটা 'react-router' নয়, 'react-router-dom' হবে

const Coverage = () => {
  const servicesData = useLoaderData();
  console.log('servicesData', servicesData);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-blue-600">
        We are available in 64 districts
      </h1>
      {/* ✅ ডাটা পাঠাও BangladeshMap এ */}
      <BangladeshMap servicesData={servicesData} />
    </div>
  );
};

export default Coverage;
