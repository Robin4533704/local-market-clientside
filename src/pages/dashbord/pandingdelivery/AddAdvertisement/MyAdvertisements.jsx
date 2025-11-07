import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/UseAuth";
import useAxiosSecure from "../../../../hooks/UseAxiosSecure";
import Loading from "../../../loading/Loading";

const MyAdvertisements = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useAuth();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "pending", "approved", "rejected"

  const fetchAds = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const { data } = await axiosSecure.get(`/vendor/advertisements/${user.email}`);
      setAds(data);
    } catch (err) {
      console.error("Fetch Ads Error:", err);
      Swal.fire("Error", "Failed to fetch advertisements", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading && user?.email) {
      fetchAds();
    }
  }, [user, userLoading]);

  const handleDelete = async (id, title) => {
    const confirm = await Swal.fire({
      title: "Delete Advertisement?",
      text: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/vendor/advertisements/${id}`);
      Swal.fire("Deleted!", "Advertisement deleted successfully", "success");
      fetchAds();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete advertisement", "error");
    }
  };

  // Filter ads based on status
  const filteredAds = filter === "all" 
    ? ads 
    : ads.filter(ad => ad.status === filter);

  // Get status count for badges
  const getStatusCount = (status) => ads.filter(ad => ad.status === status).length;

  // Status badge color function
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading || userLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">My Advertisements</h2>
          <p className="text-gray-600">Manage and track your advertisement campaigns</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/add-advertisement")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors mt-4 md:mt-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Ad
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex flex-wrap gap-2 p-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({ads.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "pending" 
                ? "bg-yellow-500 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending ({getStatusCount("pending")})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "approved" 
                ? "bg-green-500 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Approved ({getStatusCount("approved")})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "rejected" 
                ? "bg-red-500 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Rejected ({getStatusCount("rejected")})
          </button>
        </div>
      </div>

      {/* Advertisements Grid */}
      {filteredAds.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
          <div className="max-w-md mx-auto">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v3m0-3a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {filter === "all" ? "No Advertisements Found" : `No ${filter} Advertisements`}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === "all" 
                ? "Get started by creating your first advertisement campaign." 
                : `You don't have any ${filter} advertisements at the moment.`
              }
            </p>
            {filter === "all" && (
              <button
                onClick={() => navigate("/dashboard/add-advertisement")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Create Your First Ad
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map((ad) => (
            <div key={ad._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              {/* Image Section */}
              <div className="relative">
                {ad.image ? (
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ad.status)}`}>
                  {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {ad.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {ad.description}
                </p>
                
                {/* Meta Information */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Created: {formatDate(ad.createdAt || ad.date)}</span>
                  {ad.updatedAt && ad.updatedAt !== ad.createdAt && (
                    <span>Updated: {formatDate(ad.updatedAt)}</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/dashboard/update-advertisement/${ad._id}`)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ad._id, ad.title)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {ads.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{ads.length}</div>
            <div className="text-sm text-blue-800">Total Ads</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{getStatusCount("approved")}</div>
            <div className="text-sm text-green-800">Approved</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{getStatusCount("pending")}</div>
            <div className="text-sm text-yellow-800">Pending</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">{getStatusCount("rejected")}</div>
            <div className="text-sm text-red-800">Rejected</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAdvertisements;