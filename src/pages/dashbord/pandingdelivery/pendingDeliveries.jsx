import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UseAuth from "../../../hooks/UseAuth";
import useAxios from "../../../hooks/useAxios";

const PendingDeliveries = ({ riderEmail }) => {
  const { user } = UseAuth();
  const axiosInstance = useAxios(); // ✅ use single axios instance

  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchParcels = async () => {
    if (!user?.email && !riderEmail) return; // wait for user ready
    setLoading(true);

    const emailToUse = riderEmail || user?.email;
    console.log("Fetching parcels for:", emailToUse);

    try {
      const res = await axiosInstance.get("/riders/parcels", {
        params: { email: emailToUse },
      });
      console.log("Fetched parcels:", res.data);
      setParcels(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch parcels error:", err);
      Swal.fire("Error", "Failed to fetch parcels", "error");
      setParcels([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (parcelId, newStatus) => {
    if (!parcelId || !newStatus) return;

    try {
      const res = await axiosInstance.patch(`/parcels/${parcelId}/status`, {
        delivery_status: newStatus,
      });

      if (res.status === 200) {
        Swal.fire("Success", `Parcel status updated to ${newStatus}`, "success");
        fetchParcels(); // refresh list
      } else {
        Swal.fire("Error", "Failed to update status", "error");
      }
    } catch (err) {
      console.error("Update status error:", err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  useEffect(() => {
    if (user?.email || riderEmail) fetchParcels();
  }, [riderEmail, user?.email]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!parcels.length) return <div className="p-4 text-center">No pending deliveries</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pending Deliveries</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Tracking ID</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Receiver</th>
            <th className="border px-4 py-2">Receiver Center</th>
            <th className="border px-4 py-2">Cost</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((parcel) => {
            const parcelId = parcel._id;
            const status = parcel.delivery_status?.trim().toLowerCase();

            return (
              <tr key={parcelId} className="text-center">
                <td className="border px-4 py-2">{parcel.tracking_id}</td>
                <td className="border px-4 py-2">{parcel.title}</td>
                <td className="border px-4 py-2">{parcel.receiverName}</td>
                <td className="border px-4 py-2">{parcel.receiverServiceCenter}</td>
                <td className="border px-4 py-2">{parcel.cost} BDT</td>
                <td className="border px-4 py-2 capitalize">{status?.replace("_", " ")}</td>
                <td className="border px-4 py-2 space-x-2">
                  {status === "rider_assigned" && (
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => updateStatus(parcelId, "in-transit")}
                    >
                      Mark Picked Up
                    </button>
                  )}
                  {status === "in-transit" && (
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => updateStatus(parcelId, "delivered")}
                    >
                      Mark Delivered
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PendingDeliveries;
