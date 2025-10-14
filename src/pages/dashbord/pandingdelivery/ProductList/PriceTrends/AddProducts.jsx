import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { ProductContext } from "../../../paymentmethod/productContext/ProductContext";
import useAxiosSecure from "../../../../../hooks/UseAxiosSecure";

const AddProducts = () => {
  const { fetchProducts } = useContext(ProductContext);
  const axiosInstance = useAxiosSecure();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    product_name: "",
    image: "",
    final_price: 0,
    marketName: "",
    vendorName: "",
    items: [{ item_name: "", price: 0, unit: "kg" }],
    reviews: [],
    status: "approved",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index][name] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItemRow = () =>
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { item_name: "", price: 0, unit: "kg" }],
    }));

  const removeItemRow = (index) =>
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const currentDate = new Date().toISOString().split("T")[0]; // আজকের তারিখ
    const productData = {
      ...formData,
      final_price: Number(formData.final_price), // নিশ্চিত করুন দাম সংখ্যা
      date: currentDate,
    };

    console.log("Sending data:", productData);

    const { data } = await axiosInstance.post("/products", productData);
    console.log("POST response:", data);

    if (data.success || data.insertedId) {
      Swal.fire("Success", "Product added successfully!", "success");

      // আপডেটেড প্রোডাক্ট তালিকা রিফ্রেশ
      await fetchProducts();

      const productId = data.insertedId;
      // ফর্ম রিসেট
      setFormData({
        product_name: "",
        image: "",
        final_price: 0,
        marketName: "",
        vendorName: "",
        items: [{ item_name: "", price: 0, unit: "kg" }],
        reviews: [],
        status: "approved",
        date: new Date().toISOString().split("T")[0],
      });

      // প্রোডাক্টের বিস্তারিত পেজে নেভিগেট করুন
      navigate(`/productlist/${productId}`);
    } else {
      Swal.fire("Error", data?.message || "Failed to add product", "error");
    }
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to add product", "error");
  }
};

  return (
 <div className="pt-24 px-4 sm:px-6 md:px-10 lg:px-20 min-h-screen bg-[#f5f0e1]">
  <div className="text-center mb-8">
    <h2 className="text-3xl font-bold text-gray-800">Add New Product</h2>
    <p className="text-gray-600 text-sm md:text-base mt-1">
      Fill in all required fields to add a new product
    </p>
  </div>

  <form
    onSubmit={handleSubmit}
    className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4"
  >
    {/* Product Info */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input
        type="text"
        name="product_name"
        value={formData.product_name}
        onChange={handleChange}
        placeholder="Product Name"
        className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        required
      />
      <input
        type="text"
        name="vendorName"
        value={formData.vendorName}
        onChange={handleChange}
        placeholder="User Name"
        className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        required
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input
        type="text"
        name="marketName"
        value={formData.marketName}
        onChange={handleChange}
        placeholder="Market Name"
        className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        required
      />
      <input
        type="text"
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="Image URL"
        className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
      />
    </div>

    <input
      type="number"
      name="final_price"
      value={formData.final_price}
      onChange={handleChange}
      placeholder="Final Price"
      className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
    />

    {/* Items Section */}
    <h3 className="font-semibold text-lg mt-6 mb-2 text-gray-800">
      Product Items
    </h3>

    <div className="space-y-3">
      {formData.items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row gap-2 sm:items-center"
        >
          <input
            type="text"
            name="item_name"
            value={item.item_name}
            onChange={(e) => handleItemChange(e, index)}
            placeholder="Item Name"
            className="border border-gray-300 p-2.5 rounded-lg flex-1 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="number"
            name="price"
            value={item.price}
            onChange={(e) => handleItemChange(e, index)}
            placeholder="Price"
            className="border border-gray-300 p-2.5 rounded-lg w-full sm:w-24 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="text"
            name="unit"
            value={item.unit}
            onChange={(e) => handleItemChange(e, index)}
            placeholder="Unit"
            className="border border-gray-300 p-2.5 rounded-lg w-full sm:w-24 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button
            type="button"
            onClick={() => removeItemRow(index)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
          >
            ❌
          </button>
        </div>
      ))}
    </div>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
      <button
        type="button"
        onClick={addItemRow}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-colors"
      >
        ➕ Add Item
      </button>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-colors"
      >
        Add Product
      </button>
    </div>
  </form>
</div>

  );
};

export default AddProducts;
