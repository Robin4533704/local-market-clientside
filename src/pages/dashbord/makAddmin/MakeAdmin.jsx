import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";
import {
  FaSearch,
  FaUser,
  FaUserShield,
  FaCrown,
  FaEnvelope,
  FaCalendarAlt,
  FaSync,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaIdCard,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";

const MakeAdmin = () => {
  const [emailQuery, setEmailQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all users
  const {
    data: allUsers = [],
    refetch: refetchAll,
    isLoading: isAllLoading,
    isError: isAllError,
    error: allError,
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
    error: searchError,
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
    mutationFn: async ({ id, newRole, userData }) => {
      const response = await axiosSecure.patch(`/users/${id}/role`, {
        newRole,
        userData,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["allUsers"]);
      queryClient.invalidateQueries(["searchedUsers"]);

      Swal.fire({
        icon: "success",
        title: `Admin Role ${variables.newRole === "admin" ? "Granted" : "Revoked"}!`,
        html: `
          <div class="text-center">
            <div class="text-green-500 text-4xl mb-2">✓</div>
            <p><strong>${variables.userData.name || variables.userData.email}</strong></p>
            <p class="text-sm text-gray-600 mt-2">
              ${variables.newRole === "admin"
                ? "Now has full administrative access"
                : "Administrative privileges have been removed"}
            </p>
          </div>
        `,
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
        background: "#F0F9FF",
      });
    },
    onError: (error, variables) => {
      console.error("Role update error:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          `Failed to update admin role for ${variables.userData.email}`,
        background: "#FEF2F2",
      });
    },
  });

  const handleRoleChange = async (user) => {
    const { _id, email, role, name, displayName } = user;
    const userName = name || displayName || email;
    const currentRole = role || "user";
    const action = currentRole === "admin" ? "Remove Admin" : "Make Admin";
    const newRole = currentRole === "admin" ? "user" : "admin";

    const confirm = await Swal.fire({
      title: `${action}?`,
      html: `
        <div class="text-left">
          <p>Are you sure you want to <strong>${action.toLowerCase()}</strong> for:</p>
          <div class="bg-gray-50 p-3 rounded-lg mt-2">
            <p class="font-semibold">${userName}</p>
            <p class="text-sm text-gray-600">${email}</p>
            <p class="text-sm text-gray-500 mt-1">Current Role: <span class="font-medium">${currentRole}</span></p>
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: action === "Make Admin" ? "#DC2626" : "#6B7280",
      cancelButtonColor: "#6B7280",
      confirmButtonText: action,
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      await updateRole({
        id: _id,
        newRole,
        userData: { name: userName, email },
      });
    } catch (err) {}
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const email = searchInput.trim();
    if (email) {
      setEmailQuery(email);
      setCurrentPage(1);
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setEmailQuery("");
    setCurrentPage(1);
  };

  const displayUsers = emailQuery ? searchedUsers : allUsers;
  const isLoading = emailQuery ? isSearchLoading : isAllLoading;
  const isError = emailQuery ? isSearchError : isAllError;
  const error = emailQuery ? searchError : allError;

  // Pagination logic
  const totalPages = Math.ceil(displayUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = displayUsers.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Badge colors and icons
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "vendor":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FaCrown className="text-red-600" />;
      case "vendor":
        return <FaUserShield className="text-purple-600" />;
      default:
        return <FaUser className="text-blue-600" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* (Header, Search, Table — unchanged) */}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-10 w-10 border-4 border-red-500 border-t-transparent rounded-full"></div>
          </div>
        ) : isError ? (
          <div className="text-center text-red-600 py-8">
            Error: {error?.message || "Failed to load users"}
          </div>
        ) : (
          <>
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
                      Role & Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                            {getRoleIcon(user.role)}
                          </div>
                          <div className="ml-4">
                            <p className="font-medium">{user.name || "No Name"}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        Joined {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleRoleChange(user)}
                          className={`px-4 py-2 rounded-lg text-white ${
                            user.role === "admin"
                              ? "bg-gray-500 hover:bg-gray-600"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 py-6">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  <FaAngleLeft />
                </button>

                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  <FaAngleRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MakeAdmin;
