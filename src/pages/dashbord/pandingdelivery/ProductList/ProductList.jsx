import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaStar, 
  FaCalendarAlt, 
  FaEye, 
  FaEdit, 
  FaTrashAlt,
  FaSearch,
  FaFilter,
  FaSortAmountDown
} from "react-icons/fa";
import { MdOutlineInventory2, MdGridView, MdList } from "react-icons/md";
import { BsCurrencyDollar, BsGridFill } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import Loading from "../../../loading/Loading";
import UseAuth from "../../../../hooks/UseAuth";
import { ProductContext } from "../../paymentmethod/productContext/ProductContext";
import useAxios from "../../../../hooks/useAxios";
import useUserRole from "../../../../hooks/useUserRole";

const ProductList = () => {
  const { products, setProducts, loading } = useContext(ProductContext);
  const navigate = useNavigate();
  const { user } = UseAuth(); 
  const { role } = useUserRole();
  const axiosInstance = useAxios();

  // State for UI controls
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleDetails = (product) => {
    if (!user) return navigate("/login");
    navigate(`/product-details/${product._id}`, { state: { product } });
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      customClass: {
        popup: 'rounded-2xl shadow-2xl'
      }
    });

    if (confirm.isConfirmed) {
      try {
        await axiosInstance.delete(`/products/${id}`);
        Swal.fire({
          title: "Deleted!",
          text: "Product has been successfully deleted.",
          icon: "success",
          confirmButtonColor: "#10b981",
          background: "#ffffff",
          customClass: {
            popup: 'rounded-2xl shadow-2xl'
          }
        });
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete product. Please try again.",
          icon: "error",
          confirmButtonColor: "#ef4444",
          background: "#ffffff",
          customClass: {
            popup: 'rounded-2xl shadow-2xl'
          }
        });
      }
    }
  };

  const handleEdit = (product) => {
    navigate(`/editproducts/${product._id}`, { state: { product } });
  };

  // Filter and sort products
  const filteredProducts = products
    ?.filter(product => 
      product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.marketName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    ?.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return (a.final_price || 0) - (b.final_price || 0);
        case "name":
          return (a.product_name || "").localeCompare(b.product_name || "");
        case "date":
          return new Date(b.date || 0) - new Date(a.date || 0);
        case "rating":
          return (b.stars || 0) - (a.stars || 0);
        default:
          return 0;
      }
    });

  if (loading) return <Loading />;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-lime-50 pt-20">
      {/* Header Section */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex mb-6">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <NavLink 
                  to="/" 
                  className="text-gray-500 hover:text-green-600 transition-colors duration-200 font-medium"
                >
                  Home
                </NavLink>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-green-600 font-semibold">Products</li>
            </ol>
          </nav>

          {/* Header Content */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Products</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl">
                Discover our carefully curated selection of fresh, organic products from trusted farmers and vendors.
              </p>
            </div>
            
            {/* Results Count */}
            <div className="mt-4 lg:mt-0">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 font-medium text-sm">
                {filteredProducts?.length || 0} products found
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls Section */}
      <motion.div 
        className="bg-white/60 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-16 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products, vendors, or markets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Controls Group */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-300 rounded-2xl pl-4 pr-10 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="date">Sort by Date</option>
                  <option value="rating">Sort by Rating</option>
                </select>
                <FaSortAmountDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-white/80 backdrop-blur-sm border border-gray-300 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    viewMode === "grid" 
                      ? "bg-green-500 text-white shadow-md" 
                      : "text-gray-500 hover:text-green-600"
                  }`}
                >
                  <BsGridFill className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    viewMode === "list" 
                      ? "bg-green-500 text-white shadow-md" 
                      : "text-gray-500 hover:text-green-600"
                  }`}
                >
                  <MdList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!filteredProducts || filteredProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {searchTerm ? "No products found" : "No products available"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? "Try adjusting your search terms or filters to find what you're looking for."
                    : "Check back later for new products or contact us for more information."
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="products"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "grid grid-cols-1 gap-6"
              }
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  layout
                  className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 ${
                    viewMode === "list" ? "flex" : "flex flex-col"
                  }`}
                  whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                >
                  
                  {/* Product Image */}
                  <div className={
                    viewMode === "list" 
                      ? "w-48 h-48 flex-shrink-0" 
                      : "w-full h-56"
                  }>
                    <div className="relative w-full h-full overflow-hidden">
                      <img
                        src={product.image || "/placeholder.png"}
                        alt={product.product_name || "Product"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onClick={() => handleDetails(product)}
                      />
                      {/* Premium Badge */}
                      {product.premium && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          PREMIUM
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className={`flex-1 p-6 flex flex-col ${
                    viewMode === "list" ? "justify-center" : ""
                  }`}>
                    
                    {/* Product Header */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors duration-200">
                        {product.product_name || "Unnamed Product"}
                      </h3>
                      
                      {/* Admin Actions */}
                      {role === "admin" && (
                        <div className="flex gap-2 ml-3 flex-shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                            className="p-2 rounded-xl bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:scale-110 transition-all duration-200 shadow-sm"
                            title="Edit Product"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(product._id); }}
                            className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110 transition-all duration-200 shadow-sm"
                            title="Delete Product"
                          >
                            <FaTrashAlt className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Product Meta */}
                    <div className="space-y-2 mb-4">
                      {/* Price and Rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
                          <BsCurrencyDollar className="w-5 h-5" />
                          {product.final_price || 0}
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                          <FaStar className="w-4 h-4" />
                          {product.stars || 0}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MdOutlineInventory2 className="w-4 h-4 text-blue-500" />
                          <span>Qty: {product.count || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="w-4 h-4 text-purple-500" />
                          <span>{new Date(product.date || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <span className="w-4 h-4">🏪</span>
                          <span className="truncate">{product.marketName || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <span className="w-4 h-4">👨‍🌾</span>
                          <span className="truncate">{product.vendorName || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDetails(product); }}
                      className="mt-auto w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg group/btn flex items-center justify-center gap-3"
                    >
                      <FaEye className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                      View Details
                    </button>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductList;