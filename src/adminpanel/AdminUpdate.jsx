import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/UseAxiosSecure";

const AdminUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    marketName: "",
    marketDescription: "",
    vegetable: "",
    items: [{ item_name: "", unit: "kg", current_price: 0, description: "", image: "" }],
  });

  const [markets, setMarkets] = useState([]);
  const [vegetables, setVegetables] = useState([]);

  // Load product data
  useEffect(() => {
    axiosSecure.get(`/admin/products/${id}`)
      .then(res => setFormData(res.data))
      .catch(err => console.error(err));
  }, [id]);

  // Load server.json data
  useEffect(() => {
    fetch("/Services.json")
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        setMarkets(data);

        const vegs = data.map(m => ({
          district: m.district,
          vegetable: m.vegetable || ""
        }));
        setVegetables(vegs);
      })
      .catch(err => console.error("Failed to load markets:", err));
  }, []);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // handle items input change
  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = name === "current_price" ? Number(value) : value;
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItemRow = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { item_name: "", unit: "kg", current_price: 0, description: "", image: "" }]
    }));
  };

  const removeItemRow = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosSecure.put(`/admin/products/${id}`, formData);
      if (data.success) {
        Swal.fire("Success", "Product updated successfully!", "success");
        navigate("/dashboard/AdminAllProducts");
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to update product");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* District Dropdown */}
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
            <input
              type="text"
              name="item_name"
              value={item.item_name}
              onChange={(e) => handleItemChange(e, i)}
              placeholder="Item Name"
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="number"
              name="current_price"
              value={item.current_price}
              onChange={(e) => handleItemChange(e, i)}
              placeholder="Price"
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="text"
              name="unit"
              value={item.unit}
              onChange={(e) => handleItemChange(e, i)}
              placeholder="Unit (kg, pc, etc)"
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="text"
              name="description"
              value={item.description}
              onChange={(e) => handleItemChange(e, i)}
              placeholder="Description"
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="text"
              name="image"
              value={item.image}
              onChange={(e) => handleItemChange(e, i)}
              placeholder="Image URL"
              className="border p-2 w-full rounded mb-2"
            />
            <button
              type="button"
              onClick={() => removeItemRow(i)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="flex gap-4">
          <button type="button" onClick={addItemRow} className="bg-green-500 text-white px-4 py-2 rounded">+ Add Item</button>
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">Update</button>
        </div>

      </form>
    </div>
  );
};

export default AdminUpdate;
