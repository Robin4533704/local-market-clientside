import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsCurrencyDollar } from "react-icons/bs";
import { FaEye, FaStar } from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import UseAuth from "../../../../hooks/UseAuth"; // Login check

const PublicData = ({ showButton = true }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortType, setSortType] = useState(""); // "low" | "high"
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const navigate = useNavigate();
  const { user } = UseAuth();

  // Load products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/publicData.json"); // public ফোল্ডার থেকে JSON
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Error loading public data:", err);
      }
    };
    fetchData();
  }, []);

  // Filter & Sort Logic
  useEffect(() => {
    let tempProducts = [...products];

    // Date Filter
    if (dateFilter.start || dateFilter.end) {
      const startDate = dateFilter.start ? new Date(dateFilter.start) : new Date("1970-01-01");
      const endDate = dateFilter.end ? new Date(dateFilter.end) : new Date();
      tempProducts = tempProducts.filter((p) => {
        const pDate = new Date(p.date);
        return pDate >= startDate && pDate <= endDate;
      });
    }

    // Sorting
    if (sortType === "low") tempProducts.sort((a, b) => a.final_price - b.final_price);
    else if (sortType === "high") tempProducts.sort((a, b) => b.final_price - a.final_price);

    setFilteredProducts(tempProducts);
  }, [products, sortType, dateFilter]);

  const handleDetails = (product) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/product-details/${product._id}`, { state: { product } });
    }
  };

  return (
    <div className="px-4 md:px-20 bg-[#f5deb3] min-h-screen">
{/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
