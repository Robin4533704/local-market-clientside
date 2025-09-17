import React, { useEffect, useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UseAuth from "../../../hooks/UseAuth";
import Loading from "../../loading/Loading";
import PriceChart from "./PriceChart";
import useAxios from "../../../hooks/useAxios";

const ProductDetails = () => {
  // 🔹 সব Hook টপ লেভেলে
  const { user } = UseAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const product = location.state?.product;

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [watchlistDisabled, setWatchlistDisabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 product + user এর উপর ভিত্তি করে state আপডেট
  useEffect(() => {
    if (!product) {
      setLoading(false);
      return;
    }
    setLoading(false);
    setWatchlistDisabled(user?.role === "admin" || user?.role === "vendor");
  }, [user, product]);

  // 🔹 Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?._id) return;
      try {
        const res = await axiosInstance.get(`/product/${product._id}/reviews`);
        setReviews(res.data || []);
      } catch (err) {
        console.error("Fetch reviews error:", err);
      }
    };
    fetchReviews();
  }, [product?._id, axiosInstance]);

  // 🔹 Add review
  const handleAddReview = async () => {
    if (!user) return toast.error("Login required to review.");
    if (!newReview.trim()) return toast.error("Write a comment first.");
    try {
      const res = await axiosInstance.post(`/product/${product._id}/reviews`, {
        userName: user.displayName,
        email: user.email,
        comment: newReview,
        rating: parseInt(rating),
        date: new Date(),
      });
      setReviews([res.data, ...reviews]);
      setNewReview("");
      setRating(5);
      toast.success("Review added!");
    } catch (err) {
      console.error("Add review error:", err);
      toast.error("Failed to submit review.");
    }
  };

  // 🔹 Add to watchlist
  const handleAddWatchlist = async () => {
    if (!user) return toast.error("⚠️ Please login first");

    try {
      const token = await user.getIdToken(true);
      if (!token) return toast.error("⚠️ Failed to get auth token");

      const res = await axiosInstance.post(
        "/users/watchlist",
        {
          productId: product?._id,
          productName: product?.product_name,
          marketName: product?.market_name || product?.marketName,
          userEmail: user.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("✅ Added to watchlist!");
        setWatchlistDisabled(true);
      } else if (res.data.message === "Already in watchlist") {
        toast("⚠️ Product already in your watchlist");
        setWatchlistDisabled(true);
      } else {
        toast.error("⚠️ " + (res.data.message || "Something went wrong"));
      }
    } catch (err) {
      console.error("Watchlist API Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "❌ Failed to add watchlist");
    }
  };

  // 🔹 Buy product
  const handleBuyProduct = () => {
    navigate(`/productcard/${product._id}`, { state: { product } });
  };

  if (loading) return <Loading />;
  if (!product)
    return <div className="text-center mt-10 text-red-500">Product not found</div>;

  // 🔹 Safe fallback for priceHistory
  const priceHistory = product.price_history || [
    { date: "2025-09-12", price: product.final_price ? product.final_price - 5 : 0 },
    { date: "2025-09-13", price: product.final_price || 0 },
  ];

  return (
    <div className="pt-24 px-4 md:px-20 min-h-screen bg-[#f5f0e1] font-sans">
      <NavLink to="/productlist" className="text-blue-600 underline mb-4 inline-block">
        Back to Products
      </NavLink>

      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.product_name}
          className="w-full md:w-96 h-96 object-cover rounded shadow"
        />

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold">{product.product_name}</h1>
            <p className="mt-1 text-gray-500">Market: {product.marketName}</p>
            <p className="mt-1 text-gray-500">Date: {product.date}</p>
            <p className="mt-2 text-green-600 font-bold text-xl">
              💵 ৳{product.final_price}
            </p>

            {product.items?.map((item) => (
              <p key={item.item_name}>
                🧅 {item.item_name} — ৳{item.price}/{item.unit}
              </p>
            ))}

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleAddWatchlist}
                disabled={watchlistDisabled}
                className={`px-4 py-2 rounded text-white ${
                  watchlistDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
              >
                ⭐ Add to Watchlist
              </button>

              <button
                onClick={handleBuyProduct}
                className="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600"
              >
                🛒 Buy Product
              </button>
            </div>

            {/* Reviews Section */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Customer Feedback</h3>
              <div className="flex flex-col gap-2 mb-4">
                <textarea
                  placeholder="Write your review..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  className="border px-3 py-2 rounded"
                />
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="border px-3 py-2 rounded w-32"
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                  <option value="4">⭐⭐⭐⭐ (4)</option>
                  <option value="3">⭐⭐⭐ (3)</option>
                  <option value="2">⭐⭐ (2)</option>
                  <option value="1">⭐ (1)</option>
                </select>
                <button
                  onClick={handleAddReview}
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 w-32"
                >
                  Submit
                </button>
              </div>

              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
              ) : (
                reviews.map((rev, idx) => (
                  <div key={idx} className="border-b py-2">
                    <p className="font-semibold">
                      {rev.userName} ({rev.email})
                    </p>
                    <p>⭐ {rev.rating}</p>
                    <p>{rev.comment}</p>
                    {rev.date && (
                      <p className="text-xs text-gray-400">
                        {new Date(rev.date).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Price Comparison Chart */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Price Trend</h3>
              <PriceChart priceHistory={priceHistory} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
