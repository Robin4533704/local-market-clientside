import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsCurrencyDollar } from "react-icons/bs";
import { FaEye, FaStar, FaShoppingCart, FaHeart, FaShare } from "react-icons/fa";
import { MdOutlineInventory2, MdLocationOn } from "react-icons/md";
import { FaCalendarAlt, FaUserTie } from "react-icons/fa";
import UseAuth from "../../../../hooks/UseAuth";
import { motion, AnimatePresence } from "framer-motion";
import useAxios from "../../../../hooks/UseAxios";

const PublicData = ({ showButton = true }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();
  const { user } = UseAuth();
  const axiosSecure = useAxios();

  // ✅ Fetch most popular products (by rating & reviews)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/publicData");
        if (res.data) {
          const productsWithId = res.data.map((p) => ({
            ...p,
            _id: p._id.toString(),
          }));
          setProducts(productsWithId);
        }
      } catch (err) {
        console.error("Error loading public data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDetails = (product) => {
    if (!user) navigate("/login");
    else navigate(`/product-details/${product._id}`, { state: { product } });
  };

  const handleQuickActions = (e, action, product) => {
    e.stopPropagation();
    // Implement quick actions logic here
    console.log(`${action} clicked for`, product.product_name);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton Header */}
          <div className="text-center mb-12">
            <div className="h-8 w-64 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
          </div>
          
          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FaStar className="text-yellow-300" />
            Premium Quality Products
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Fresh From <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-amber-600">Our Farms</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the finest selection of farm-fresh products, carefully curated for quality and sustainability.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {products.length > 0 ? (
              products.map((product, idx) => (
                <motion.div
                  key={product._id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  onHoverStart={() => setHoveredCard(product._id)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  {/* Product Image Container */}
                  <div className="relative overflow-hidden">
                    <motion.img
                      src={product.image}
                      alt={product.product_name}
                      className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Quick Actions */}
                    <motion.div 
                      className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      initial={{ x: 20 }}
                      whileHover={{ x: 0 }}
                    >
                      {[FaHeart, FaShare].map((Icon, actionIdx) => (
                        <motion.button
                          key={actionIdx}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleQuickActions(e, actionIdx === 0 ? 'wishlist' : 'share', product)}
                        >
                          <Icon className={actionIdx === 0 ? "text-red-500 w-4 h-4" : "text-blue-500 w-4 h-4"} />
                        </motion.button>
                      ))}
                    </motion.div>

                    {/* Rating Badge */}
                    <div className="absolute top-4 left-4">
                      <motion.div
                        className="flex items-center gap-1 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm font-semibold"
                        whileHover={{ scale: 1.05 }}
                      >
                        <FaStar className="text-yellow-400 w-3 h-3" />
                        <span>{product.avgRating ? product.avgRating.toFixed(1) : "0.0"}</span>
                      </motion.div>
                    </div>

                    {/* Stock Status */}
                    {product.items?.length > 0 && (
                      <div className="absolute bottom-4 left-4">
                        <div className="px-3 py-1 bg-green-500/90 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                          In Stock
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    {/* Product Name */}
                    <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-green-700 transition-colors duration-300">
                      {product.product_name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <BsCurrencyDollar className="text-green-600 w-5 h-5" />
                      <span className="text-2xl font-bold text-gray-900">${product.final_price}</span>
                      {product.original_price && product.original_price > product.final_price && (
                        <span className="text-sm text-gray-500 line-through">${product.original_price}</span>
                      )}
                    </div>

                    {/* Product Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MdOutlineInventory2 className="text-blue-500 w-4 h-4" />
                        <span>{product.items?.length || 0} items</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-purple-500 w-4 h-4" />
                        <span>{new Date(product.date || Date.now()).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MdLocationOn className="text-red-500 w-4 h-4" />
                        <span className="truncate">{product.marketName}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FaUserTie className="text-amber-500 w-4 h-4" />
                        <span className="truncate">{product.vendorName}</span>
                      </div>
                    </div>

                    {/* Reviews */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.avgRating || 0)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDetails(product);
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaEye className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                      View Details
                    </motion.button>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-400/50 rounded-2xl transition-all duration-500 pointer-events-none" />
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MdOutlineInventory2 className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products Found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We couldn't find any products matching your criteria. Please check back later.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Show All Button */}
        {showButton && products.length > 0 && (
          <motion.div
            className="flex justify-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.button
              onClick={() => navigate("/productlist")}
              className="px-8 py-4 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShoppingCart className="w-5 h-5" />
              Explore All Products
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PublicData;