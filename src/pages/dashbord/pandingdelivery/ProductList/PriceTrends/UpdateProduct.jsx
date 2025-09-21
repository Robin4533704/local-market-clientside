import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useAxiosSecure from "../../../../../hooks/UseAxiosSecure";
import "react-toastify/dist/ReactToastify.css";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    marketName: "",
    marketDescription: "",
    date: "",
    items: [
      { item_name: "", unit: "kg", current_price: 0, prices: [], description: "", image: "" }
    ],
    status: "pending",
  });

  useEffect(() => {
    if (!id) {
      toast.error("Invalid product ID");
      navigate("/dashboard/myproductvandor");
      return;
    }

    const fetchProduct = async () => {
      try {
        const { data } = await axiosSecure.get(`/vendor/products/${id}`);
        setFormData({
          marketName: data.marketName || "",
          marketDescription: data.marketDescription || "",
          date: data.date || new Date().toISOString().split("T")[0],
          items: data.items?.length ? data.items : [{ item_name: "", unit: "kg", current_price: 0, prices: [], description: "", image: "" }],
          status: data.status || "pending",
        });
      } catch (err) {
        console.error("Fetch Product Error:", err);
        toast.error("Failed to fetch product details");
        navigate("/dashboard/myproductvandor");
      }
    };

    fetchProduct();
  }, [id, axiosSecure, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index][name] = name === "current_price" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { item_name: "", unit: "kg", current_price: 0, prices: [], description: "", image: "" }],
    }));
  };

  const removeItemRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log("Updating product ID:", id); // debug
    const { data } = await axiosSecure.put(`/vendor/products/${id}`, formData);
    console.log(data);
    toast.success("Product updated successfully!");
    navigate("/dashboard/myproductvandor");
  } catch (err) {
    console.error("Update Product Error:", err);
    toast.error(err.response?.data?.message || "Failed to update product");
  }
};

  return (
    <div className="pt-16 md:pt-24 px-4 md:px-10 lg:px-20 min-h-screen bg-[#f5f0e1] flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="w-full max-w-4xl bg-white p-6 md:p-10 rounded-xl shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">Update Vendor Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Market Details */}
          <input type="text" name="marketName" value={formData.marketName} onChange={handleChange} placeholder="Market Name" className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
          <textarea name="marketDescription" value={formData.marketDescription} onChange={handleChange} placeholder="Market Description" rows={3} className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-y" />
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />

          {/* Items Section */}
          <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">Items</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-5 mb-5 bg-gray-50 shadow-sm hover:shadow-md transition-transform transform hover:scale-[1.02]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <input type="text" name="item_name" value={item.item_name} onChange={(e) => handleItemChange(e, index)} placeholder="Item Name" className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
                <input type="number" name="current_price" value={item.current_price} onChange={(e) => handleItemChange(e, index)} placeholder="Price per Unit" className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <input type="text" name="unit" value={item.unit} onChange={(e) => handleItemChange(e, index)} placeholder="Unit (kg/lb/etc.)" className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                <input type="text" name="description" value={item.description} onChange={(e) => handleItemChange(e, index)} placeholder="Item Description (optional)" className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                <input type="text" name="image" value={item.image} onChange={(e) => handleItemChange(e, index)} placeholder="Image URL" className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
              <button type="button" onClick={() => removeItemRow(index)} className="mt-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg w-full md:w-auto transition-colors duration-200">❌ Remove</button>
            </div>
          ))}

          {/* Add Item Button */}
          <div className="flex justify-center mb-2">
            <button type="button" onClick={addItemRow} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg transition-colors duration-200 shadow-md">➕ Add Item</button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors duration-200 shadow-md">Update Product</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
