import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";
import { FaSearch, FaEye, FaPhone, FaEnvelope, FaMapMarkerAlt, FaIdCard, FaMotorcycle, FaUserSlash } from "react-icons/fa";
import Loading from "../../loading/Loading";

const ActiveRiders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [queryTerm, setQueryTerm] = useState("");
  const [selectedRider, setSelectedRider] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  const handleSearch = (e) => {
    e.preventDefault();
    setQueryTerm(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setQueryTerm("");
  };

  const fetchRiders = async () => {
    const { data } = await axiosSecure.get("/riders/active", {
      params: { search: queryTerm },
    });
    return data;
  };

  const { data: riders = [], isLoading, isError, error } = useQuery({
    queryKey: ["activeRiders", queryTerm],
    queryFn: fetchRiders,
    keepPreviousData: true,
  });

  const deactivateMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/riders/${id}`, { status: "inactive" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["activeRiders"]);
      setShowModal(false);
      Swal.fire({
        icon: "success",
        title: "Rider Deactivated",
        text: "The rider has been successfully deactivated.",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong!",
      });
    },
  });

  const handleDeactivate = (rider) => {
    setSelectedRider(rider);
    Swal.fire({
      title: "Deactivate Rider?",
      html: `
        <div class="text-left">
          <p>Are you sure you want to deactivate <strong>${rider.name}</strong>?</p>
          <p class="mt-2 text-sm text-gray-600">This action will remove them from active duty.</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Deactivate",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deactivateMutation.mutate(rider._id);
      }
    });
  };

  const openRiderDetails = (rider) => {
    setSelectedRider(rider);
    setShowModal(true);
  };

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <FaUserSlash className="text-red-500 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Riders</h3>
          <p className="text-red-600 mb-4">There was an error loading the riders data.</p>
          <button
            onClick={() => queryClient.refetchQueries(["activeRiders"])}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Active Riders</h2>
          <p className="text-gray-600">Manage and monitor your delivery riders</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <div className="text-right">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {riders.length} Active {riders.length === 1 ? 'Rider' : 'Riders'}
            </span>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search riders by name, email, phone, or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <FaSearch />
              Search
            </button>
            {queryTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Statistics Cards */}
      {riders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{riders.length}</div>
            <div className="text-sm text-gray-600">Total Active</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {riders.filter(r => r.vehicleType === 'motorcycle').length}
            </div>
            <div className="text-sm text-gray-600">Motorcycle Riders</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {riders.filter(r => r.vehicleType === 'bicycle').length}
            </div>
            <div className="text-sm text-gray-600">Bicycle Riders</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">
              {[...new Set(riders.map(r => r.district))].length}
            </div>
            <div className="text-sm text-gray-600">Districts Covered</div>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rider Information
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location & ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {riders.length > 0 ? (
              riders.map((rider) => (
                <tr key={rider._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold">
                          {rider.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{rider.name}</div>
                        <div className="text-sm text-gray-500">ID: {rider._id?.slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center gap-2 mb-1">
                      <FaPhone className="text-gray-400" />
                      {rider.phone}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      {rider.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center gap-2 mb-1">
                      <FaMapMarkerAlt className="text-gray-400" />
                      {rider.district}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <FaIdCard className="text-gray-400" />
                      {rider.nationalId}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FaMotorcycle className="text-gray-400" />
                      <span className="text-sm text-gray-900 capitalize">{rider.vehicleType}</span>
                    </div>
                    {rider.licensePlate && (
                      <div className="text-sm text-gray-500 mt-1">
                        Plate: {rider.licensePlate}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openRiderDetails(rider)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                      >
                        <FaEye />
                        View
                      </button>
                      <button
                        onClick={() => handleDeactivate(rider)}
                        disabled={deactivateMutation.isLoading}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:bg-red-300"
                      >
                        <FaUserSlash />
                        {deactivateMutation.isLoading ? "Processing..." : "Deactivate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <FaUserSlash className="text-4xl mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No Riders Found</h3>
                    <p>{queryTerm ? "Try adjusting your search terms" : "No active riders available"}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {riders.length > 0 ? (
          riders.map((rider) => (
            <div key={rider._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-lg">
                      {rider.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{rider.name}</h3>
                    <p className="text-sm text-gray-500">ID: {rider._id?.slice(-6)}</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Active
                </span>
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
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span>{rider.district}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaIdCard className="text-gray-400" />
                  <span>{rider.nationalId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMotorcycle className="text-gray-400" />
                  <span className="capitalize">{rider.vehicleType}</span>
                  {rider.licensePlate && (
                    <span className="text-gray-500 ml-2">({rider.licensePlate})</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => openRiderDetails(rider)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1"
                >
                  <FaEye />
                  Details
                </button>
                <button
                  onClick={() => handleDeactivate(rider)}
                  disabled={deactivateMutation.isLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1 disabled:bg-red-300"
                >
                  <FaUserSlash />
                  {deactivateMutation.isLoading ? "Processing..." : "Deactivate"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <FaUserSlash className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Riders Found</h3>
            <p className="text-gray-500">
              {queryTerm ? "No riders match your search criteria" : "No active riders available"}
            </p>
          </div>
        )}
      </div>

      {/* Rider Details Modal */}
      {showModal && selectedRider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Rider Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-semibold text-2xl">
                      {selectedRider.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold">{selectedRider.name}</h4>
                  <p className="text-gray-500">Rider ID: {selectedRider._id?.slice(-6)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{selectedRider.phone}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Email</label>
                    <p className="text-gray-900 truncate">{selectedRider.email}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">District</label>
                    <p className="text-gray-900">{selectedRider.district}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">National ID</label>
                    <p className="text-gray-900">{selectedRider.nationalId}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Vehicle Type</label>
                    <p className="text-gray-900 capitalize">{selectedRider.vehicleType}</p>
                  </div>
                  {selectedRider.licensePlate && (
                    <div>
                      <label className="font-medium text-gray-700">License Plate</label>
                      <p className="text-gray-900">{selectedRider.licensePlate}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleDeactivate(selectedRider)}
                    disabled={deactivateMutation.isLoading}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors disabled:bg-red-300 flex items-center justify-center gap-2"
                  >
                    <FaUserSlash />
                    {deactivateMutation.isLoading ? "Processing..." : "Deactivate Rider"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRiders;