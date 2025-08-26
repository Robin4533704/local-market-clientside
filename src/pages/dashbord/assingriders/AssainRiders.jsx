import React, { useEffect, useState } from "react";
import { FaMotorcycle } from "react-icons/fa";
import ReactModal from "react-modal";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/UseAxiosSecure";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();

  const [parcels, setParcels] = useState([]);
  const [loadingParcels, setLoadingParcels] = useState(true);
  const [errorParcels, setErrorParcels] = useState(null);

  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);
  const [errorRiders, setErrorRiders] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);

  // Fetch parcels
  const fetchParcels = async () => {
    try {
      setLoadingParcels(true);
      const res = await axiosSecure.get(
        "/parcels?payment_status=paid&delivery_status=not_collected"
      );
      setParcels(res.data);
      setErrorParcels(null);
    } catch (err) {
      setErrorParcels(err.response?.data?.message || err.message);
    } finally {
      setLoadingParcels(false);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, [axiosSecure]);

  // Fetch riders based on selected parcel
  useEffect(() => {
    if (!selectedParcel) return;

    const fetchRiders = async () => {
      setLoadingRiders(true);
      try {
        const district =
          selectedParcel.service_center ||
          selectedParcel.district ||
          selectedParcel.serviceCenter ||
          "";

        if (!district) {
          setRiders([]);
          setErrorRiders("Parcel has no service center/district assigned");
          setLoadingRiders(false);
          return;
        }

        console.log("Fetching riders for district:", district);

        const res = await axiosSecure.get(
          `/riders?status=available&district=${encodeURIComponent(
            district.trim()
          )}`
        );

        console.log("Riders fetched:", res.data);
        setRiders(res.data);
        setErrorRiders(null);
      } catch (err) {
        console.error("Error fetching riders:", err);
        setErrorRiders(err.response?.data?.message || err.message);
      } finally {
        setLoadingRiders(false);
      }
    };

    fetchRiders();
  }, [axiosSecure, selectedParcel]);

  // Assign rider to parcel
  const handleRiderSelect = async (rider) => {
    try {
      await axiosSecure.patch(`/parcels/${selectedParcel._id}/assign`, {
        riderId: rider._id,
        riderEmail: rider.email,
        riderName: rider.name,
      });

      Swal.fire({
        icon: "success",
        title: "Rider Assigned!",
        text: `Rider ${rider.name} assigned to parcel ${selectedParcel._id}`,
        confirmButtonColor: "#3085d6",
      });

      setParcels((prev) =>
        prev.map((p) =>
          p._id === selectedParcel._id
            ? { ...p, delivery_status: "in-transit", assigned_rider: rider.name }
            : p
        )
      );

      setIsModalOpen(false);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        text: err.response?.data?.message || err.message,
        confirmButtonColor: "#d33",
      });
    }
  };

  // Make rider available
  const makeRiderAvailable = async (riderId) => {
    try {
      const res = await axiosSecure.patch(`/riders/${riderId}/available`);

      Swal.fire({
        icon: "success",
        title: "Rider Available!",
        text: res.data.message,
        confirmButtonColor: "#3085d6",
      });

      // Refresh riders list after making available
      const district =
        selectedParcel.service_center ||
        selectedParcel.district ||
        selectedParcel.serviceCenter ||
        "";
      const updated = await axiosSecure.get(
        `/riders?status=available&district=${encodeURIComponent(district.trim())}`
      );
      setRiders(updated.data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || err.message,
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleAssignClick = (parcel) => {
    setSelectedParcel(parcel);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center md:text-left">
        Assign Rider to Parcels
      </h2>

      {/* Parcels Table */}
      {loadingParcels ? (
        <p className="text-center">Loading parcels...</p>
      ) : errorParcels ? (
        <p className="text-red-500 text-center">{errorParcels}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm md:text-base">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 border">Parcel ID</th>
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Payment</th>
                <th className="p-2 border">৳</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Rider</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.length > 0 ? (
                parcels.map((parcel) => (
                  <tr
                    key={parcel._id}
                    className="text-center hover:bg-gray-50 transition"
                  >
                    <td className="p-2 border">{parcel._id}</td>
                    <td className="p-2 border">{parcel.receiverName}</td>
                    <td className="p-2 border">{parcel.receiverAddress}</td>
                    <td className="p-2 border">{parcel.payment_status}</td>
                    <td className="p-2 border">{parcel.cost}</td>
                    <td className="p-2 border">{parcel.delivery_status}</td>
                    <td className="p-2 border">{parcel.assigned_rider || "-"}</td>
                    <td className="p-2 border">
                      <button
                        className="px-4 py-2 bg-gradient-to-r from-lime-400 to-green-500 text-white rounded-lg shadow hover:from-lime-500 hover:to-green-600 flex items-center gap-2"
                        onClick={() => handleAssignClick(parcel)}
                      >
                        <FaMotorcycle />
                        Assign
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-600">
                    No parcels found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Rider selection */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        ariaHideApp={false}
        className="w-[95%] md:w-[600px] p-4 bg-white rounded-lg shadow-lg mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        {selectedParcel && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Select Rider for Parcel <span className="text-green-600">{selectedParcel._id}</span>
            </h2>

            {loadingRiders ? (
              <p className="text-center">Loading riders...</p>
            ) : errorRiders ? (
              <p className="text-red-500 text-center">{errorRiders}</p>
            ) : riders.length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {riders.map((rider) => (
                  <li key={rider._id} className="flex justify-between items-center">
                    <span>
                      {rider.name} <span className="text-sm">({rider.district})</span>
                    </span>
                    {rider.status !== "available" ? (
                      <button
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                        onClick={() => makeRiderAvailable(rider._id)}
                      >
                        Make Available
                      </button>
                    ) : (
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => handleRiderSelect(rider)}
                      >
                        Assign Riders
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center">No riders available for this district.</p>
            )}

            <button
              className="mt-4 w-full py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </>
        )}
      </ReactModal>
    </div>
  );
};

export default AssignRider;
