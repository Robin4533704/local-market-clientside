import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/UseAxiosSecure";
import { FaMotorcycle, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser, FaSearch, FaTimes, FaShippingFast } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
ReactModal.setAppElement("#root");

const AssignRider = () => {
   const [parcels, setParcels] = useState([]);
  const [riders, setRiders] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingRiders, setLoadingRiders] = useState(false);
  const [loadingParcels, setLoadingParcels] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [assigningRider, setAssigningRider] = useState(null);

  const axiosSecure = useAxiosSecure();


  // Load parcels
  useEffect(() => {
    setLoadingParcels(true);
    axiosSecure
      .get("/parcels?payment_status=paid&delivery_status=not_collected")
      .then((res) => {
        setParcels(res.data);
      })
      .catch((err) => {
        console.error("Fetch parcels error:", err);
        Swal.fire({
          icon: "error",
          title: "Failed to Load Parcels",
          text: "There was an error loading the parcels data.",
          background: '#FEF2F2'
        });
      })
      .finally(() => setLoadingParcels(false));
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
        setRiders(res.data?.riders || res.data || []);
      })
      .catch((err) => {
        console.error("Fetch riders error:", err);
        Swal.fire({
          icon: "error",
          title: "Failed to Load Riders",
          text: "There was an error loading available riders for this district.",
          background: '#FEF2F2'
        });
        setRiders([]);
      })
      .finally(() => setLoadingRiders(false));
  }, [selectedParcel, axiosSecure]);

  // Filter riders based on search
  const filteredRiders = riders.filter(rider =>
    rider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.phone?.includes(searchTerm) ||
    rider.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // When clicking "Assign Rider" button
  const handleAssignClick = (parcel) => {
    console.log("Parcel selected:", parcel);
    setSelectedParcel(parcel);
    setModalOpen(true);
    setSearchTerm(""); // Reset search when opening modal
  };

  // Close modal and reset states
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedParcel(null);
    setRiders([]);
    setSearchTerm("");
    setAssigningRider(null);
  };

const assignRider = async (parcelId, rider) => {

  try {
    const response = await axiosSecure.patch(`/parcels/${parcelId}/assign-rider`, {
      riderId: rider._id,
      riderName: rider.name,
      riderEmail: rider.email,
      riderPhone: rider.phone,
    });
    console.log("Assign response:", response);

    if (response.data.success) {
      toast.success("✅ Rider assigned successfully!");
      handleCloseModal();
      loadParcels(); // আবার ডেটা রিফ্রেশ করতে
    } else {
      toast.error(response.data.message || "Failed to assign rider");
    }
  } catch (err) {
    console.error("❌ Error assigning rider:", err);
    toast.error("Something went wrong while assigning rider.");
  }
};

  // Get status colors
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Assign Riders to Parcels</h1>
          <p className="text-gray-600">Manage parcel assignments and track delivery progress</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <div className="text-right">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {parcels.length} Parcels Ready for Assignment
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {parcels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{parcels.length}</div>
            <div className="text-sm text-gray-600">Parcels Ready</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {[...new Set(parcels.map(p => p.receiverServiceCenter))].length}
            </div>
            <div className="text-sm text-gray-600">Service Centers</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {[...new Set(parcels.map(p => p.receiverServiceCenter?.split(" ")[0]))].length}
            </div>
            <div className="text-sm text-gray-600">Districts Covered</div>
          </div>
        </div>
      )}

      {/* Parcels Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loadingParcels ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading parcels...</p>
            </div>
          </div>
        ) : parcels.length === 0 ? (
          <div className="text-center py-16">
            <FaShippingFast className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Parcels Available</h3>
            <p className="text-gray-500">All paid parcels have been assigned or are in delivery.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parcel Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Center
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parcels.map((parcel) => (
                    <tr key={parcel._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{parcel.title}</div>
                        <div className="text-sm text-gray-500">ID: {parcel.tracking_id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center gap-2 mb-1">
                          <FaUser className="text-gray-400" />
                          {parcel.senderName}
                        </div>
                        <div className="text-sm text-gray-500">
                          To: {parcel.receiverName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" />
                          {parcel.receiverServiceCenter}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(parcel.payment_status)}`}>
                          {parcel.payment_status || "unpaid"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                            onClick={() => handleAssignClick(parcel)}
                          >
                            <FaMotorcycle />
                            Assign Rider
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <div className="p-4 space-y-4">
                {parcels.map((parcel) => (
                  <div key={parcel._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{parcel.title}</h3>
                        <p className="text-sm text-gray-500">ID: {parcel.tracking_id}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(parcel.payment_status)}`}>
                        {parcel.payment_status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-400" />
                        <span>From: {parcel.senderName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-400" />
                        <span>To: {parcel.receiverName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{parcel.receiverServiceCenter}</span>
                      </div>
                    </div>

                    <button
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      onClick={() => handleAssignClick(parcel)}
                    >
                      <FaMotorcycle />
                      Assign Rider
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Rider Assignment Modal */}
      <ReactModal
        isOpen={modalOpen}
        onRequestClose={handleCloseModal}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-auto my-8 max-h-[90vh] overflow-hidden flex flex-col"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        shouldCloseOnOverlayClick={true}
      >
        {selectedParcel && (
          <>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-2">Assign Delivery Rider</h2>
                  <p className="text-blue-100">Select a rider for parcel delivery</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-blue-200 transition-colors p-1 rounded-full hover:bg-blue-400"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            {/* Parcel Information */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaShippingFast className="text-blue-500" />
                Parcel Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-gray-700">Parcel Title</label>
                  <p className="text-gray-900">{selectedParcel.title}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Tracking ID</label>
                  <p className="text-gray-900 font-mono">{selectedParcel.tracking_id}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Service Center</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    {selectedParcel.receiverServiceCenter}
                  </p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Receiver</label>
                  <p className="text-gray-900">{selectedParcel.receiverName}</p>
                </div>
              </div>
            </div>

            {/* Available Riders Section */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaMotorcycle className="text-green-500" />
                  Available Riders in {selectedParcel.receiverServiceCenter.split(" ")[0]}
                </h3>

                {/* Search Box */}
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search riders by name, phone, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Riders List */}
              <div className="flex-1 overflow-y-auto p-6">
                {loadingRiders ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading available riders...</p>
                    </div>
                  </div>
                ) : filteredRiders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRiders.map((rider) => (
                      <div key={rider._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                              <FaUser className="text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{rider.name}</h4>
                              <p className="text-sm text-gray-500">Available</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <FaPhone className="text-gray-400" />
                            <span>{rider.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-gray-400" />
                            <span className="truncate">{rider.email}</span>
                          </div>
                          {rider.bikeBrand && (
                            <div className="flex items-center gap-2">
                              <FaMotorcycle className="text-gray-400" />
                              <span>{rider.bikeBrand} - {rider.bikeRegNumber}</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => assignRider(rider)}
                          disabled={assigningRider === rider._id}
                          className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                            assigningRider === rider._id
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          {assigningRider === rider._id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Assigning...
                            </>
                          ) : (
                            <>
                              <FaMotorcycle />
                              Assign This Rider
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaMotorcycle className="text-4xl text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">No Riders Available</h4>
                    <p className="text-gray-500">
                      {searchTerm 
                        ? "No riders match your search criteria" 
                        : "No available riders found in this district"
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </ReactModal>
    </div>
  );
};

export default AssignRider;