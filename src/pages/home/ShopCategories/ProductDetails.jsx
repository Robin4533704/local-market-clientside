import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import UseAuth from "../../../hooks/UseAuth";
import useAxios from "../../../hooks/UseAxios";
import { Loading } from "react-daisyui";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ProductDetails = () => {
  const { id } = useParams(); 
  const location = useLocation(); 
  const navigate = useNavigate();
  const { user } = UseAuth();
  const axiosInstance = useAxios();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(true);
  const [watchlistDisabled, setWatchlistDisabled] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [priceTrend, setPriceTrend] = useState([]);

  // Fetch product if not passed via location.state
  useEffect(() => {
    const fetchProduct = async () => {
      if (product) {
        setLoading(false);
        setWatchlistDisabled(user?.role === "admin" || user?.role === "vendor");
        return;
      }
      try {
        const res = await axiosInstance.get(`/api/products/${id}`);
        setProduct(res.data);
        setWatchlistDisabled(user?.role === "admin" || user?.role === "vendor");
      } catch (err) {
        console.error("Fetch product error:", err);
        toast.error("❌ Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, product, user, axiosInstance]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?._id) return;
      try {
        const res = await axiosInstance.get(`/api/products/${product._id}/reviews`);
        setReviews(res.data || []);
      } catch (err) {
        console.error("Fetch reviews error:", err);
      }
    };
    fetchReviews();
  }, [product?._id, axiosInstance]);

useEffect(() => {
  const fetchPriceTrend = async () => {
    if (!product?._id) return;

    try {
      // সার্ভারের ঠিক URL ব্যবহার করা হলো
      const res = await axiosInstance.get(`/api/products/${product._id}/price-trends`);
      const trends = res.data || [];

      // Chart ডাটা ট্রান্সফর্ম করা
      const trendData = trends.map((entry) => {
        // যদি priceHistory items থাকে
        if (entry.price) {
          return { name: `Date ${entry.date}`, price: entry.price };
        } else {
          // যদি items array থাকে
          const firstItem = entry[Object.keys(entry).find(k => k !== 'date')];
          return { name: `Date ${entry.date}`, price: firstItem || 0 };
        }
      });

      if (trendData.length === 0) {
        setPriceTrend([{ name: product.product_name, price: product.final_price }]);
      } else {
        setPriceTrend(trendData);
      }
    } catch (err) {
      console.error("Fetch price trend error:", err);
      setPriceTrend([{ name: product.product_name, price: product.final_price }]);
    }
  };

  fetchPriceTrend();
}, [product, axiosInstance]);


  const handleAddReview = async () => {
    if (!user) return toast.error("⚠️ Login required to review.");
    if (!newReview.trim()) return toast.error("⚠️ Please write a comment first.");

    try {
      const res = await axiosInstance.post(`/api/products/${product._id}/reviews`, {
        userName: user.displayName,
        email: user.email,
        comment: newReview,
        rating: parseInt(rating),
        date: new Date(),
      });
      setReviews([res.data, ...reviews]);
      setNewReview("");
      setRating(5);
      toast.success("✅ Review added!");
    } catch (err) {
      console.error("Add review error:", err);
      toast.error("❌ Failed to submit review.");
    }
  };

  const handleAddToWatchlist = async () => {
    if (!user) return toast.error("⚠️ Please login first");
    try {
      const token = await user.getIdToken(true);
      const res = await axiosInstance.post(
        "/watchlist",
        {
          userEmail: user.email,
          productId: product._id,
          productName: product.product_name,
          productImage: product.image,
          marketName: product.marketName,
          price: product.final_price,
          date: product.date,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("✅ Added to watchlist!");
        setWatchlistDisabled(true);
      } else {
        toast.error("⚠️ " + (res.data.message || "Something went wrong"));
      }
    } catch (err) {
      console.error("Watchlist API Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "❌ Failed to add watchlist");
    }
  };

  const handleBuyProduct = () => {
    navigate(`/productcard/${product._id}`, { state: { product } });
  };

  if (loading) return <div className="flex justify-center mt-20"><Loading /></div>;
  if (!product) return <p className="text-center mt-10 text-red-500 text-xl">Product not found</p>;

  return (
    <div className="pt-24 px-4 md:px-20 min-h-screen bg-[#f5f0e1] font-sans">
      <NavLink to="/productlist" className="text-blue-600 underline mb-4 inline-block">← Back to Products</NavLink>

      <div className="flex flex-col md:flex-row gap-6 bg-white p-4 rounded-lg shadow-lg">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.product_name}
          className="w-full md:w-96 h-96 object-cover rounded shadow-md"
        />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.product_name}</h1>
            <p className="text-gray-600 mb-1">Market: {product.marketName}</p>
            <p className="text-green-600 font-semibold text-xl mb-4">💵 ৳{product.final_price}</p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAddToWatchlist}
                disabled={watchlistDisabled}
                className={`px-4 py-2 rounded text-white transition-colors duration-300 ${watchlistDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"}`}
              >⭐ Add to Watchlist</button>

              <button
                onClick={handleBuyProduct}
                className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white transition-colors duration-300">🛒 Buy Product</button>
            </div>

            {/* Reviews */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Customer Feedback</h3>
              <div className="mb-4 space-y-2">
                <textarea
                  placeholder="Write your review..."
                  value={newReview}
                  onChange={e => setNewReview(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select value={rating} onChange={e => setRating(e.target.value)} className="border rounded px-3 py-2 w-24">
                  <option value="5">⭐⭐⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="1">⭐</option>
                </select>
                <button onClick={handleAddReview} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">Submit</button>
              </div>

              {reviews.length === 0 ? <p className="text-gray-500">No reviews yet.</p> :
                reviews.map((rev, idx) => (
                  <div key={idx} className="border-b py-3 px-2 mb-2 bg-gray-50 rounded">
                    <p className="font-semibold mb-1">{rev.userName} ({rev.email})</p>
                    <p className="mb-1">⭐ {rev.rating}</p>
                    <p className="mb-1">{rev.comment}</p>
                    {rev.date && <p className="text-xs text-gray-400">{new Date(rev.date).toLocaleString()}</p>}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Price Trend Chart */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Price Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={priceTrend}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductDetails;
