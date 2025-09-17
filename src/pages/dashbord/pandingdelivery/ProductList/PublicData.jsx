
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsCurrencyDollar } from "react-icons/bs";
import { FaEye, FaShoppingCart, FaStar } from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";

const PublicData = ({ showButton = true }) => {
  const [categories, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/publicData.json"); // public ফোল্ডার থেকে JSON
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error loading public data:", err);
      }
    };

    fetchData();
  }, []);

 const handleDetails = (product) => {
    navigate(`/product-details/${product._id}`, { state: { product } });
  };

  return (
    <div className=" px-4 md:px-20 bg-[#f5deb3] min-h-screen">
      

     
           {/* Product Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
             {categories.length > 0 ? (
               categories.map((product) => (
                 <div
                   key={product._id}
                   onClick={() => handleDetails(product)}
                   className="relative bg-white rounded-lg shadow-md p-4 cursor-pointer hover:scale-105 transition-transform flex flex-col"
                 >
                   {product.discount && (
                     <div className="absolute top-2 right-2 bg-yellow-300 text-xs px-2 py-1 rounded shadow z-10">
                       -{product.discount}%
                     </div>
                   )}
     
                   <div className="w-full h-48 sm:h-56 md:h-48 lg:h-56 overflow-hidden rounded-lg mb-3">
                     <img
                       src={product.image}
                       alt={product.product_name}
                       className="w-full h-full object-cover transition-transform hover:scale-110"
                     />
                   </div>
     
                   <h3 className="font-semibold text-lg mb-1 truncate">{product.product_name}</h3>
     
                   <div className="flex flex-col gap-1 mb-1 text-sm sm:text-base">
                     <div className="flex items-center gap-1 text-gray-700">
                       <BsCurrencyDollar /> ${product.final_price}
                     </div>
                     <div className="flex items-center gap-1 text-yellow-500">
                       <FaStar /> {product.stars || "0"}
                     </div>
                     <div className="flex items-center gap-1">
                       <MdOutlineInventory2 /> Qty: {product.count}
                     </div>
                     <div className="flex items-center gap-1">
                       <FaCalendarAlt /> {new Date(product.date || Date.now()).toLocaleDateString()}
                     </div>
                     <div className="flex items-center gap-1">🏪 {product.marketName}</div>
                     <div className="flex items-center gap-1">👨‍🌾 {product.vendorName}</div>
                   </div>
     
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       handleDetails(product);
                     }}
                     className="mt-auto w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
                   >
                     <FaEye size={18} /> View Details
                   </button>
                 </div>
               ))
             ) : (
               <p className="text-center text-gray-600 text-lg mt-8">No products found</p>
             )}
           </div>
        
      {/* Show All Products Button */}
  {showButton && (
    <div className="flex justify-center mt-6">
      <button
        onClick={() => navigate("/productlist")}
        className="px-6 py-2 bg-lime-500 hover:bg-lime-600 transition text-white rounded-2xl font-semibold text-lg"
      >
        Show All Products
      </button>
    </div>
  )}
    </div>
  );
};

export default PublicData;
