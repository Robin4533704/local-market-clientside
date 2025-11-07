import React, { useState } from 'react';
import { FaEye, FaCheckCircle, FaTimesCircle, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser, FaIdCard, FaMotorcycle, FaSearch, FaFilter } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import UseAuth from '../../../hooks/UseAuth';
import useAxiosSecure from '../../../hooks/UseAxiosSecure';
import Loading from '../../loading/Loading';

const PendingRiders = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('all');

  // Open modal to show rider details
  const openModal = (rider) => {
    setSelectedRider(rider);
    setModalOpen(true);
  };

  // Fetch pending riders only if user exists
  const { data: riders = [], isLoading, refetch, isError } = useQuery({
    queryKey: ['pending-riders'],
    enabled: !!user,
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/riders/pending");
        return res.data;
      } catch (err) {
        console.error("Fetch pending riders error:", err);
        throw new Error("Failed to load pending riders");
      }
    },
  });

  // Filter and search riders
  const filteredRiders = riders.filter(rider => {
    const matchesSearch = rider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rider.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rider.phone?.includes(searchTerm);
    
    const matchesDistrict = filterDistrict === 'all' || rider.district === filterDistrict;
    
    return matchesSearch && matchesDistrict;
  });

  // Get unique districts for filter
  const districts = [...new Set(riders.map(rider => rider.district).filter(Boolean))];

  // Approve/Reject handler
  const handleDecision = async (riderId, action, riderName) => {
    const actionText = action === "approve" ? "approve" : "reject";
    const actionColor = action === "approve" ? "#10B981" : "#EF4444";
    
    const confirm = await Swal.fire({
      title: `${action === "approve" ? "Approve" : "Reject"} Application?`,
      html: `
        <div class="text-left">
          <p>Are you sure you want to <strong>${actionText}</strong> the application of <strong>${riderName}</strong>?</p>
          <p class="mt-2 text-sm text-gray-600">
            ${action === "approve" ? 
              "This rider will become active and can start accepting deliveries." : 
              "This action cannot be undone. The rider will be marked as rejected."
            }
          </p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: actionColor,
      cancelButtonColor: "#6B7280",
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const status = action === "approve" ? "active" : "rejected";

      const res = await axiosSecure.patch(`/riders/${riderId}`, { status });

      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Rider ${actionText}d successfully!`,
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
          background: '#F0F9FF',
        });
        setModalOpen(false);
        refetch();
      }
    } catch (err) {
      console.error("Decision error:", err);
      Swal.fire({ 
        icon: "error", 
        title: "Error", 
        text: err.response?.data?.message || "Error updating rider status",
        background: '#FEF2F2'
      });
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking user authentication...</p>
        </div>
      </div>
    );
  }

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <FaTimesCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Pending Riders</h3>
          <p className="text-red-600 mb-4">There was an error loading the pending riders data.</p>
          <button
            onClick={() => refetch()}
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Pending Rider Applications</h1>
          <p className="text-gray-600">Review and manage rider registration requests</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <div className="text-right">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {riders.length} Pending {riders.length === 1 ? 'Application' : 'Applications'}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search riders by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* District Filter */}
          <div className="flex gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="block pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
            
            {/* Clear Filters */}
            {(searchTerm || filterDistrict !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterDistrict('all');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {riders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{riders.length}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">{filteredRiders.length}</div>
            <div className="text-sm text-gray-600">Filtered Results</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{districts.length}</div>
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
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle & ID
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRiders.length > 0 ? (
              filteredRiders.map((rider) => (
                <tr key={rider._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-yellow-600" />
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
                      {rider.district || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {rider.region || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FaMotorcycle className="text-gray-400" />
                      <span className="text-sm text-gray-900 capitalize">{rider.vehicleType || 'N/A'}</span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <FaIdCard className="text-gray-400" />
                      {rider.nationalId || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openModal(rider)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                        title="View Details"
                      >
                        <FaEye />
                        View
                      </button>
                      <button
                        onClick={() => handleDecision(rider._id, "approve", rider.name)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                        title="Approve Rider"
                      >
                        <FaCheckCircle />
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecision(rider._id, "reject", rider.name)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                        title="Reject Rider"
                      >
                        <FaTimesCircle />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <FaUser className="text-4xl mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No Pending Riders Found</h3>
                    <p>
                      {searchTerm || filterDistrict !== 'all' 
                        ? "Try adjusting your search or filter criteria" 
                        : "No pending rider applications at the moment"
                      }
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {filteredRiders.length > 0 ? (
          filteredRiders.map((rider) => (
            <div key={rider._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{rider.name}</h3>
                    <p className="text-sm text-gray-500">ID: {rider._id?.slice(-6)}</p>
                  </div>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  Pending
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
                  <span>{rider.district || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMotorcycle className="text-gray-400" />
                  <span className="capitalize">{rider.vehicleType || 'N/A'}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => openModal(rider)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1"
                >
                  <FaEye />
                  Details
                </button>
                <button
                  onClick={() => handleDecision(rider._id, "approve", rider.name)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1"
                >
                  <FaCheckCircle />
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(rider._id, "reject", rider.name)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1"
                >
                  <FaTimesCircle />
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <FaUser className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Pending Riders Found</h3>
            <p className="text-gray-500">
              {searchTerm || filterDistrict !== 'all' 
                ? "No riders match your search criteria" 
                : "No pending rider applications available"
              }
            </p>
          </div>
        )}
      </div>

      {/* Rider Details Modal */}
      {modalOpen && selectedRider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Rider Application Details</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FaUser className="text-blue-500" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Full Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRider.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">National ID</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRider.nationalId || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FaPhone className="text-green-500" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRider.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email Address</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRider.email}</p>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    Location Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Region</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRider.region || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">District</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRider.district || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600">Full Address</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRider.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FaMotorcycle className="text-purple-500" />
                    Vehicle Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Vehicle Type</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{selectedRider.vehicleType || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">License Plate</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRider.licensePlate || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleDecision(selectedRider._id, "approve", selectedRider.name)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle />
                      Approve Application
                    </button>
                    <button
                      onClick={() => handleDecision(selectedRider._id, "reject", selectedRider.name)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTimesCircle />
                      Reject Application
                    </button>
                    <button
                      onClick={() => setModalOpen(false)}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;