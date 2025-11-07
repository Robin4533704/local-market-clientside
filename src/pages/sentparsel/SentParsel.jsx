import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../hooks/UseAuth";
import UseAxiosSecure from "../../hooks/UseAxiosSecure";
import { useLoaderData, useNavigate } from "react-router-dom";
import { FaBox, FaUser, FaPhone, FaMapMarkerAlt, FaDollarSign, FaWeight, FaInfoCircle, FaShippingFast } from "react-icons/fa";

const generateTrackingId = () => {
  const date = new Date();
  const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PCL-${datePart}-${rand}`;
};

const SentParcel = () => {
  const { user } = useAuth();
  const axiosSecure = UseAxiosSecure();
  const serviceData = useLoaderData() || [];
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const type = watch("type");
  const weight = watch("weight");
  const zone = watch("zone");

  const [selectedSenderRegion, setSelectedSenderRegion] = useState("");
  const [selectedReceiverRegion, setSelectedReceiverRegion] = useState("");

  // Get centers based on selected region
  const getCenters = (region) => {
    const found = serviceData.find(r => r.region === region);
    return found ? found.centers : [];
  };

  // Calculate delivery cost
  const calculateCost = () => {
    if (!type || !zone) return 0;

    const parsedWeight = parseFloat(weight) || 0;
    const baseCost = type === "document" ? 50 : 100;
    const weightCost = type === "non-document" ? parsedWeight * 20 : 0;
    const zoneCharge = zone === "inside-dhaka" ? 20 : zone === "outside-dhaka" ? 50 : 30;
    const extraCharges = parsedWeight > 5 ? 40 : 0;
    
    return baseCost + weightCost + zoneCharge + extraCharges;
  };

  // Form submit handler
  const onSubmit = async (data) => {
    try {
      const totalCost = calculateCost();
      
      const { value: proceed } = await Swal.fire({
        title: "🚚 Delivery Cost Summary",
        html: `
          <div class="text-left space-y-3">
            <div class="flex justify-between">
              <span class="font-semibold">Parcel Type:</span>
              <span>${data.type === 'document' ? '📄 Document' : '📦 Non-Document'}</span>
            </div>
            ${data.type === 'non-document' ? `
            <div class="flex justify-between">
              <span class="font-semibold">Weight:</span>
              <span>${data.weight || 0} kg</span>
            </div>
            ` : ''}
            <div class="flex justify-between">
              <span class="font-semibold">Delivery Zone:</span>
              <span>${data.zone === 'inside-dhaka' ? 'Inside Dhaka' : data.zone === 'outside-dhaka' ? 'Outside Dhaka' : 'Suburban Area'}</span>
            </div>
            <hr class="my-2">
            <div class="flex justify-between text-lg font-bold text-green-600">
              <span>Total Cost:</span>
              <span>${totalCost} Tk</span>
            </div>
            <p class="text-sm text-gray-600 mt-3">Proceed with payment?</p>
          </div>
        `,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, Proceed to Payment",
        cancelButtonText: "Review Details",
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });

      if (proceed) {
        const trackingId = generateTrackingId();
        const parcelData = {
          ...data,
          cost: totalCost,
          created_by: user?.email,
          payment_status: "unpaid",
          delivery_status: "pending",
          creation_date: new Date().toISOString(),
          tracking_id: trackingId,
          user_displayName: user?.displayName,
          user_photoURL: user?.photoURL,
        };

        const res = await axiosSecure.post('/parcels', parcelData);
        
        if (res.data.insertedId) {
          await Swal.fire({
            icon: "success",
            title: "Parcel Created Successfully! 🎉",
            html: `
              <div class="text-center">
                <p class="mb-3">Your parcel has been registered and is ready for payment.</p>
                <div class="bg-gray-100 p-3 rounded-lg inline-block">
                  <strong class="text-blue-600">Tracking ID:</strong><br>
                  <span class="text-lg font-mono">${trackingId}</span>
                </div>
              </div>
            `,
            confirmButtonColor: "#10b981",
            confirmButtonText: "View My Parcels",
          });
          
          navigate(`/dashboard/myparcels`);
        }
      }
    } catch (error) {
      console.error("Parcel submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Failed to create parcel. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-4">
            <FaShippingFast className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Send a Parcel
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Fill in the details below to schedule your parcel delivery
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Parcel Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FaBox className="text-blue-500" />
                    Parcel Information
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Parcel Title */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Parcel Title *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          {...register("title", { 
                            required: "Parcel title is required",
                            minLength: {
                              value: 3,
                              message: "Title must be at least 3 characters"
                            }
                          })}
                          placeholder="Enter parcel title (e.g., Important Documents)"
                          className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                        <FaBox className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                      {errors.title && (
                        <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                          ⚠️ {errors.title.message}
                        </p>
                      )}
                    </div>

                    {/* Delivery Zone */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Delivery Zone *
                      </label>
                      <div className="relative">
                        <select
                          {...register("zone", { required: "Please select delivery zone" })}
                          className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none"
                        >
                          <option value="">Select Delivery Zone</option>
                          <option value="inside-dhaka">Inside Dhaka</option>
                          <option value="outside-dhaka">Outside Dhaka</option>
                          <option value="suburban">Suburban Area</option>
                        </select>
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                          ▼
                        </div>
                      </div>
                      {errors.zone && (
                        <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                          ⚠️ {errors.zone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Parcel Type and Weight */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Parcel Type *
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="document"
                            {...register("type", { required: "Please select parcel type" })}
                            className="text-blue-500 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-2">
                            <FaBox className="text-blue-500" />
                            Document
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="non-document"
                            {...register("type", { required: "Please select parcel type" })}
                            className="text-green-500 focus:ring-green-500"
                          />
                          <span className="flex items-center gap-2">
                            <FaShippingFast className="text-green-500" />
                            Non-Document
                          </span>
                        </label>
                      </div>
                      {errors.type && (
                        <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                          ⚠️ {errors.type.message}
                        </p>
                      )}
                    </div>

                    {type === "non-document" && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Weight (kg) *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="50"
                            {...register("weight", { 
                              required: type === "non-document" ? "Weight is required for non-document parcels" : false,
                              min: {
                                value: 0.1,
                                message: "Weight must be at least 0.1 kg"
                              },
                              max: {
                                value: 50,
                                message: "Weight cannot exceed 50 kg"
                              }
                            })}
                            placeholder="Enter weight in kg"
                            className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                          />
                          <FaWeight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        {errors.weight && (
                          <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            ⚠️ {errors.weight.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sender and Receiver Information */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Sender Information */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <FaUser className="text-blue-500" />
                      Sender Information
                    </h2>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Full Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            {...register("senderName", { 
                              required: "Sender name is required",
                              minLength: {
                                value: 2,
                                message: "Name must be at least 2 characters"
                              }
                            })}
                            placeholder="Sender's full name"
                            className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                          />
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        {errors.senderName && (
                          <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            ⚠️ {errors.senderName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            {...register("senderContact", { 
                              required: "Phone number is required",
                              pattern: {
                                value: /^[0-9+-\s()]{10,}$/,
                                message: "Please enter a valid phone number"
                              }
                            })}
                            placeholder="Sender's phone number"
                            className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                          />
                          <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        {errors.senderContact && (
                          <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            ⚠️ {errors.senderContact.message}
                          </p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Region *
                          </label>
                          <select
                            {...register("senderRegion", { required: "Please select region" })}
                            onChange={(e) => setSelectedSenderRegion(e.target.value)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                          >
                            <option value="">Select Region</option>
                            {serviceData.map((r, idx) => (
                              <option key={idx} value={r.region}>{r.region}</option>
                            ))}
                          </select>
                          {errors.senderRegion && (
                            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                              ⚠️ {errors.senderRegion.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Service Center *
                          </label>
                          <select
                            {...register("senderServiceCenter", { required: "Please select service center" })}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            disabled={!selectedSenderRegion}
                          >
                            <option value="">Select Center</option>
                            {getCenters(selectedSenderRegion).map((center, idx) => (
                              <option key={idx} value={center}>{center}</option>
                            ))}
                          </select>
                          {errors.senderServiceCenter && (
                            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                              ⚠️ {errors.senderServiceCenter.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Pickup Address *
                        </label>
                        <textarea
                          {...register("senderAddress", { 
                            required: "Pickup address is required",
                            minLength: {
                              value: 10,
                              message: "Address should be more detailed"
                            }
                          })}
                          placeholder="Full pickup address with landmarks"
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                        />
                        {errors.senderAddress && (
                          <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            ⚠️ {errors.senderAddress.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Pickup Instructions
                          <span className="text-gray-500 font-normal ml-1">(Optional)</span>
                        </label>
                        <textarea
                          {...register("pickupInstruction")}
                          placeholder="Special instructions for pickup (e.g., call before coming, security gate code, etc.)"
                          rows="2"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Receiver Information */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <FaUser className="text-green-500" />
                      Receiver Information
                    </h2>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Full Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            {...register("receiverName", { 
                              required: "Receiver name is required",
                              minLength: {
                                value: 2,
                                message: "Name must be at least 2 characters"
                              }
                            })}
                            placeholder="Receiver's full name"
                            className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                          />
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        {errors.receiverName && (
                          <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            ⚠️ {errors.receiverName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            {...register("receiverContact", { 
                              required: "Phone number is required",
                              pattern: {
                                value: /^[0-9+-\s()]{10,}$/,
                                message: "Please enter a valid phone number"
                              }
                            })}
                            placeholder="Receiver's phone number"
                            className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                          />
                          <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        {errors.receiverContact && (
                          <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            ⚠️ {errors.receiverContact.message}
                          </p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Region *
                          </label>
                          <select
                            {...register("receiverRegion", { required: "Please select region" })}
                            onChange={(e) => setSelectedReceiverRegion(e.target.value)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                          >
                            <option value="">Select Region</option>
                            {serviceData.map((r, idx) => (
                              <option key={idx} value={r.region}>{r.region}</option>
                            ))}
                          </select>
                          {errors.receiverRegion && (
                            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                              ⚠️ {errors.receiverRegion.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Service Center *
                          </label>
                          <select
                            {...register("receiverServiceCenter", { required: "Please select service center" })}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                            disabled={!selectedReceiverRegion}
                          >
                            <option value="">Select Center</option>
                            {getCenters(selectedReceiverRegion).map((center, idx) => (
                              <option key={idx} value={center}>{center}</option>
                            ))}
                          </select>
                          {errors.receiverServiceCenter && (
                            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                              ⚠️ {errors.receiverServiceCenter.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Delivery Address *
                        </label>
                        <textarea
                          {...register("receiverAddress", { 
                            required: "Delivery address is required",
                            minLength: {
                              value: 10,
                              message: "Address should be more detailed"
                            }
                          })}
                          placeholder="Full delivery address with landmarks"
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors resize-none"
                        />
                        {errors.receiverAddress && (
                          <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            ⚠️ {errors.receiverAddress.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Delivery Instructions
                          <span className="text-gray-500 font-normal ml-1">(Optional)</span>
                        </label>
                        <textarea
                          {...register("deliveryInstruction")}
                          placeholder="Special instructions for delivery (e.g., safe place to leave, office hours, etc.)"
                          rows="2"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-lg transition-all duration-200 hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaShippingFast />
                        Schedule Delivery
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Cost Calculator Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaDollarSign className="text-green-500" />
                Cost Estimate
              </h3>
              
              <div className="space-y-4">
                {(!type || !zone) ? (
                  <div className="text-center py-8">
                    <FaInfoCircle className="text-gray-400 text-3xl mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      Fill in parcel type and delivery zone to see cost estimate
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Parcel Type:</span>
                        <span className="font-medium">
                          {type === 'document' ? 'Document' : 'Non-Document'}
                        </span>
                      </div>
                      
                      {type === 'non-document' && weight && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Weight:</span>
                          <span className="font-medium">{weight} kg</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery Zone:</span>
                        <span className="font-medium">
                          {zone === 'inside-dhaka' ? 'Inside Dhaka' : 
                           zone === 'outside-dhaka' ? 'Outside Dhaka' : 'Suburban Area'}
                        </span>
                      </div>
                      
                      {type === 'non-document' && parseFloat(weight) > 5 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Extra Charges:</span>
                          <span className="font-medium text-orange-600">40 Tk</span>
                        </div>
                      )}
                      
                      <hr className="my-2" />
                      
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-800">Total Estimate:</span>
                        <span className="text-green-600">{calculateCost()} Tk</span>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <div className="flex items-start gap-3">
                        <FaInfoCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-blue-800 font-medium">Cost Breakdown</p>
                          <p className="text-xs text-blue-600 mt-1">
                            Final cost may vary based on actual weight and additional services.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentParcel;