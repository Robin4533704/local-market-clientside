import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ShopCategorie from "../../../home/ShopCategories/ShopCategorie";
import useAxios from "../../../../hooks/useAxios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const useUserAxios = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await useUserAxios.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDetails = (product) => {
    if (!product) return;
    navigate("/product-details", { state: { product } });
  };

const handleAddToCard = (product) => {
  if (!product._id) return;
  // এখন navigate করে ProductCard এ যাওয়া হবে
  navigate(`/productcard/${product._id}`, { state: product });
};

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="pt-16 px-4 md:px-20 bg-[#f5deb3] min-h-screen">
      {/* Header */}
      <div className="text-center mb-8 bg-rose-200 p-8 rounded-lg shadow-md">
        <div className="mb-4 text-sm">
          <NavLink to="/" className="text-black btn hover:underline">
            Home
          </NavLink>{" "}
          / <span className="ml-2 btn">Product</span>
        </div>
        <h2 className="text-4xl font-bold">Shop</h2>
      </div>

      {/* Shop by Category */}
      <ShopCategorie showButton={false} handleDetails={handleDetails} />

      {/* Product Cards */}
      <div className="flex flex-wrap gap-5 justify-center mt-8">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => handleDetails(product)}
            className="relative w-full sm:w-[45%] md:w-[220px] bg-white rounded-lg shadow-md p-4 cursor-pointer 
                       transition-transform transition-shadow duration-300 hover:scale-105 hover:shadow-xl"
          >
            {product.discount && (
              <div className="absolute top-2 right-2 bg-yellow-300 text-xs px-2 py-1 rounded shadow">
                -{product.discount}%
              </div>
            )}
            <img
              src={product.image}
              alt={product.product_name}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold text-lg mb-1">{product.product_name}</h3>
            <div className="flex items-center justify-between">
              <p className="text-gray-700 mb-1">Price: ${product.price}</p>
              <p
                className={`mt-2 text-center text-white text-sm px-2 py-1 rounded ${
                  product.status === "in stock" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {product.status || "out of stock"}
              </p>
            </div>
            <p className="text-gray-600 mb-1">Orders: {product.count || 0}</p>
            <p className="text-yellow-500 mb-2">Rating: {product.stars || 0} ⭐</p>

            {/* Add to Cart Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCard (product);
              }}
              className="mt-2 w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded-lg font-semibold transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
