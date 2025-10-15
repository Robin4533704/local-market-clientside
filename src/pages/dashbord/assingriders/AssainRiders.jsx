import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/UseAxiosSecure";


ReactModal.setAppElement("#root");

const AssignRider = () => {
  const [parcels, setParcels] = useState([]);
  const [riders, setRiders] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingRiders, setLoadingRiders] = useState(false);

  const axiosSecure = useAxiosSecure();

  // Load parcels
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
    if (!selectedParcel?.receiverServiceCenter) return;

    setLoadingRiders(true);
    const district = selectedParcel.receiverServiceCenter.trim().split(" ")[0];
    console.log("District used for rider fetch:", district);

    axiosSecure
      .get(`/riders/available?district=${district}`)
      .then((res) => {
        console.log("Fetched riders:", res.data);
        // Check backend response structure
        setRiders(res.data?.riders || res.data || []);
      })
      .catch((err) => {
        console.error("Fetch riders error:", err);
        Swal.fire("Error", "Failed to load riders", "error");
        setRiders([]);
      })
      .finally(() => setLoadingRiders(false));
  }, [selectedParcel, axiosSecure]);

  // When clicking "Assign Rider" button
  const handleAssignClick = (parcel) => {
    console.log("Parcel selected:", parcel);
    setSelectedParcel(parcel);
    setModalOpen(true);
  };

  // Assign rider mutation
  const assignRider = async (rider) => {
    console.log("Assign button clicked for rider:", rider);
    console.log("Selected parcel:", selectedParcel);

    if (!selectedParcel) return;

    const parcelId = selectedParcel._id;

    try {
      console.log("Sending PATCH request...");
      const response = await axiosSecure.patch(`/parcels/${parcelId}/assign-rider`, {
        riderId: rider._id,
        riderName: rider.name,
        riderEmail: rider.email,
      });

      console.log("PATCH response:", response);
      Swal.fire("Success!", "Rider assigned successfully!", "success");

      // Update state locally
      setParcels((prev) => prev.filter((p) => p._id !== parcelId));
      setSelectedParcel(null);
      setRiders([]);
      setModalOpen(false);
    } catch (err) {
      console.error("Assign rider error:", err);
      if (err.response) console.error("Server responded with:", err.response.data);
      Swal.fire("Error!", "Failed to assign rider.", "error");
    }
  };

  return (
    <div className="sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Assign Riders</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-sm sm:text-base">
              <th className="p-2 border">Tracking ID</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border hidden sm:table-cell">Sender</th>
              <th className="p-2 border hidden sm:table-cell">Receiver</th>
              <th className="p-2 border hidden md:table-cell">Service Center</th>
              <th className="p-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.length > 0 ? (
              parcels.map((parcel) => (
                <tr key={parcel._id} className="hover:bg-gray-100 text-sm sm:text-base">
                  <td className="p-2 border">{parcel.tracking_id}</td>
                  <td className="p-2 border">{parcel.title}</td>
                  <td className="p-2 border hidden sm:table-cell">{parcel.senderName}</td>
                  <td className="p-2 border hidden sm:table-cell">{parcel.receiverName}</td>
                  <td className="p-2 border hidden md:table-cell">{parcel.receiverServiceCenter}</td>
                  <td className="p-2 border text-center">
                    <button
                      className="bg-lime-400 hover:bg-green-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm"
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
      </div>

      {/* Rider Assignment Modal */}
      <ReactModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="bg-gray-900 text-white p-4 sm:p-6 rounded shadow-lg max-w-md sm:max-w-lg md:max-w-xl mx-auto relative max-h-[90vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2"
      >
        <button
          onClick={() => setModalOpen(false)}
          className="absolute top-3 right-3 text-white bg-red-500 px-2 sm:px-3 py-1 rounded hover:bg-red-600 text-sm sm:text-base"
        >
          ✕ Close
        </button>

        {selectedParcel ? (
          <>
            <h3 className="text-lg sm:text-xl font-bold mb-4">
              Assign Rider for Parcel: <span className="text-lime-300">{selectedParcel.title}</span>
            </h3>

            {loadingRiders ? (
              <p>Loading riders...</p>
            ) : riders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-400 text-sm sm:text-base">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Phone</th>
                      <th className="p-2 border hidden sm:table-cell">Bike Info</th>
                      <th className="p-2 border text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riders.map((rider) => (
                      <tr key={rider._id} className="hover:bg-gray-700">
                        <td className="p-2 border">{rider.name}</td>
                        <td className="p-2 border">{rider.phone}</td>
                        <td className="p-2 border hidden sm:table-cell">
                          {rider.bikeBrand} - {rider.bikeRegNumber}
                        </td>
                        <td className="p-2 border text-center">
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm"
                            onClick={() => assignRider(rider)}
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-4">No riders available in this district.</p>
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
