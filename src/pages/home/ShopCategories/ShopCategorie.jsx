// ShopCategorie.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ShopCategorie = ({ showButton = true }) => { // prop add
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/shoppingdata")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleAddToCart = (category) => {
    if (!category._id) return;
    navigate(`/productcard/${category._id}`);
  };

  return (
    <div className="" style={{ backgroundColor: "#f5deb3" }}>
      <h2 className="text-center mb-5 text-2xl font-semibold">
        Shop by Category:
      </h2>

      {/* Category Cards */}
      <div className="flex flex-wrap justify-center gap-5">
        {categories.map((category) => (
          <div
            key={category._id}
            className="relative w-full sm:w-[45%] md:w-[220px] h-[360px] rounded-lg overflow-hidden shadow-md bg-white cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img
              src={category.image}
              alt={category.product_name}
              className="w-full h-40 object-cover"
            />
            <div className="p-3 flex flex-col justify-between h-[calc(100%-160px)]">
              <div>
                <h4 className="text-base font-semibold">{category.product_name}</h4>
                <p className="text-xs text-gray-700 mb-2">{category.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-green-600">
                    ${category.final_price}{" "}
                    {category.price !== category.final_price && (
                      <span className="line-through text-gray-400 text-xs">
                        ${category.price}
                      </span>
                    )}
                  </p>
                  <p
                    className={`text-xs px-2 py-1 rounded text-white ${
                      category.status === "in stock" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {category.status}
                  </p>
                </div>
                <p className="text-sm text-yellow-500">{category.stars}</p>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(category)}
                className="mt-2 w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded-lg font-semibold transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Conditional Show Now Button */}
      {showButton && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/productlist")}
            className="px-6 py-2 bg-lime-500 hover:bg-lime-600 transition text-white rounded-2xl font-semibold text-lg"
          >
            Show Now
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopCategorie;
