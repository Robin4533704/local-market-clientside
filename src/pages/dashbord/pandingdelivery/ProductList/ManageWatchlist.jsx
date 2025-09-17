import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAxios from "../../../../hooks/useAxios";

const ManageWatchlist = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch watchlist
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const token = localStorage.getItem("FBToken");
        if (!token) {
          toast.error("User not authenticated");
          setLoading(false);
          return;
        }

        const res = await axiosInstance.get("/watchlist", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Backend এ success property থাকলে
        setWatchlist(res.data?.data || []);
      } catch (err) {
        console.error("Fetch watchlist error:", err);
        toast.error("Failed to load watchlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [axiosInstance]);

  // Remove from watchlist
  const handleRemove = async (id) => {
    const confirm = await Swal.fire({
      title: "Remove from watchlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("FBToken");
      await axiosInstance.delete(`/watchlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist((prev) => prev.filter((item) => item._id !== id));
      toast.success("Removed successfully");
    } catch (err) {
      console.error("Remove watchlist error:", err);
      toast.error("Failed to remove item");
    }
  };

  if (loading) return <p className="pt-24 px-4">Loading watchlist...</p>;
  if (!watchlist.length) return <p className="pt-24 px-4">No items in your watchlist.</p>;

  return (
    <div className="pt-24 px-4 md:px-20">
      <h2 className="text-2xl font-bold mb-4">Manage Watchlist</h2>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Product</th>
              <th className="border px-4 py-2">Market</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map((item) => (
              <tr key={item._id}>
                <td className="border px-4 py-2">{item.productName}</td>
                <td className="border px-4 py-2">{item.marketName}</td>
                <td className="border px-4 py-2">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    onClick={() => navigate("/all-products")}
                    className="bg-green-500 text-white px-2 rounded"
                  >
                    ➕ Add More
                  </button>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="bg-red-500 text-white px-2 rounded"
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

export default ManageWatchlist;
