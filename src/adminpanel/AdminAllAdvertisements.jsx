import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Trash2, Check, X, Search, Filter, Eye, Calendar, User, AlertCircle } from "lucide-react";
import useAxiosSecure from "../hooks/UseAxiosSecure";

const AdminAllAdvertisements = () => {
  const axiosSecure = useAxiosSecure();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedAd, setSelectedAd] = useState(null);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get("/admin/advertisements");
      setAds(data);
    } catch (err) {
      console.error("Fetch ads error:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch advertisements",
        icon: "error",
        background: '#FEF2F2'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleStatus = async (id, status, adTitle) => {
    setActionLoading(id);
    try {
      await axiosSecure.put(`/admin/advertisements/${id}`, { status });
      Swal.fire({
        title: "Status Updated!",
        html: `
          <div class="text-center">
            <div class="text-green-500 text-4xl mb-2">✓</div>
            <p><strong>${adTitle}</strong> has been ${status}</p>
          </div>
        `,
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
        background: '#F0F9FF'
      });
      fetchAds();
    } catch (error) {
      console.error("Status update error:", error);
      Swal.fire({
        title: "Update Failed",
        text: error.response?.data?.message || "Failed to update advertisement status",
        icon: "error",
        background: '#FEF2F2'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id, adTitle) => {
    const confirm = await Swal.fire({
      title: "Delete Advertisement?",
      html: `
        <div class="text-left">
          <p>Are you sure you want to delete <strong>"${adTitle}"</strong>?</p>
          <p class="text-sm text-gray-600 mt-2">This action cannot be undone and will permanently remove the advertisement.</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true
    });

    if (confirm.isConfirmed) {
      setActionLoading(id);
      try {
        await axiosSecure.delete(`/admin/advertisements/${id}`);
        Swal.fire({
          title: "Deleted!",
          html: `
            <div class="text-center">
              <div class="text-green-500 text-4xl mb-2">✓</div>
              <p>Advertisement has been deleted</p>
            </div>
          `,
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true,
          background: '#F0F9FF'
        });
        fetchAds();
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire({
          title: "Deletion Failed",
          text: error.response?.data?.message || "Failed to delete advertisement",
          icon: "error",
          background: '#FEF2F2'
        });
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleViewDetails = (ad) => {
    setSelectedAd(ad);
  };

  const closeModal = () => {
    setSelectedAd(null);
  };

  // Filter and search logic
  const filteredAds = ads.filter(ad => {
    const matchesSearch = 
      ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.vendorEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || ad.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAds = filteredAds.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAds.length / itemsPerPage);

  // Get status color and icon
  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <Check className="h-3 w-3" />
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <AlertCircle className="h-3 w-3" />
        };
      case "rejected":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <X className="h-3 w-3" />
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <AlertCircle className="h-3 w-3" />
        };
    }
  };

  // Statistics
  const stats = {
    total: ads.length,
    pending: ads.filter(ad => ad.status === "pending").length,
    approved: ads.filter(ad => ad.status === "approved").length,
    rejected: ads.filter(ad => ad.status === "rejected").length,
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading advertisements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Advertisement Management</h1>
          <p className="text-gray-600">Review and manage vendor advertisements</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <div className="text-right">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {stats.total} Total Ads
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Ads</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search advertisements by title, vendor name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Advertisements Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {currentAds.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Advertisements Found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "No advertisements available for review"
              }
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Advertisement Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status & Date
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentAds.map((ad) => {
                    const statusConfig = getStatusConfig(ad.status);
                    return (
                      <tr key={ad._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-4">
                            {ad.image && (
                              <img
                                src={ad.image}
                                alt={ad.title}
                                className="w-16 h-12 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {ad.title}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-2">
                                {ad.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{ad.vendorName}</div>
                          <div className="text-sm text-gray-500">{ad.vendorEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${statusConfig.color}`}>
                              {statusConfig.icon}
                              {ad.status}
                            </span>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(ad.createdAt || ad.date)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(ad)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleStatus(ad._id, "approved", ad.title)}
                              disabled={ad.status === "approved" || actionLoading === ad._id}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Approve Advertisement"
                            >
                              {actionLoading === ad._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleStatus(ad._id, "rejected", ad.title)}
                              disabled={ad.status === "rejected" || actionLoading === ad._id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Reject Advertisement"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(ad._id, ad.title)}
                              disabled={actionLoading === ad._id}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete Advertisement"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <div className="p-4 space-y-4">
                {currentAds.map((ad) => {
                  const statusConfig = getStatusConfig(ad.status);
                  return (
                    <div key={ad._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{ad.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2">{ad.description}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${statusConfig.color}`}>
                          {statusConfig.icon}
                          {ad.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{ad.vendorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(ad.createdAt || ad.date)}</span>
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {ad.vendorEmail}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleViewDetails(ad)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          Details
                        </button>
                        {ad.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatus(ad._id, "approved", ad.title)}
                              disabled={actionLoading === ad._id}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1 disabled:bg-green-300"
                            >
                              <Check className="h-4 w-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatus(ad._id, "rejected", ad.title)}
                              disabled={actionLoading === ad._id}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1 disabled:bg-red-300"
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(ad._id, ad.title)}
                          disabled={actionLoading === ad._id}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1 disabled:bg-gray-300"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        {filteredAds.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredAds.length)}
                </span>{" "}
                of <span className="font-medium">{filteredAds.length}</span> ads
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border rounded-lg ${
                        currentPage === pageNum
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advertisement Details Modal */}
      {selectedAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Advertisement Details</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Advertisement Image */}
                {selectedAd.image && (
                  <div>
                    <img
                      src={selectedAd.image}
                      alt={selectedAd.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Advertisement Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Advertisement Info</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Title</label>
                        <p className="text-gray-900">{selectedAd.title}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Description</label>
                        <p className="text-gray-900">{selectedAd.description}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Status</label>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusConfig(selectedAd.status).color}`}>
                          {getStatusConfig(selectedAd.status).icon}
                          {selectedAd.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Vendor Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Vendor Name</label>
                        <p className="text-gray-900">{selectedAd.vendorName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <p className="text-gray-900">{selectedAd.vendorEmail}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Created Date</label>
                        <p className="text-gray-900">{formatDate(selectedAd.createdAt || selectedAd.date)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {selectedAd.status === "pending" && (
                      <>
                        <button
                          onClick={() => {
                            handleStatus(selectedAd._id, "approved", selectedAd.title);
                            closeModal();
                          }}
                          disabled={actionLoading === selectedAd._id}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-green-300"
                        >
                          <Check className="h-5 w-5" />
                          Approve Advertisement
                        </button>
                        <button
                          onClick={() => {
                            handleStatus(selectedAd._id, "rejected", selectedAd.title);
                            closeModal();
                          }}
                          disabled={actionLoading === selectedAd._id}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-red-300"
                        >
                          <X className="h-5 w-5" />
                          Reject Advertisement
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        handleDelete(selectedAd._id, selectedAd.title);
                        closeModal();
                      }}
                      disabled={actionLoading === selectedAd._id}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300"
                    >
                      <Trash2 className="h-5 w-5" />
                      Delete Advertisement
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

export default AdminAllAdvertisements;