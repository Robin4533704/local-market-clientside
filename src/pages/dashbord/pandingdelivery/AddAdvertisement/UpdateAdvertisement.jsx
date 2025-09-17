import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/UseAxiosSecure";
import useAuth from "../../../../hooks/UseAuth";

const UpdateAdvertisement = () => {
  const { id } = useParams(); // route থেকে id নিয়ে আসা
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user, loading: userLoading } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    status: "pending",
  });

  const [loading, setLoading] = useState(true);

  // Fetch single advertisement
  const fetchAd = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const { data } = await axiosSecure.get(`/vendor/advertisements/${user.email}`);
      const ad = data.find((ad) => ad._id === id);
      if (!ad) {
        Swal.fire("Error", "Advertisement not found", "error");
        navigate("/dashboard/my-advertisements");
        return;
      }
      setFormData({
        title: ad.title,
        description: ad.description,
        image: ad.image,
        status: ad.status,
      });
    } catch (err) {
      console.error("Fetch Ad Error:", err);
      Swal.fire("Error", "Failed to fetch advertisement", "error");
      navigate("/dashboard/my-advertisements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading) fetchAd();
  }, [user, userLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.put(`/vendor/advertisements/${id}`, formData);
      Swal.fire("Success", "Advertisement updated successfully", "success");
      navigate("/dashboard/my-advertisements");
    } catch (err) {
      console.error("Update Error:", err);
      Swal.fire("Error", "Failed to update advertisement", "error");
    }
  };

  if (loading || userLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Advertisement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateAdvertisement;
