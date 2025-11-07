import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/UseAxiosSecure";
import { FaSearch, FaUser, FaUserTie, FaStore, FaEnvelope, FaCalendarAlt, FaSync, FaTimes, FaCheck, FaExclamationTriangle } from "react-icons/fa";

const MakeVendor = () => {
  const [emailQuery, setEmailQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all users
  const { 
    data: allUsers = [], 
    refetch: refetchAll, 
    isLoading: isAllLoading,
    isError: isAllError,
    error: allError
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
    enabled: !emailQuery,
  });

  // Search users
  const { 
    data: searchedUsers = [], 
    refetch: refetchSearch, 
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError
  } = useQuery({
    queryKey: ["searchedUsers", emailQuery],
    enabled: !!emailQuery,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?email=${emailQuery}`);
      return res.data;
    },
  });

  // Role update mutation
  const { mutateAsync: updateRole, isLoading: isUpdating } = useMutation({
    mutationFn: async ({ email, newRole, userName }) => {
      const response = await axiosSecure.patch(`/users/${encodeURIComponent(email)}/role`, { 
        newRole,
        userName 
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["allUsers"]);
      queryClient.invalidateQueries(["searchedUsers"]);
      
      Swal.fire({
        icon: "success",
        title: `Role Updated!`,
        html: `
          <div class="text-center">
            <div class="text-green-500 text-4xl mb-2">✓</div>
            <p><strong>${variables.userName || variables.email}</strong> is now a <strong>${variables.newRole}</strong></p>
          </div>
        `,
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
        background: '#F0F9FF'
      });
    },
    onError: (error, variables) => {
      console.error("Role update error:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || `Failed to update role for ${variables.email}`,
        background: '#FEF2F2'
      });
    },
  });

  const handleRoleChange = async (user) => {
    const { email, role, name, displayName } = user;
    const userName = name || displayName || email;
    const currentRole = role || "user";
    const action = currentRole === "vendor" ? "Remove Vendor" : "Make Vendor";
    const newRole = currentRole === "vendor" ? "user" : "vendor";

    const confirm = await Swal.fire({
      title: `${action}?`,
      html: `
        <div class="text-left">
          <p>Are you sure you want to <strong>${action.toLowerCase()}</strong> for:</p>
          <div class="bg-gray-50 p-3 rounded-lg mt-2">
            <p class="font-semibold">${userName}</p>
            <p class="text-sm text-gray-600">${email}</p>
          </div>
          <p class="mt-3 text-sm text-gray-600">
            ${action === "Make Vendor" 
              ? "This user will gain access to vendor features and dashboard." 
              : "This user will lose vendor privileges and access."
            }
          </p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: action === "Make Vendor" ? "#10B981" : "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: action,
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await updateRole({ email, newRole, userName });
    } catch (err) {
      // Error handling is done in mutation onError
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const email = searchInput.trim();
    if (email) {
      setEmailQuery(email);
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setEmailQuery("");
  };

  const displayUsers = emailQuery ? searchedUsers : allUsers;
  const isLoading = emailQuery ? isSearchLoading : isAllLoading;
  const isError = emailQuery ? isSearchError : isAllError;
  const error = emailQuery ? searchError : allError;

  // Calculate statistics
  const stats = {
    total: displayUsers.length,
    vendors: displayUsers.filter(user => user.role === "vendor").length,
    users: displayUsers.filter(user => !user.role || user.role === "user").length,
    admins: displayUsers.filter(user => user.role === "admin").length,
  };

  // Get role badge color
  const getRoleColor = (role) => {
    switch (role) {
      case "vendor":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
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

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <FaStore className="text-blue-500" />
            Vendor Management
          </h1>
          <p className="text-gray-600">Manage user roles and vendor permissions</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <div className="text-right">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {stats.total} {stats.total === 1 ? 'User' : 'Users'}
            </span>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="email"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search users by email address..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <FaSearch />
              Search User
            </button>
            {(emailQuery || searchInput) && (
              <button
                type="button"
                onClick={clearSearch}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <FaTimes />
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Statistics Cards */}
      {displayUsers.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">{stats.vendors}</div>
            <div className="text-sm text-gray-600">Vendors</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{stats.users}</div>
            <div className="text-sm text-gray-600">Regular Users</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
            <div className="text-sm text-gray-600">Admins</div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {emailQuery ? "Searching users..." : "Loading all users..."}
              </p>
            </div>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Users</h3>
              <p className="text-red-600 mb-4">
                {error?.response?.data?.message || "There was an error loading users data."}
              </p>
              <button
                onClick={() => emailQuery ? refetchSearch() : refetchAll()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
              >
                <FaSync />
                Try Again
              </button>
            </div>
          </div>
        ) : displayUsers.length === 0 ? (
          <div className="text-center py-16">
            <FaUser className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Users Found</h3>
            <p className="text-gray-500">
              {emailQuery 
                ? "No users match your search criteria" 
                : "No users found in the system"
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
                      User Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {user.role === "vendor" ? (
                              <FaStore className="text-blue-600" />
                            ) : user.role === "admin" ? (
                              <FaUserTie className="text-red-600" />
                            ) : (
                              <FaUser className="text-gray-600" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || user.displayName || "No Name"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <FaEnvelope className="text-gray-400" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center gap-2 mb-1">
                          <FaCalendarAlt className="text-gray-400" />
                          Joined {formatDate(user.createdAt)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Last login: {user.lastLoginAt ? formatDate(user.lastLoginAt) : "Never"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getRoleColor(user.role)}`}>
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleRoleChange(user)}
                            disabled={isUpdating || user.role === "admin"}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                              user.role === "vendor" 
                                ? "bg-red-500 hover:bg-red-600 text-white" 
                                : user.role === "admin"
                                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                            title={user.role === "admin" ? "Cannot modify admin roles" : ""}
                          >
                            {isUpdating ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Updating...
                              </>
                            ) : user.role === "vendor" ? (
                              <>
                                <FaTimes />
                                Remove Vendor
                              </>
                            ) : user.role === "admin" ? (
                              <>
                                <FaUserTie />
                                Admin User
                              </>
                            ) : (
                              <>
                                <FaCheck />
                                Make Vendor
                              </>
                            )}
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
                {displayUsers.map((user) => (
                  <div key={user._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          {user.role === "vendor" ? (
                            <FaStore className="text-blue-600" />
                          ) : user.role === "admin" ? (
                            <FaUserTie className="text-red-600" />
                          ) : (
                            <FaUser className="text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {user.name || user.displayName || "No Name"}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <FaEnvelope className="text-gray-400" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(user.role)}`}>
                        {user.role || "user"}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>Joined {formatDate(user.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>Last login: {user.lastLoginAt ? formatDate(user.lastLoginAt) : "Never"}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRoleChange(user)}
                      disabled={isUpdating || user.role === "admin"}
                      className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        user.role === "vendor" 
                          ? "bg-red-500 hover:bg-red-600 text-white" 
                          : user.role === "admin"
                          ? "bg-gray-300 cursor-not-allowed text-gray-500"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                      title={user.role === "admin" ? "Cannot modify admin roles" : ""}
                    >
                      {isUpdating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Updating...
                        </>
                      ) : user.role === "vendor" ? (
                        <>
                          <FaTimes />
                          Remove Vendor
                        </>
                      ) : user.role === "admin" ? (
                        <>
                          <FaUserTie />
                          Admin User
                        </>
                      ) : (
                        <>
                          <FaCheck />
                          Make Vendor
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Vendor Role Information
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                • Vendors can add products, manage inventory, and create advertisements<br/>
                • Admin roles cannot be modified through this interface<br/>
                • Role changes take effect immediately
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeVendor;