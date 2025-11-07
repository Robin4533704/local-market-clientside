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
  const [vegetables, setVegetables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vendorEmail: user?.email || "",
    vendorName: user?.displayName || "",
    marketName: "",
    marketDescription: "",
    vegetable: "",
    date: new Date().toISOString().split("T")[0],
    items: [
      { item_name: "", unit: "kg", current_price: "", description: "", image: "" }
    ],
    status: "pending",
  });

  // Load markets and vegetables data
  useEffect(() => {
    setLoading(true);
    fetch("/Services.json")
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        console.log("Loaded markets:", data);
        setMarkets(data);
        
        // Extract unique vegetables from all markets
        const allVegetables = [...new Set(data
          .filter(market => market.vegetable)
          .map(market => market.vegetable)
        )];
        setVegetables(allVegetables);
      })
      .catch(err => {
        console.error("Failed to load markets:", err);
        Swal.fire("Error", "Failed to load market data", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  // Update user data when user is available
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
    
    // Convert price to number if it's the current_price field
    if (name === "current_price") {
      newItems[index][name] = value === "" ? "" : Number(value);
    } else {
      newItems[index][name] = value;
    }
    
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItemRow = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items, 
        { item_name: "", unit: "kg", current_price: "", description: "", image: "" }
      ],
    }));
  };

  const removeItemRow = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    } else {
      Swal.fire("Info", "At least one item is required", "info");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.marketName || !formData.vegetable) {
      Swal.fire("Error", "Please select both district and vegetable", "error");
      return;
    }

    // Validate items
    const invalidItems = formData.items.filter(item => 
      !item.item_name || item.current_price === "" || item.current_price <= 0
    );

    if (invalidItems.length > 0) {
      Swal.fire("Error", "Please fill all required item fields with valid prices", "error");
      return;
    }

    setLoading(true);
    
    try {
      const { data } = await axiosSecure.post("/vendor/products", formData);
      if (data.success) {
        Swal.fire("Success", "Product added successfully!", "success");
        // Reset form
        setFormData(prev => ({
          ...prev,
          marketName: "",
          marketDescription: "",
          vegetable: "",
          items: [{ item_name: "", unit: "kg", current_price: "", description: "", image: "" }],
        }));
        navigate("/dashboard/myproductvandor");
      }
    } catch (err) {
      console.error("Submission error:", err);
      Swal.fire(
        "Error", 
        err.response?.data?.message || "Failed to add product", 
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get unique districts from markets
  const uniqueDistricts = [...new Set(markets.map(market => market.district))];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Product</h2>
      
      {loading && (
        <div className="text-center mb-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* District Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select District *
          </label>
          <select
            name="marketName"
            value={formData.marketName}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={loading}
          >
            <option value="">Select District</option>
            {uniqueDistricts.map((district, index) => (
              <option key={index} value={district}>{district}</option>
            ))}
          </select>
        </div>

        {/* Vegetable Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Vegetable *
          </label>
          <select
            name="vegetable"
            value={formData.vegetable}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={loading}
          >
            <option value="">Select Vegetable</option>
            {vegetables.map((vegetable, index) => (
              <option key={index} value={vegetable}>{vegetable}</option>
            ))}
          </select>
        </div>

        {/* Market Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Market Description
          </label>
          <textarea
            name="marketDescription"
            value={formData.marketDescription}
            onChange={handleChange}
            placeholder="Enter market description..."
            rows="3"
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {/* Items Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Items</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-lg mb-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input 
                    type="text" 
                    name="item_name" 
                    value={item.item_name} 
                    onChange={(e) => handleItemChange(e, index)} 
                    placeholder="Enter item name"
                    className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required 
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input 
                    type="number" 
                    name="current_price" 
                    value={item.current_price} 
                    onChange={(e) => handleItemChange(e, index)} 
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required 
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={item.unit}
                    onChange={(e) => handleItemChange(e, index)}
                    className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  >
                    <option value="kg">kg</option>
                    <option value="pc">Piece</option>
                    <option value="g">gram</option>
                    <option value="lb">pound</option>
                    <option value="bag">bag</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input 
                    type="text" 
                    name="description" 
                    value={item.description} 
                    onChange={(e) => handleItemChange(e, index)} 
                    placeholder="Enter description"
                    className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input 
                  type="text" 
                  name="image" 
                  value={item.image} 
                  onChange={(e) => handleItemChange(e, index)} 
                  placeholder="Enter image URL"
                  className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>

              {formData.items.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeItemRow(index)} 
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors"
                  disabled={loading}
                >
                  Remove Item
                </button>
              )}
            </div>
          ))}

          <button 
            type="button" 
            onClick={addItemRow} 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            disabled={loading}
          >
            <span>+</span> Add Another Item
          </button>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button 
            type="button" 
            onClick={() => navigate("/dashboard/myproductvandor")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              "Submit Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductVendor;