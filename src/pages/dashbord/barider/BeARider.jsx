import { useState, useEffect } from "react";
import service from "../../../../public/Services.json";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/UseAxiosSecure";
import UseAuth from "../../../hooks/UseAuth";
import { FaUser, FaEnvelope, FaBirthdayCake, FaMapMarkerAlt, FaPhone, FaIdCard, FaMotorcycle, FaShieldAlt, FaCheckCircle } from "react-icons/fa";

const BeARider = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();

  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    region: "",
    district: "",
    phone: "",
    nationalId: "",
    bikeBrand: "",
    bikeRegNumber: "",
    status: "pending",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill name/email from Firebase user
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  // Load unique regions
  useEffect(() => {
    const uniqueRegions = [...new Set(service.map(item => item.region))];
    setRegions(uniqueRegions);
  }, []);

  // Load districts based on region
  useEffect(() => {
    if (formData.region) {
      const filteredDistricts = [
        ...new Set(service
          .filter(item => item.region === formData.region)
          .map(item => item.district))
      ];
      setDistricts(filteredDistricts);
      setFormData(prev => ({ ...prev, district: "" }));
    } else {
      setDistricts([]);
      setFormData(prev => ({ ...prev, district: "" }));
    }
  }, [formData.region]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Swal.fire("Error", "Please enter your full name", "error");
      return false;
    }
    if (!formData.email.trim()) {
      Swal.fire("Error", "Please enter your email address", "error");
      return false;
    }
    if (!formData.age || formData.age < 18 || formData.age > 65) {
      Swal.fire("Error", "Age must be between 18 and 65 years", "error");
      return false;
    }
    if (!formData.phone || formData.phone.length < 10) {
      Swal.fire("Error", "Please enter a valid phone number", "error");
      return false;
    }
    if (!formData.nationalId || formData.nationalId.length < 10) {
      Swal.fire("Error", "Please enter a valid National ID number", "error");
      return false;
    }
    if (!formData.bikeBrand.trim()) {
      Swal.fire("Error", "Please enter your bike brand", "error");
      return false;
    }
    if (!formData.bikeRegNumber.trim()) {
      Swal.fire("Error", "Please enter your bike registration number", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Check if user already exists
      const existing = await axiosSecure.get(`/riders?email=${formData.email}`);
      if (existing.data.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Application Already Submitted",
          text: "You have already submitted a rider application. Please wait for approval.",
          confirmButtonColor: "#ef4444",
        });
        setIsSubmitting(false);
        return;
      }

      // Submit new rider
      const res = await axiosSecure.post("/riders", {
        ...formData,
        application_date: new Date().toISOString(),
        user_photoURL: user?.photoURL,
      });

      if (res.data.insertedId) {
        await Swal.fire({
          icon: "success",
          title: "Application Submitted Successfully! 🎉",
          html: `
            <div class="text-center">
              <p class="mb-3">Your rider application has been submitted for review.</p>
              <div class="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
                <p class="text-green-800 font-semibold">Application Status: <span class="text-orange-600">Pending Review</span></p>
              </div>
              <p class="text-sm text-gray-600 mt-3">We will contact you within 2-3 business days.</p>
            </div>
          `,
          confirmButtonColor: "#10b981",
          confirmButtonText: "Got It",
        });

        // Reset form fields except name/email
        setFormData(prev => ({
          ...prev,
          age: "",
          region: "",
          district: "",
          phone: "",
          nationalId: "",
          bikeBrand: "",
          bikeRegNumber: "",
        }));
      }
    } catch (error) {
      console.error("Error submitting application:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.response?.data?.message || "Something went wrong! Please check the form and try again.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen mt-12 bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-4">
            <FaMotorcycle className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Join Our Rider Team
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Become a delivery rider and start earning with our platform
          </p>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaUser className="text-blue-500" />
                Personal Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Age *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      min="18"
                      max="65"
                      placeholder="Enter your age"
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                    <FaBirthdayCake className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500">Must be between 18-65 years</p>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-500" />
                Location Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Region */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Region *
                  </label>
                  <div className="relative">
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors appearance-none"
                    >
                      <option value="">Select Region</option>
                      {regions.map((region, idx) => (
                        <option key={idx} value={region}>{region}</option>
                      ))}
                    </select>
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      ▼
                    </div>
                  </div>
                </div>

                {/* District */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    District *
                  </label>
                  <div className="relative">
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                      disabled={!formData.region}
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select District</option>
                      {districts.map((district, idx) => (
                        <option key={idx} value={district}>{district}</option>
                      ))}
                    </select>
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      ▼
                    </div>
                  </div>
                  {!formData.region && (
                    <p className="text-xs text-gray-500">Please select a region first</p>
                  )}
                </div>
              </div>
            </div>

            {/* Identification & Vehicle Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaShieldAlt className="text-orange-500" />
                Identification & Vehicle Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* National ID */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    National ID Card Number *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="nationalId"
                      value={formData.nationalId}
                      onChange={handleChange}
                      required
                      placeholder="Enter your National ID number"
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    />
                    <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Bike Brand */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Bike Brand *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="bikeBrand"
                      value={formData.bikeBrand}
                      onChange={handleChange}
                      required
                      placeholder="Enter your bike brand (e.g., Honda, Yamaha)"
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    />
                    <FaMotorcycle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Bike Registration Number */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Bike Registration Number *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="bikeRegNumber"
                      value={formData.bikeRegNumber}
                      onChange={handleChange}
                      required
                      placeholder="Enter your bike registration number"
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    />
                    <FaShieldAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements Checklist */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-blue-500" />
                Rider Requirements
              </h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500 text-xs" />
                  Must be 18-65 years old
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500 text-xs" />
                  Valid National ID card
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500 text-xs" />
                  Own a motorcycle in good condition
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500 text-xs" />
                  Valid bike registration documents
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500 text-xs" />
                  Smartphone with internet access
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                * Required fields
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-lg transition-all duration-200 hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Information */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need help with your application?{" "}
            <a href="mailto:support@deliveryapp.com" className="text-blue-500 hover:text-blue-600 font-medium">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BeARider;