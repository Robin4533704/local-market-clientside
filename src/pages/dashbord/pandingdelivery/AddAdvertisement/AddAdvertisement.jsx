import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../../hooks/UseAxiosSecure";
import { getAuth } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AddAdvertisement = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vendorEmail: "",
    vendorName: "",
    title: "",
    description: "",
    image: "",
    status: "pending",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        vendorEmail: user.email || "",
        vendorName: user.displayName || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters long";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    }

    if (formData.image.trim() && !isValidUrl(formData.image)) {
      newErrors.image = "Please enter a valid image URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create an advertisement");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosSecure.post("/vendor/advertisements", formData);
      
      if (data.success) {
        toast.success("Advertisement added successfully!");
        
        // Reset form
        setFormData({
          vendorEmail: user.email,
          vendorName: user.displayName,
          title: "",
          description: "",
          image: "",
          status: "pending",
        });
        
        // Navigate after success
        setTimeout(() => navigate("/dashboard/my-advertisements"), 2000);
      } else {
        toast.error(data?.message || "Failed to add advertisement");
      }
    } catch (err) {
      console.error("Advertisement submission error:", err);
      toast.error(
        err.response?.data?.message || 
        "Error adding advertisement. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
      navigate("/dashboard/my-advertisements");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        theme="colored" 
        pauseOnHover
      />
      
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create New Advertisement</h2>
        <p className="text-gray-600">Fill in the details below to create a new advertisement</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vendor Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Vendor Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.vendorEmail}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Name
              </label>
              <input
                type="text"
                value={formData.vendorName}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Advertisement Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Advertisement Details</h3>
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Advertisement Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter a compelling title for your advertisement"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              disabled={loading}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Describe your advertisement in detail..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              disabled={loading}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Minimum 10 characters required</span>
              <span>{formData.description.length}/500</span>
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL (Optional)
            </label>
            <input
              type="text"
              name="image"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.image ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
            {formData.image && isValidUrl(formData.image) && (
              <div className="mt-2">
                <p className="text-sm text-green-600 mb-2">Image preview:</p>
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-blue-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              "Create Advertisement"
            )}
          </button>
        </div>
      </form>

      {/* Status Info */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Advertisement Status
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Your advertisement will be reviewed by administrators before being published. 
                You can check the status in your advertisements list.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdvertisement;