import React, { useState } from "react";
import { useForm } from "react-hook-form";
import  { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import useAuth from "../../hooks/UseAuth"
import UseAxiosSecure from "../../hooks/UseAxiosSecure";
import axios from "axios";
const generateTrackingId = () => {
  const date = new Date();
  const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
 const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PCL-${datePart}-${rand}`
}

const serviceData = [
  { region: "Dhaka", centers: ["Uttara", "Banani", "Dhanmondi", "Mirpur"] },
  { region: "Chattogram", centers: ["Pahartali", "GEC", "Agrabad"] },
  { region: "Rajshahi", centers: ["Boalia", "Rajpara"] },
  { region: "Khulna", centers: ["Sonadanga", "Rupsha"] },
  { region: "Sylhet", centers: ["Jalalabad", "Zindabazar"] },
  { region: "Barisal", centers: ["Kakrail", "Chowmuhani"] },
  { region: "Rangpur", centers: ["Rangpur Sadar", "Gangachara"] },
  { region: "Mymensingh", centers: ["Trishal", "Muktagacha"] }
];

const SentParcel = () => {
  const {user} = useAuth();
  const axiosSecure = UseAxiosSecure()
  const { 
    register,
   handleSubmit, 
    watch,
   formState: { errors } } 
   = useForm();
const [selectedSenderRegion, setSenderRegion] = useState("");
  const [selectedReceiverRegion, setReceiverRegion] = useState("");
  const type = watch("type");
const onSubmit = (data) => {
  const { type, weight = 0, zone } = data;
  const parsedWeight = parseFloat(weight) || 0;

  let baseCost = 0;
  let weightCost = 0;
  let zoneCharge = 0;
  let extraCharges = 0;

  let parcelTypeText = "";
  let zoneText = "";
  let extraText = "";

  // Determine Parcel Type
  if (type === "document") {
    baseCost = 50;
    parcelTypeText = "📄 Document";
  } else if (type === "non-document") {
    baseCost = 100;
    weightCost = parsedWeight * 20;
    parcelTypeText = "📦 Non-Document";
  }

  // Zone Charge
  if (zone === "inside-dhaka") {
    zoneCharge = 20;
    zoneText = "📍 Inside Dhaka (৳20)";
  } else if (zone === "outside-dhaka") {
    zoneCharge = 50;
    zoneText = "📍 Outside Dhaka (৳50)";
  } else {
    zoneCharge = 30; // default zone
    zoneText = "📍 Standard Zone (৳30)";
  }

  // Extra Charges
  if (parsedWeight > 5) {
    extraCharges = 40; // overweight
    extraText = "🔺 Overweight Charge (৳40)";
  }

  const totalCost = baseCost + weightCost + zoneCharge + extraCharges;

  // SHOW SWEETALERT
  Swal.fire({
    title: "🚚 Delivery Cost Breakdown",
    html: `
      <div class="text-left text-sm leading-relaxed font-sans">
        <p class="mb-2"><strong>Parcel Type:</strong> ${parcelTypeText}</p>
        <p class="mb-2"><strong>Product Weight:</strong> ${parsedWeight} kg</p>
        <p class="mb-2"><strong>Delivery Zone:</strong> ${zoneText}</p>
        <hr class="my-2 border-gray-300" />
        <ul class="list-disc list-inside mb-2">
          <li>Base Cost: <span class="text-gray-700">৳${baseCost}</span></li>
          ${type === "non-document" ? `<li>Weight Charge (${parsedWeight} × 20): <span class="text-gray-700">৳${weightCost.toFixed(2)}</span></li>` : ""}
          <li>Zone Charge: <span class="text-gray-700">৳${zoneCharge}</span></li>
          ${extraCharges > 0 ? `<li>${extraText}</li>` : ""}
        </ul>
        <hr class="my-3 border-gray-300" />
        <div class="text-xl font-bold text-green-600 mb-2">Total: ৳${totalCost.toFixed(2)}</div>
        <p class="mt-2 text-xs text-gray-500">Please review before proceeding.</p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "✅ Proceed to Payment",
    cancelButtonText: "✏️ Edit Info",
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#d33",
    // এখানে লোকোল মার্কেটের ইমেজ দিয়ে ব্যাকগ্রাউন্ড সেট করুন
    backdrop: `
      rgba(0, 0, 0, 0.4)
      url("https://images.unsplash.com/photo-1589470288084-ecad61835772?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG9jYWwlMjBtYXJrZXR8ZW58MHx8MHx8fDA%3D") no-repeat center/cover
    `,
    allowOutsideClick: false,
    customClass: {
      popup: 'rounded-lg shadow-lg p-4',
      header: 'font-bold text-xl text-center mb-2',
      confirmButton: 'bg-green-600 hover:bg-green-700 font-semibold py-2 px-4 rounded',
      cancelButton: 'bg-red-600 hover:bg-red-700 font-semibold py-2 px-4 rounded',
    },
  }).then((result) => {
  if (result.isConfirmed) {
    const trackingId = generateTrackingId(); // ✅ আলাদা করে রাখো

    const parcelData = {
      ...data,
      cost: totalCost,
      created_by: user?.email,
      payment_status: "unpaid",
      delivery_status: "not_collected",
      creation_date: new Date().toISOString(),
      tracking_id: trackingId, // ✅ এখানে ব্যবহার করো
    };

    axios.post("http://localhost:5000/parcels", parcelData);
      console.log("Confirmed Parcel Data:", parcelData);
    axiosSecure.post('/parcels', parcelData).then((res) => {
      if(res.data.insertedId){
         Swal.fire({
        icon: "success",
        title: "অভিনন্দন!",
        text: "পেমেন্টের জন্য রিডিরেক্ট হচ্ছে...",
        confirmButtonText: "ঠিক আছে",
        customClass: {
          popup: 'rounded-lg shadow-lg p-4',
        },
      });
    } else {
      console.log("📝 User chose to edit.");
      }
      })
      .catch((err) => {
        console.error(err);
        Swal.error("🚨 Failed to submit parcel.");
      });
  }
});

    


  //   save data sarver
  
   
     
 
}
const getCenters = (region) => {
    const found = serviceData.find(r => r.region === region);
    return found ? found.centers : [];
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl my-10">
    
      <h2 className="text-3xl font-bold text-center text-lime-700 mb-6">📦 Send Parcel Form</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Parcel Info Section */}
      <div className="grid md:grid-cols-3 gap-4 mt-4">
  <div className="flex flex-col space-y-4 md:col-span-2">
    <div className="flex flex-col">
      <label className="mb-1 font-semibold text-sm text-gray-700">Parcel Name</label>
      <input
        type="text"
        {...register("title", { required: true })}
        placeholder="Describe your parcel"
        className="input input-bordered w-full"
      />
    </div>

    <div className="flex flex-col">
      <label className="mb-1 font-semibold text-sm text-gray-700">Parcel Type</label>
      <div className="flex space-x-6">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="document"
            {...register("type", { required: true })}
            className="radio radio-primary"
          />
          <span>Document</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="non-document"
            {...register("type", { required: true })}
            className="radio radio-primary"
          />
          <span>Non-Document</span>
        </label>
      </div>
    </div>
  </div>

  {type === 'non-document' && (
    <div className="flex flex-col">
      <label className="mb-1 font-semibold text-sm text-gray-700">Weight (kg)</label>
      <input
        type="number"
        step="0.1"
        {...register("weight", { required: true })}
        placeholder="Weight (kg)"
        className="input input-bordered w-full"
      />
    </div>
  )}
</div>

        {/* Sender & Receiver Info */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Sender Info */}
          <fieldset className="border p-4 rounded-lg border-blue-500">
            <legend className="text-lg font-bold text-blue-700">2. Sender Info</legend>
            <div className="flex flex-col space-y-4 mt-4">
              <input type="text" {...register("senderName", { required: true })} placeholder="Sender Name" className="input input-bordered w-full" />
              <input type="tel" {...register("senderContact", { required: true })} placeholder="Sender Phone" className="input input-bordered w-full" />
              <select {...register("senderRegion", { required: true })} onChange={e => setSenderRegion(e.target.value)} className="select select-bordered w-full">
                <option value="">Select Region</option>
                {serviceData.map((region, idx) => (
                  <option key={idx} value={region.region}>{region.region}</option>
                ))}
              </select>
              <select {...register("senderServiceCenter", { required: true })} className="select select-bordered w-full">
                <option value="">Select Service Center</option>
                {getCenters(selectedSenderRegion).map((center, idx) => (
                  <option key={idx} value={center}>{center}</option>
                ))}
              </select>
              <textarea {...register("senderAddress", { required: true })} placeholder="Pickup Address" className="textarea textarea-bordered w-full" />
              <textarea {...register("pickupInstruction", { required: true })} placeholder="Pickup Instruction" className="textarea textarea-bordered w-full" />
            </div>
          </fieldset>

          {/* Receiver Info */}
          <fieldset className="border p-4 rounded-lg border-green-500">
            <legend className="text-lg font-bold text-green-700">3. Receiver Info</legend>
            <div className="flex flex-col space-y-4 mt-4">
              <input type="text" {...register("receiverName", { required: true })} placeholder="Receiver Name" className="input input-bordered w-full" />
              <input type="tel" {...register("receiverContact", { required: true })} placeholder="Receiver Phone" className="input input-bordered w-full" />
              <select {...register("receiverRegion", { required: true })} onChange={e => setReceiverRegion(e.target.value)} className="select select-bordered w-full">
                <option value="">Select Region</option>
                {serviceData.map((region, idx) => (
                  <option key={idx} value={region.region}>{region.region}</option>
                ))}
              </select>
              <select {...register("receiverServiceCenter", { required: true })} className="select select-bordered w-full">
                <option value="">Select Service Center</option>
                {getCenters(selectedReceiverRegion).map((center, idx) => (
                  <option key={idx} value={center}>{center}</option>
                ))}
              </select>
              <textarea {...register("receiverAddress", { required: true })} placeholder="Delivery Address" className="textarea textarea-bordered w-full" />
              <textarea {...register("deliveryInstruction", { required: true })} placeholder="Delivery Instruction" className="textarea textarea-bordered w-full" />
            </div>
          </fieldset>
        </div>

        {/* Submit Button */}
       <div className="text-center">
  <button
    type="submit"
    className="bg-gradient-to-r from-lime-400 to-green-400 text-white px-10 py-3 rounded-full shadow-lg hover:scale-105 transform transition duration-300"
  >
    Submit
  </button>
</div>
      </form>
    </div>
  );
};

export default SentParcel;
