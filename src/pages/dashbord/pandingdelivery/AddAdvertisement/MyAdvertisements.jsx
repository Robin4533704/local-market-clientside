import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/UseAuth";
import useAxiosSecure from "../../../../hooks/UseAxiosSecure";

const MyAdvertisements = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useAuth();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAds = async () => {
    if (!user?.email) return; // email না থাকলে call বন্ধ
    try {
      setLoading(true);
      const { data } = await axiosSecure.get(`/vendor/advertisements/${user.email}`);
      setAds(data);
    } catch (err) {
      console.error("Fetch Ads Error:", err);
      Swal.fire("Error", "Failed to fetch advertisements", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading && user?.email) {
      fetchAds();
    }
  }, [user, userLoading]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this ad?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/vendor/advertisements/${id}`);
      Swal.fire("Deleted!", "Advertisement deleted successfully", "success");
      fetchAds();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete advertisement", "error");
    }
  };

  if (loading || userLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">My Advertisements</h2>
      {ads.length === 0 ? (
        <p>No advertisements found</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Title</th>
              <th className="border px-2 py-1">Image</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad._id} className="text-center">
                <td className="border px-2 py-1">{ad.title}</td>
                <td className="border px-2 py-1">
                  {ad.image ? (
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-24 h-16 object-cover mx-auto rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="border px-2 py-1">{ad.status}</td>
                <td className="border px-2 py-1 space-x-1">
                  <button
                    onClick={() => navigate(`/dashboard/update-advertisement/${ad._id}`)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(ad._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyAdvertisements;
