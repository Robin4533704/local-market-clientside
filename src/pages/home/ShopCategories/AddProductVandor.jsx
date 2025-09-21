import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/UseAxiosSecure";
import { useNavigate } from "react-router";

const AddProductVendor = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [markets, setMarkets] = useState([]);
  const [vegetables, setVegetables] = useState([]); // <-- vegetable state
  const [formData, setFormData] = useState({
    vendorEmail: user?.email || "",
    vendorName: user?.displayName || "",
    marketName: "",
    marketDescription: "",
    vegetable: "",       // <-- vegetable field
    date: new Date().toISOString().split("T")[0],
    items: [
      { item_name: "", unit: "kg", current_price: 0, description: "", image: "" }
    ],
    status: "pending",
  });

  useEffect(() => {
    fetch("/Services.json")
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        console.log("Loaded markets:", data);
        setMarkets(data);

        const vegs = data.map(m => ({
          district: m.district,
          vegetable: m.vegetable || "" // Services.json-এ vegetable ফিল্ড থাকলে
        }));
        setVegetables(vegs);
      })
      .catch(err => console.error("Failed to load markets:", err));
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        vendorEmail: user.email,
        vendorName: user.displayName,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index][name] = name === "current_price" ? Number(value) : value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItemRow = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { item_name: "", unit: "kg", current_price: 0, description: "", image: "" }],
    }));
  };

  const removeItemRow = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosSecure.post("/vendor/products", formData);
      if (data.success) {
        Swal.fire("Success", "Product added successfully!", "success");
        setFormData(prev => ({
          ...prev,
          marketName: "",
          marketDescription: "",
          vegetable: "",
          items: [{ item_name: "", unit: "kg", current_price: 0, description: "", image: "" }],
        }));
      }
      navigate("/dashboard/myproductvandor");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Market Dropdown */}
        <select
          name="marketName"
          value={formData.marketName}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">Select District</option>
          {markets.map((m, index) => (
            <option key={index} value={m.district}>{m.district}</option>
          ))}
        </select>

        {/* Vegetable Dropdown */}
        <select
          name="vegetable"
          value={formData.vegetable}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">Select Vegetable</option>
          {vegetables
            .filter(v => v.district === formData.marketName)
            .map((v, index) => (
              <option key={index} value={v.vegetable}>{v.vegetable}</option>
            ))}
        </select>

        <textarea
          name="marketDescription"
          value={formData.marketDescription}
          onChange={handleChange}
          placeholder="Market Description"
          className="border p-2 w-full rounded"
        />

        <h3 className="text-lg font-semibold">Items</h3>
        {formData.items.map((item, i) => (
          <div key={i} className="border p-3 rounded mb-3">
            <input type="text" name="item_name" value={item.item_name} onChange={(e) => handleItemChange(e, i)} placeholder="Item Name" className="border p-2 w-full rounded mb-2" required />
            <input type="number" name="current_price" value={item.current_price} onChange={(e) => handleItemChange(e, i)} placeholder="Price" className="border p-2 w-full rounded mb-2" required />
            <input type="text" name="unit" value={item.unit} onChange={(e) => handleItemChange(e, i)} placeholder="Unit (kg, pc, etc)" className="border p-2 w-full rounded mb-2" />
            <input type="text" name="description" value={item.description} onChange={(e) => handleItemChange(e, i)} placeholder="Description" className="border p-2 w-full rounded mb-2" />
            <input type="text" name="image" value={item.image} onChange={(e) => handleItemChange(e, i)} placeholder="Image URL" className="border p-2 w-full rounded mb-2" />
            <button type="button" onClick={() => removeItemRow(i)} className="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
          </div>
        ))}

        <div className="flex gap-4">
          <button type="button" onClick={addItemRow} className="bg-green-500 text-white px-4 py-2 rounded">+ Add Item</button>
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">Submit</button>
        </div>

      </form>
    </div>
  );
};

export default AddProductVendor;
