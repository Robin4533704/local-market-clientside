import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../hooks/UseAuth";
import UseAxiosSecure from "../../hooks/UseAxiosSecure";
import { useLoaderData, useNavigate } from "react-router";

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

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const type = watch("type");

  const [selectedSenderRegion, setSelectedSenderRegion] = useState("");
  const [selectedReceiverRegion, setSelectedReceiverRegion] = useState("");

  const getCenters = (region) => {
    const found = serviceData.find(r => r.region === region);
    return found ? found.centers : [];
  };

  const onSubmit = (data) => {
    const { type, weight = 0, zone } = data;
    const parsedWeight = parseFloat(weight) || 0;

    let baseCost = type === "document" ? 50 : 100;
    let weightCost = type === "non-document" ? parsedWeight * 20 : 0;
    let zoneCharge = zone === "inside-dhaka" ? 20 : zone === "outside-dhaka" ? 50 : 30;
    let extraCharges = parsedWeight > 5 ? 40 : 0;
    const totalCost = baseCost + weightCost + zoneCharge + extraCharges;

   Swal.fire({
      title: "🚚 Delivery Cost Breakdown",
     
    }).then((result) => {
      if (result.isConfirmed) {
        const trackingId = generateTrackingId();
        const parcelData = {
          ...data,
          cost: totalCost,
          created_by: user?.email,
          payment_status: "unpaid",
          delivery_status: "not_collected",
          creation_date: new Date().toISOString(),
          tracking_id: trackingId
        };

        axiosSecure.post('/parcels', parcelData)
          .then(res => {
            if(res.data.insertedId){
              // Success Toast / Swal
              Swal.fire({
                icon: "success",
                title: "Parcel saved!",
                text: "Redirecting to payment...",
                timer: 2000,
                showConfirmButton: false
              }).then(() => {
                // Navigate to payment page
                navigate(`/dashboard/myparcels`);
              });
            }
          })
          .catch(err => {
            console.error(err);
            Swal.fire("Error", "Parcel save failed.", "error");
          });
      }
    });
  };


  return (
    <div className="pt-28 max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold text-center text-lime-700 mb-6">📦 Send Parcel Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Parcel Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-4 md:col-span-2">
            <input type="text" {...register("title", { required: true })} placeholder="Parcel Name" className="input input-bordered w-full"/>
            <div className="flex gap-6">
              <label><input type="radio" value="document" {...register("type", { required: true })}/> Document</label>
              <label><input type="radio" value="non-document" {...register("type", { required: true })}/> Non-Document</label>
            </div>
          </div>
          {type === "non-document" && (
            <div>
              <input type="number" step="0.1" {...register("weight", { required: true })} placeholder="Weight (kg)" className="input input-bordered w-full"/>
            </div>
          )}
        </div>

        {/* Sender & Receiver */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Sender */}
          <fieldset className="border p-4 rounded-lg border-blue-500">
            <legend className="text-lg font-bold text-blue-700">Sender Info</legend>
            <input type="text" {...register("senderName", { required: true })} placeholder="Sender Name" className="input input-bordered w-full mt-2"/>
            <input type="tel" {...register("senderContact", { required: true })} placeholder="Sender Phone" className="input input-bordered w-full"/>
            <select {...register("senderRegion", { required: true })} onChange={(e) => setSelectedSenderRegion(e.target.value)} className="select select-bordered w-full mt-2">
              <option value="">Select Region</option>
              {serviceData.map((r, idx) => <option key={idx} value={r.region}>{r.region}</option>)}
            </select>
            <select {...register("senderServiceCenter", { required: true })} className="select select-bordered w-full mt-2">
              <option value="">Select Center</option>
              {getCenters(selectedSenderRegion).map((center, idx) => <option key={idx} value={center}>{center}</option>)}
            </select>
            <textarea {...register("senderAddress", { required: true })} placeholder="Pickup Address" className="textarea textarea-bordered w-full"/>
            <textarea {...register("pickupInstruction")} placeholder="Pickup Instruction" className="textarea textarea-bordered w-full"/>
          </fieldset>

          {/* Receiver */}
          <fieldset className="border p-4 rounded-lg border-green-500">
            <legend className="text-lg font-bold text-green-700">Receiver Info</legend>
            <input type="text" {...register("receiverName", { required: true })} placeholder="Receiver Name" className="input input-bordered w-full mt-2"/>
            <input type="tel" {...register("receiverContact", { required: true })} placeholder="Receiver Phone" className="input input-bordered w-full"/>
            <select {...register("receiverRegion", { required: true })} onChange={(e) => setSelectedReceiverRegion(e.target.value)} className="select select-bordered w-full mt-2">
              <option value="">Select Region</option>
              {serviceData.map((r, idx) => <option key={idx} value={r.region}>{r.region}</option>)}
            </select>
            <select {...register("receiverServiceCenter", { required: true })} className="select select-bordered w-full mt-2">
              <option value="">Select Center</option>
              {getCenters(selectedReceiverRegion).map((center, idx) => <option key={idx} value={center}>{center}</option>)}
            </select>
            <textarea {...register("receiverAddress", { required: true })} placeholder="Delivery Address" className="textarea textarea-bordered w-full"/>
            <textarea {...register("deliveryInstruction")} placeholder="Delivery Instruction" className="textarea textarea-bordered w-full"/>
          </fieldset>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button type="submit" className="bg-gradient-to-r from-lime-400 to-green-400 text-white px-10 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SentParcel;
