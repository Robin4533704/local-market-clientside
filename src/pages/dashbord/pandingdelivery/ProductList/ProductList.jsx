import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAxios from "../../../../hooks/useAxios";
import { FaStar, FaCalendarAlt, FaEye } from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";
import Loading from "../../../loading/Loading";
import ShopCategorie from "../../../home/ShopCategories/ShopCategorie";
import PublicData from "./PublicData";
import UseAuth from "../../../../hooks/UseAuth";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(""); // price_asc, price_desc
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const useUserAxios = useAxios();
  const navigate = useNavigate();
  const { user } = UseAuth();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = [];
      if (sortBy) query.push(`sort=${sortBy}`);
      if (startDate) query.push(`startDate=${startDate}`);
      if (endDate) query.push(`endDate=${endDate}`);
      const queryString = query.length > 0 ? "?" + query.join("&") : "";

      const res = await useUserAxios.get(`/products${queryString}`);
      const approved = res.data.filter((p) => ["approved", "in stock"].includes(p.status));
      setProducts(approved);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [useUserAxios, sortBy, startDate, endDate]);

  const handleDetails = (product) => {
    if (!user) return navigate("/login");
    navigate(`/product-details/${product._id}`, { state: { product } });
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="pt-16 px-4 md:px-20 bg-[#f5deb3] min-h-screen">
      {/* Page Header */}
      <div className="text-center mb-8 bg-rose-200 p-8 rounded-lg shadow-md">
        <div className="mb-4 text-sm">
          <NavLink to="/" className="text-black btn hover:underline">Home</NavLink>{" "}
          <span className="ml-2 btn">Shop</span>
        </div>
        <h2 className="text-4xl font-bold">Shop</h2>
      </div>

     
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div>
          <label>Sort by Price:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border px-2 py-1 rounded ml-2"
          >
            <option value="">-- Select --</option>
            <option value="price_asc">Low to High</option>
            <option value="price_desc">High to Low</option>
          </select>
        </div>

        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 py-1 rounded ml-2"
          />
        </div>

        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 py-1 rounded ml-2"
          />
        </div>
      </div>
 <ShopCategorie />
      <PublicData showButton={false} />

      {/* Products Grid */}
      <div className="grid px-8 pb-2 lg:px-20 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
        {products.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">No products found.</p>
        ) : (
          products.map((product) => (
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
                <div className="flex items-center gap-1">
                  🏪 {product.marketName}
                </div>
                <div className="flex items-center gap-1">
                  👨‍🌾 {product.vendorName}
                </div>
              </div>

              {/* Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  handleDetails(product);
                }}
                className="mt-auto w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FaEye size={20} /> View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
