import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/UseAxiosSecure";

const PendingDeliveries = ({ riderId }) => {
  const axiosSecure = useAxiosSecure();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pending / in-transit parcels for rider
  const fetchParcels = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/riders/${riderId}/pending-deliveries`);
      setParcels(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, [riderId]);

  // Update parcel status
  const updateParcelStatus = async (parcelId, newStatus) => {
    try {
      await axiosSecure.patch(`/parcels/${parcelId}/status`, {
        delivery_status: newStatus,
      });

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Parcel marked as ${newStatus}`,
        confirmButtonColor: "#3085d6",
      });

      // Update local state
      setParcels((prev) =>
        prev.map((p) =>
          p._id === parcelId ? { ...p, delivery_status: newStatus } : p
        )
      );
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || err.message,
        confirmButtonColor: "#d33",
      });
    }
  };

  if (loading) return <p className="text-center">Loading pending deliveries...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center md:text-left">
        Pending Deliveries
      </h2>

      {parcels.length === 0 ? (
        <p className="text-center text-gray-600">No pending deliveries.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm md:text-base">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 border">Parcel ID</th>
                <th className="p-2 border">Receiver</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Payment</th>
                <th className="p-2 border">Cost</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id} className="text-center hover:bg-gray-50 transition">
                  <td className="p-2 border">{parcel._id}</td>
                  <td className="p-2 border">{parcel.receiverName}</td>
                  <td className="p-2 border">{parcel.receiverAddress}</td>
                  <td className="p-2 border">{parcel.payment_status}</td>
                  <td className="p-2 border">{parcel.cost}</td>
                  <td className="p-2 border">{parcel.delivery_status}</td>
                  <td className="p-2 border">
                    {parcel.delivery_status === "rider_assigned" && (
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => updateParcelStatus(parcel._id, "in-transit")}
                      >
                        Mark as Picked Up
                      </button>
                    )}
                    {parcel.delivery_status === "in-transit" && (
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={() => updateParcelStatus(parcel._id, "delivered")}
                      >
                        Mark as Delivered
                      </button>
                    )}
                    {parcel.delivery_status === "delivered" && <span>✅ Delivered</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingDeliveries;
