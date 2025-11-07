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
  AreaChart,
  Area,
  Legend
} from "recharts";
import { 
  FaArrowLeft, 
  FaStar, 
  FaShoppingCart, 
  FaHeart, 
  FaShare, 
  FaStore, 
  FaUser, 
  FaCalendar, 
  FaChartLine,
  FaDollarSign,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingBag
} from "react-icons/fa";

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
  const [activeTab, setActiveTab] = useState("details");
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  // Fetch product if not passed via location.state
  useEffect(() => {
    const fetchProduct = async () => {
      if (product) {
        setLoading(false);
        setWatchlistDisabled(user?.role === "admin" || user?.role === "vendor");
        return;
      }
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data);
        setWatchlistDisabled(user?.role === "admin" || user?.role === "vendor");
      } catch (err) {
        console.error("Fetch product error:", err);
        toast.error("❌ Product not found");
        navigate("/productlist");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, product, user, axiosInstance, navigate]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?._id) return;
      try {
        const res = await axiosInstance.get(`/products/${product._id}/reviews`);
        setReviews(res.data || []);
      } catch (err) {
        console.error("Fetch reviews error:", err);
      }
    };
    fetchReviews();
  }, [product?._id, axiosInstance]);

  // Fetch price trend data
  useEffect(() => {
    const fetchPriceTrend = async () => {
      if (!product?._id) return;

      try {
        const res = await axiosInstance.get(`/products/${product._id}/price-trends`);
        const trends = res.data || [];

        // Transform data for chart
        const trendData = trends.map((entry, index) => {
          if (entry.price) {
            return { 
              name: `Day ${index + 1}`, 
              price: entry.price,
              date: entry.date 
            };
          } else {
            const firstItem = entry[Object.keys(entry).find(k => k !== 'date')];
            return { 
              name: `Day ${index + 1}`, 
              price: firstItem || 0,
              date: entry.date 
            };
          }
        });

        if (trendData.length === 0) {
          setPriceTrend([{ 
            name: "Current", 
            price: product.final_price,
            date: new Date().toISOString()
          }]);
        } else {
          setPriceTrend(trendData);
        }
      } catch (err) {
        console.error("Fetch price trend error:", err);
        setPriceTrend([{ 
          name: "Current", 
          price: product.final_price,
          date: new Date().toISOString()
        }]);
      }
    };

    fetchPriceTrend();
  }, [product, axiosInstance]);

  // Check if product is in watchlist
  useEffect(() => {
    const checkWatchlistStatus = async () => {
      if (!user || !product?._id) return;
      try {
        const res = await axiosInstance.get(`/watchlist/check?userEmail=${user.email}&productId=${product._id}`);
        setIsInWatchlist(res.data.exists);
      } catch (err) {
        console.error("Check watchlist error:", err);
      }
    };
    checkWatchlistStatus();
  }, [user, product, axiosInstance]);

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-400">
            {rating >= star ? <FaStar /> : 
             rating >= star - 0.5 ? <FaStarHalfAlt /> : 
             <FaRegStar />}
          </span>
        ))}
        <span className="ml-2 text-gray-600">({rating})</span>
      </div>
    );
  };

  const handleAddReview = async () => {
    if (!user) return toast.error("⚠️ Please login to submit a review");
    if (!newReview.trim()) return toast.error("⚠️ Please write a review comment");

    try {
      const res = await axiosInstance.post(`/products/${product._id}/reviews`, {
        userName: user.displayName,
        email: user.email,
        comment: newReview,
        rating: parseInt(rating),
        date: new Date().toISOString(),
        userPhoto: user.photoURL
      });
      setReviews([res.data, ...reviews]);
      setNewReview("");
      setRating(5);
      toast.success("✅ Review submitted successfully!");
    } catch (err) {
      console.error("Add review error:", err);
      toast.error("❌ Failed to submit review");
    }
  };

  const handleAddToWatchlist = async () => {
    if (!user) return toast.error("⚠️ Please login to add to watchlist");
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
          userDisplayName: user.displayName,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("✅ Added to watchlist!");
        setIsInWatchlist(true);
        setWatchlistDisabled(true);
      } else {
        toast.error("⚠️ " + (res.data.message || "Operation failed"));
      }
    } catch (err) {
      console.error("Watchlist API Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "❌ Failed to add to watchlist");
    }
  };

  const handleRemoveFromWatchlist = async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.delete(`/watchlist?userEmail=${user.email}&productId=${product._id}`);
      if (res.data.success) {
        toast.success("✅ Removed from watchlist");
        setIsInWatchlist(false);
      }
    } catch (err) {
      console.error("Remove from watchlist error:", err);
      toast.error("❌ Failed to remove from watchlist");
    }
  };

  const handleBuyProduct = () => {
    navigate(`/productcard/${product._id}`, { state: { product } });
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.product_name,
        text: `Check out ${product.product_name} at ${product.final_price}$`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("🔗 Product link copied to clipboard!");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <Loading variant="dots" size="lg" />
        <p className="mt-4 text-gray-600">Loading product details...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h2>
        <NavLink to="/productlist" className="btn btn-primary">
          <FaArrowLeft className="mr-2" />
          Back to Products
        </NavLink>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
      <div className="pt-24 px-4 md:px-8 lg:px-16">
        <NavLink 
          to="/productlist" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
        >
          <FaArrowLeft />
          Back to Products
        </NavLink>

        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="relative">
              <img
                src={product.image || "/placeholder.png"}
                alt={product.product_name}
                className="w-full h-96 object-cover rounded-xl shadow-md"
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
              <button
                onClick={handleShareProduct}
                className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FaShare className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="space-y-6">
              {/* Product Header */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                  {product.product_name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaStore className="text-blue-500" />
                    <span className="font-medium">{product.marketName}</span>
                  </div>
                  {product.vendorName && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaUser className="text-green-500" />
                      <span>Sold by {product.vendorName}</span>
                    </div>
                  )}
                </div>

                {/* Price and Rating */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-green-600">
                      ${product.final_price}
                    </span>
                    {priceTrend.length > 1 && (
                      <span className="text-sm text-gray-500">
                        {parseFloat(priceTrend[priceTrend.length - 1].price) > parseFloat(priceTrend[0].price) 
                          ? "📈 Price increased" 
                          : "📉 Price decreased"}
                      </span>
                    )}
                  </div>
                  
                  {reviews.length > 0 && (
                    <div className="text-right">
                      {renderStars(averageRating)}
                      <p className="text-sm text-gray-500 mt-1">
                        {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleBuyProduct}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg flex-1"
                >
                  <FaShoppingCart />
                  Buy Now
                </button>

                {isInWatchlist ? (
                  <button
                    onClick={handleRemoveFromWatchlist}
                    className="flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 border border-red-500"
                  >
                    <FaHeart className="text-white" />
                    Remove from Watchlist
                  </button>
                ) : (
                  <button
                    onClick={handleAddToWatchlist}
                    disabled={watchlistDisabled}
                    className={`flex items-center justify-center gap-3 font-semibold py-3 px-6 rounded-lg transition-all duration-300 border ${
                      watchlistDisabled 
                        ? "bg-gray-400 text-white cursor-not-allowed" 
                        : "bg-white text-pink-500 border-pink-500 hover:bg-pink-50"
                    }`}
                  >
                    <FaHeart />
                    Add to Watchlist
                  </button>
                )}
              </div>

              {/* Tabs Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {["details", "reviews", "trends"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                        activeTab === tab
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab === "details" && "Product Details"}
                      {tab === "reviews" && `Reviews (${reviews.length})`}
                      {tab === "trends" && "Price Trends"}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-[200px]">
                {activeTab === "details" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Product Information</h3>
                    {product.items && product.items.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Includes:</h4>
                        <ul className="space-y-2">
                          {product.items.map((item, index) => (
                            <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span>{item.item_name}</span>
                              <span className="text-green-600 font-medium">
                                ${item.price} / {item.unit}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {product.date && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaCalendar />
                        <span>Listed on {new Date(product.date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    {/* Add Review Form */}
                    {user && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-3">Write a Review</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <label className="font-medium">Rating:</label>
                            <select 
                              value={rating} 
                              onChange={e => setRating(e.target.value)} 
                              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                              <option value="4">⭐⭐⭐⭐ (4)</option>
                              <option value="3">⭐⭐⭐ (3)</option>
                              <option value="2">⭐⭐ (2)</option>
                              <option value="1">⭐ (1)</option>
                            </select>
                          </div>
                          <textarea
                            placeholder="Share your experience with this product..."
                            value={newReview}
                            onChange={e => setNewReview(e.target.value)}
                            rows="3"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                          />
                          <button 
                            onClick={handleAddReview}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                          >
                            Submit Review
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Reviews List */}
                    <div>
                      <h4 className="font-semibold mb-4">
                        Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
                      </h4>
                      {reviews.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FaStar className="text-4xl mx-auto mb-3 text-gray-300" />
                          <p>No reviews yet. Be the first to review this product!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {reviews.map((review, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {review.userName?.charAt(0) || 'U'}
                                  </div>
                                  <div>
                                    <p className="font-semibold">{review.userName || 'Anonymous'}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      {renderStars(review.rating)}
                                    </div>
                                  </div>
                                </div>
                                {review.date && (
                                  <span className="text-sm text-gray-400">
                                    {new Date(review.date).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "trends" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FaChartLine className="text-green-500" />
                      Price History & Trends
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={priceTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                          />
                          <YAxis 
                            tick={{ fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip 
                            formatter={(value) => [`$${value}`, 'Price']}
                            labelFormatter={(label) => `Period: ${label}`}
                            contentStyle={{ 
                              borderRadius: '8px',
                              border: 'none',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#10b981" 
                            fill="#10b981" 
                            fillOpacity={0.2}
                            strokeWidth={2}
                            name="Price ($)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    {priceTrend.length <= 1 && (
                      <div className="text-center py-4 text-gray-500">
                        <FaChartLine className="text-3xl mx-auto mb-2 text-gray-300" />
                        <p>Insufficient data for price trend analysis</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;