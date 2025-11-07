import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../../../paymentmethod/productContext/ProductContext";
import useAxiosSecure from "../../../../../hooks/UseAxiosSecure";
import { FaPlus, FaTrash, FaUpload, FaDollarSign, FaShoppingCart, FaUser, FaStore } from "react-icons/fa";

const AddProducts = () => {
  const { fetchProducts } = useContext(ProductContext);
  const axiosInstance = useAxiosSecure();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    product_name: "",
    image: "",
    final_price: "",
    marketName: "",
    vendorName: "",
    items: [{ item_name: "", price: "", unit: "kg" }],
    reviews: [],
    status: "approved",
    date: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value 
    }));

    // Show image preview when image URL is entered
    if (name === "image" && value) {
      setImagePreview(value);
    }
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index][name] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { item_name: "", price: "", unit: "kg" }],
    }));
  };

  const removeItemRow = (index) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    } else {
      Swal.fire({
        icon: "warning",
        title: "Cannot Remove",
        text: "At least one item is required",
        confirmButtonColor: "#f59e0b",
      });
    }
  };

  const validateForm = () => {
    if (!formData.product_name.trim()) {
      Swal.fire("Error", "Please enter product name", "error");
      return false;
    }
    if (!formData.vendorName.trim()) {
      Swal.fire("Error", "Please enter vendor name", "error");
      return false;
    }
    if (!formData.marketName.trim()) {
      Swal.fire("Error", "Please enter market name", "error");
      return false;
    }
    if (!formData.final_price || Number(formData.final_price) <= 0) {
      Swal.fire("Error", "Please enter a valid final price", "error");
      return false;
    }

    // Validate items
    for (let item of formData.items) {
      if (!item.item_name.trim()) {
        Swal.fire("Error", "Please enter all item names", "error");
        return false;
      }
      if (!item.price || Number(item.price) < 0) {
        Swal.fire("Error", "Please enter valid item prices", "error");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const productData = {
        ...formData,
        final_price: Number(formData.final_price),
        items: formData.items.map(item => ({
          ...item,
          price: Number(item.price)
        })),
        date: new Date().toISOString().split("T")[0],
        created_at: new Date().toISOString(),
      };

      console.log("Sending product data:", productData);

      const { data } = await axiosInstance.post("/products", productData);
      console.log("POST response:", data);

      if (data.success || data.insertedId) {
        await Swal.fire({
          icon: "success",
          title: "Product Added Successfully!",
          text: "New product has been added successfully",
          confirmButtonColor: "#10b981",
          confirmButtonText: "OK",
        });

        // Refresh product list
        await fetchProducts();

        // Reset form
        setFormData({
          product_name: "",
          image: "",
          final_price: "",
          marketName: "",
          vendorName: "",
          items: [{ item_name: "", price: "", unit: "kg" }],
          reviews: [],
          status: "approved",
          date: new Date().toISOString().split("T")[0],
        });
        setImagePreview("");

        // Navigate to product list or details
        const productId = data.insertedId || data._id;
        if (productId) {
          navigate(`/productlist/${productId}`);
        } else {
          navigate("/productlist");
        }
      } else {
        throw new Error(data?.message || "Failed to add product");
      }
    } catch (err) {
      console.error("Product addition error:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to Add Product!",
        text: err.response?.data?.message || "Sorry, the product could not be added. Please try again.",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "Understand",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-12 bg-gradient-to-br from-green-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <FaShoppingCart className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Add New Product
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Fill in your new product information and add it to the marketplace
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* Basic Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200 flex items-center gap-2">
                <FaStore className="text-green-500" />
                Basic Product Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="product_name"
                      value={formData.product_name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      required
                    />
                    <FaShoppingCart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Vendor Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Vendor Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="vendorName"
                      value={formData.vendorName}
                      onChange={handleChange}
                      placeholder="Enter vendor name"
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      required
                    />
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Market Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Market Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="marketName"
                      value={formData.marketName}
                      onChange={handleChange}
                      placeholder="Enter market name"
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      required
                    />
                    <FaStore className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Final Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Final Price *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="final_price"
                      value={formData.final_price}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      required
                    />
                    <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div className="mt-6 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Image URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  />
                  <FaUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Items Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaPlus className="text-green-500" />
                  Product Items
                </h2>
                <button
                  type="button"
                  onClick={addItemRow}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FaPlus size={14} />
                  Add New Item
                </button>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-gray-50 rounded-lg">
                    <div className="md:col-span-5 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Item Name *
                      </label>
                      <input
                        type="text"
                        name="item_name"
                        value={item.item_name}
                        onChange={(e) => handleItemChange(e, index)}
                        placeholder="Enter item name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-3 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Price *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={item.price}
                        onChange={(e) => handleItemChange(e, index)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-3 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Unit
                      </label>
                      <select
                        name="unit"
                        value={item.unit}
                        onChange={(e) => handleItemChange(e, index)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      >
                        <option value="kg">Kilogram</option>
                        <option value="gm">Gram</option>
                        <option value="piece">Piece</option>
                        <option value="liter">Liter</option>
                        <option value="pack">Pack</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-1 space-y-2">
                      <button
                        type="button"
                        onClick={() => removeItemRow(index)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                        title="Remove Item"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/productlist")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Add Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            * Marked fields are required
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;