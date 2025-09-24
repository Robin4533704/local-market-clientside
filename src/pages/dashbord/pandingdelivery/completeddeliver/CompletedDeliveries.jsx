import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/UseAxiosSecure";
import UseAuth from "../../../../hooks/UseAuth";

const CompletedDeliveries = ({ riderEmail }) => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth(); // ✅ destructure user

  const fetchCompletedParcels = async () => {
    setLoading(true);
    const emailToUse = riderEmail || user?.email;
    if (!emailToUse) {
      Swal.fire("Error", "Rider email missing", "error");
      setLoading(false);
      return;
    }

    try {
      const res = await axiosSecure.get("/riders/completed-parcels", {
        params: { email: emailToUse },
      });
      setParcels(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch completed parcels error:", err);
      Swal.fire("Error", "Failed to fetch completed parcels", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedParcels();
  }, [riderEmail, user?.email]);

  const cashOutParcel = async (parcelId) => {
    if (!parcelId) return;
    try {
      const res = await axiosSecure.patch(`/riders/cashout/${parcelId}`);
      if (res.status === 200) {
        Swal.fire("Success", "Cashed out successfully", "success");
        fetchCompletedParcels();
      } else {
        Swal.fire("Error", res.data.message || "Cash out failed", "error");
      }
    } catch (err) {
      console.error("Cash out error:", err);
      Swal.fire("Error", "Failed to cash out", "error");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Completed Deliveries</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Tracking ID</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Receiver</th>
            <th className="border px-4 py-2">Cost</th>
            <th className="border px-4 py-2">Earning</th>
            <th className="border px-4 py-2">Cashed Out</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((parcel) => {
            const parcelId = parcel._id?.$oid || parcel._id;
            return (
              <tr key={parcelId} className="text-center">
                <td className="border px-4 py-2">{parcel.tracking_id}</td>
                <td className="border px-4 py-2">{parcel.title}</td>
                <td className="border px-4 py-2">{parcel.receiverName}</td>
                <td className="border px-4 py-2">{parcel.cost} BDT</td>
                <td className="border px-4 py-2">{parcel.earning?.toFixed(2)} BDT</td>
                <td className="border px-4 py-2">{parcel.cashedOut ? "Yes" : "No"}</td>
                <td className="border px-4 py-2">
                  {!parcel.cashedOut && (
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => cashOutParcel(parcelId)}
                    >
                      Cash Out
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
          {parcels.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No completed deliveries found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompletedDeliveries;
