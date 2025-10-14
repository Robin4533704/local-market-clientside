import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsCurrencyDollar } from "react-icons/bs";
import { FaEye, FaStar } from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import UseAuth from "../../../../hooks/UseAuth";
import { motion } from "framer-motion";
import useAxios from "../../../../hooks/UseAxios";

const PublicData = ({ showButton = true }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { user } = UseAuth();
  const axiosSecure = useAxios();

  // ✅ Fetch most popular products (by rating & reviews)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosSecure.get("/publicData"); // Backend route
        if (res.data) {
          const productsWithId = res.data.map((p) => ({
            ...p,
            _id: p._id.toString(),
          }));
          setProducts(productsWithId);
        }
      } catch (err) {
        console.error("Error loading public data:", err);
      }
    };
    fetchData();
  }, [axiosSecure]);

  const handleDetails = (product) => {
    if (!user) navigate("/login");
    else navigate(`/product-details/${product._id}`, { state: { product } });
  };

  return (
    <div className="px-4 md:px-20 bg-[#f5deb3] min-h-screen py-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
        🌟 Popular Market Products
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.length > 0 ? (
          products.map((product, idx) => (
            <motion.div
              key={product._id}
              onClick={() => handleDetails(product)}
              className="relative bg-white rounded-xl shadow-md p-4 cursor-pointer flex flex-col border border-gray-100 hover:shadow-lg transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Image */}
              <div className="w-full h-48 sm:h-56 overflow-hidden rounded-lg mb-3">
                <img
                  src={product.image}
                  alt={product.product_name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              {/* Product Info */}
              <h3 className="font-semibold text-lg mb-1 truncate text-gray-900">
                {product.product_name}
              </h3>

              <div className="flex flex-col gap-1 mb-1 text-sm sm:text-base text-gray-700">
                <div className="flex items-center gap-1">
                  <BsCurrencyDollar /> ${product.final_price}
                </div>

                <div className="flex items-center gap-1 text-yellow-500">
                  <FaStar className="text-yellow-500" />
                  {product.avgRating ? product.avgRating.toFixed(1) : "0"} ⭐ (
                  {product.reviewCount || 0})
                </div>

                <div className="flex items-center gap-1">
                  <MdOutlineInventory2 /> {product.items?.length || 0} item
                </div>

                <div className="flex items-center gap-1">
                  <FaCalendarAlt />{" "}
                  {new Date(product.date || Date.now()).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-1">🏪 {product.marketName}</div>
                <div className="flex items-center gap-1">👨‍🌾 {product.vendorName}</div>
              </div>

              {/* Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDetails(product);
                }}
                className="mt-auto w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FaEye size={18} /> View Details
              </button>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-600 text-lg mt-8">
            No products found
          </p>
        )}
      </div>

      {/* Show All Button */}
      {showButton && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/productlist")}
            className="px-6 py-2 bg-lime-500 hover:bg-lime-600 transition text-white rounded-2xl font-semibold text-lg shadow-md hover:shadow-lg"
          >
            Show All Products
          </button>
        </div>
      )}
    </div>
  );
};

export default PublicData;
