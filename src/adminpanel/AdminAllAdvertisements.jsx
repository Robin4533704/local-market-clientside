import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Trash2, Check, X } from "lucide-react";
import useAxiosSecure from "../hooks/UseAxiosSecure";

const AdminAllAdvertisements = () => {
  const axiosSecure = useAxiosSecure();
  const [ads, setAds] = useState([]);

  const fetchAds = async () => {
    try {
      const { data } = await axiosSecure.get("/admin/advertisements");
      setAds(data);
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Failed to fetch advertisements",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await axiosSecure.put(`/admin/advertisements/${id}`, { status });
      Swal.fire("Updated", `Advertisement ${status}`, "success");
      fetchAds();
    } catch {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Advertisement?",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/admin/advertisements/${id}`);
        Swal.fire("Deleted", "Advertisement deleted", "success");
        fetchAds();
      } catch {
        Swal.fire("Error", "Failed to delete advertisement", "error");
      }
    }
  };

  return (
 <div className="p-4 sm:p-6 max-w-7xl mx-auto">
  <h2 className="text-xl sm:text-2xl font-bold mb-4">All Advertisements (Admin)</h2>

  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-300 text-sm sm:text-base">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="p-2 border">Title</th>
          <th className="p-2 border hidden sm:table-cell">Vendor</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {ads.length > 0 ? (
          ads.map((ad) => (
            <tr key={ad._id} className="text-center sm:text-left hover:bg-gray-50">
              <td className="border p-2">{ad.title}</td>
              <td className="border p-2 hidden sm:table-cell">{ad.vendorEmail}</td>
              <td className="border p-2 capitalize">{ad.status}</td>
              <td className="border p-2 flex gap-2 justify-center sm:justify-start flex-wrap">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded text-xs sm:text-sm"
                  onClick={() => handleStatus(ad._id, "approved")}
                  disabled={ad.status === "approved"}
                >
                  <Check size={16} />
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded text-xs sm:text-sm"
                  onClick={() => handleStatus(ad._id, "rejected")}
                  disabled={ad.status === "rejected"}
                >
                  <X size={16} />
                </button>
                <button
                  className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded text-xs sm:text-sm"
                  onClick={() => handleDelete(ad._id)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center p-4">
              No advertisements found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default AdminAllAdvertisements;
