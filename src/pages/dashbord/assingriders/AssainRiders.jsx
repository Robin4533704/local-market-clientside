import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/UseAxiosSecure";

ReactModal.setAppElement("#root"); // accessibility

const AssignRider = () => {
  const [parcels, setParcels] = useState([]);
  const [riders, setRiders] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingRiders, setLoadingRiders] = useState(false);

  const axiosSecure = useAxiosSecure();

  // Load parcels: paid & not_collected
  useEffect(() => {
    axiosSecure
      .get("/parcels?payment_status=paid&delivery_status=not_collected")
      .then((res) => setParcels(res.data))
      .catch((err) => {
        console.error("Fetch parcels error:", err);
        Swal.fire("Error", "Failed to load parcels", "error");
      });
  }, [axiosSecure]);

  // Load riders when a parcel is selected
  useEffect(() => {
    if (selectedParcel?.senderRegion) {
      setLoadingRiders(true);
      axiosSecure
        .get(`/riders/available?district=${selectedParcel.senderRegion}`)
        .then((res) => {
          setRiders(res.data);
        })
        .catch((err) => {
          console.error("Fetch riders error:", err);
          Swal.fire("Error", "Failed to load riders", "error");
          setRiders([]);
        })
        .finally(() => setLoadingRiders(false));
    }
  }, [selectedParcel, axiosSecure]);

  const handleAssignClick = (parcel) => {
    setSelectedParcel(parcel);
    setModalOpen(true);
  };

  const assignRider = (rider) => {
    if (!selectedParcel) return;

    const parcelId = selectedParcel._id;

    axiosSecure
      .patch(`/parcels/${parcelId}/assign-rider`, {
        riderId: rider._id,
        riderName: rider.name,
        riderEmail: rider.email,
      })
      .then(() => {
        Swal.fire("Success!", "Rider assigned successfully!", "success");
        setModalOpen(false);
        setSelectedParcel(null);

        // Remove assigned parcel from table
        setParcels((prev) => prev.filter((p) => p._id !== parcelId));
      })
      .catch((err) => {
        console.error("Assign rider error:", err);
        Swal.fire("Error!", "Failed to assign rider.", "error");
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Assign Riders</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Tracking ID</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Sender</th>
            <th className="p-2 border">Receiver</th>
            <th className="p-2 border">Region</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {parcels.length > 0 ? (
            parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td className="p-2 border">{parcel.tracking_id}</td>
                <td className="p-2 border">{parcel.title}</td>
                <td className="p-2 border">{parcel.senderName}</td>
                <td className="p-2 border">{parcel.receiverName}</td>
                <td className="p-2 border">{parcel.senderRegion}</td>
                <td className="p-2 border">
                  <button
                    className="bg-lime-400 hover:bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => handleAssignClick(parcel)}
                  >
                    Assign Rider
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4">
                No parcels to assign
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      <ReactModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="bg-gray-900 text-white p-6 rounded shadow-lg max-w-3xl mx-auto relative max-h-[80vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <button
          onClick={() => setModalOpen(false)}
          className="absolute top-3 right-3 text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          ✕ Close
        </button>

        {selectedParcel ? (
          <>
            <h3 className="text-lg font-bold mb-4">
              Assign Rider for Parcel:{" "}
              <span className="text-lime-300">{selectedParcel.title}</span>
            </h3>

            {loadingRiders ? (
              <p>Loading riders...</p>
            ) : riders.length > 0 ? (
              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Phone</th>
                    <th className="p-2 border">Bike Info</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {riders.map((rider) => (
                    <tr key={rider._id}>
                      <td className="p-2 border">{rider.name}</td>
                      <td className="p-2 border">{rider.phone}</td>
                      <td className="p-2 border">
                        {rider.bikeBrand} - {rider.bikeRegNumber}
                      </td>
                      <td className="p-2 border text-center">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                          onClick={() => assignRider(rider)}
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mt-4">No riders available in this region.</p>
            )}
          </>
        ) : (
          <p>Loading parcel details...</p>
        )}
      </ReactModal>
    </div>
  );
};

export default AssignRider;
