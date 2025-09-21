import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ React-Toastify
import useAxios from "../../../../hooks/useAxios";
import UseAuth from "../../../../hooks/UseAuth";
import Loading from "../../../loading/Loading";

const MyWatchlist = () => {
  const { user } = UseAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch watchlist
  const fetchWatchlist = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken(true);
      const res = await axiosInstance.get(`/watchlist/${user.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist(res.data || []);
    } catch (err) {
      console.error("Fetch watchlist error:", err);
      toast.error("Failed to fetch watchlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, [user]);

 const handleViewDetails = (product) => {
  // state হিসেবে সম্পূর্ণ product পাঠানো
  navigate(`/product-details/${product._id}`, { state: { product } });
};


  // 🔹 Add more
  const handleAddMore = () => {
    navigate("/addproduct");
  };

  // 🔹 Remove from watchlist with confirmation
  const handleRemove = async (id) => {
    const confirm = window.confirm("Are you sure you want to remove this item?");
    if (!confirm) return;

    try {
      const token = await user.getIdToken(true);
      await axiosInstance.delete(`/watchlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Removed from watchlist");
      setWatchlist((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Remove error:", err);
      toast.error("Failed to remove");
    }
  };

  if (loading) return <Loading />;

  if (!watchlist.length)
    return <p className="text-center mt-10 text-gray-500">Your watchlist is empty.</p>;

  return (
    <div className="pt-16 px-4 md:px-20 min-h-screen bg-[#f5f0e1]">
      <h2 className="text-3xl font-bold mb-6">My Watchlist</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border">Product Name</th>
              <th className="py-2 px-4 border">Market</th>
              <th className="py-2 px-4 border">Price</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map((item) => (
              <tr key={item._id} className="text-center">
                <td className="py-2 px-4 border">{item.productName}</td>
                <td className="py-2 px-4 border">{item.marketName}</td>
                <td className="py-2 px-4 border">৳{item.price}</td>
                <td className="py-2 px-4 border">
                  {new Date(item.date || Date.now()).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border flex justify-center gap-2">
                  <button
                    onClick={() => handleViewDetails(item)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    🔍 View
                  </button>
                  <button
                    onClick={() => handleAddMore()}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    ➕ Add More
                  </button>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    ❌ Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyWatchlist;
