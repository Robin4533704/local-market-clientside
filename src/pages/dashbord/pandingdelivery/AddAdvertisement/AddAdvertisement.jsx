import React, { useState } from "react";
import useAxiosSecure from "../../../../hooks/UseAxiosSecure";
import { getAuth } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";

const AddAdvertisement = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vendorEmail: user?.email || "",
    vendorName: user?.displayName || "",
    title: "",
    description: "",
    image: "",
    status: "pending",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosSecure.post("/vendor/advertisements", formData);
      if (data.success) {
        toast.success("Advertisement added successfully!");
        setFormData({
          vendorEmail: user?.email || "",
          vendorName: user?.displayName || "",
          title: "",
          description: "",
          image: "",
          status: "pending",
        });
        // সাবমিশনের পরে স্বয়ংক্রিয়ভাবে নেভিগেট করতে পারেন
        setTimeout(() => navigate("/dashboard/my-advertisements"), 1500);
      } else {
        toast.error(data?.message || "Failed to add advertisement");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding advertisement");
    }
  };
  

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <h2 className="text-2xl font-bold mb-4">Add Advertisement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vendor Email ও Name ReadOnly থাকার জন্য */}
        <input
          type="email"
          value={formData.vendorEmail}
          readOnly
          className="w-full p-3 border rounded bg-gray-100"
        />
        <input
          type="text"
          value={formData.vendorName}
          readOnly
          className="w-full p-3 border rounded bg-gray-100"
        />
        {/* অন্যান্য ইনপুট */}
        <input
          type="text"
          name="title"
          placeholder="Ad Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Short Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          rows={3}
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded"
        >
          Add Advertisement
        </button>
      </form>
    </div>
  );
};

export default AddAdvertisement;