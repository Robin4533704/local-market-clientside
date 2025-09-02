import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/UseAxiosSecure";

const ParcelStatusForm = () => {
  const axiosSecure = useAxiosSecure();

  const [location, setLocation] = useState("");
  const [parcels, setParcels] = useState([]);
  const [parcelId, setParcelId] = useState("");
  const [status, setStatus] = useState("");

  // 🔹 যখন location change হবে তখন parcel লোড করবে
  useEffect(() => {
    if (location) {
      axiosSecure
        .get(`/parcels?location=${location}`)
        .then((res) => {
          setParcels(res.data || []);
        })
        .catch((err) => {
          console.error("Error fetching parcels:", err);
          setParcels([]);
        });
    }
  }, [location, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!parcelId || !status) {
      alert("Please select parcel and status");
      return;
    }

    try {
      await axiosSecure.patch(`/parcels/${parcelId}/status`, {
        delivery_status: status,
      });
      alert("Parcel status updated!");
      setParcelId("");
      setStatus("");
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded space-y-4">
      {/* Location select */}
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border p-2 rounded w-full"
        required
      >
        <option value="">Select Location</option>
        <option value="Dhaka">Dhaka</option>
        <option value="Rajshahi">Rajshahi</option>
        <option value="Chittagong">Chittagong</option>
        {/* চাইলে database থেকে location গুলো আনতে পারো */}
      </select>

      {/* Parcel dropdown */}
      <select
        value={parcelId}
        onChange={(e) => setParcelId(e.target.value)}
        className="border p-2 rounded w-full"
        required
      >
        <option value="">Select Parcel</option>
        {parcels.map((parcel) => (
          <option key={parcel._id} value={parcel._id}>
            {parcel.tracking_id} - {parcel.title}
          </option>
        ))}
      </select>

      {/* Status select */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 rounded w-full"
        required
      >
        <option value="">Select Status</option>
        <option value="pending">Pending</option>
        <option value="in-transit">In Transit</option>
        <option value="delivered">Delivered</option>
      </select>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Update Status
      </button>
    </form>
  );
};

export default ParcelStatusForm;
