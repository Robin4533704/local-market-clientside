import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { getAuth } from "firebase/auth";
import Loading from "../../../loading/Loading";
import { FaSearch, FaUser, FaUserShield, FaStore, FaEnvelope, FaCalendarAlt, FaSync, FaEye, FaEdit, FaFilter, FaCrown } from "react-icons/fa";

const AdminAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [roleFilter, setRoleFilter] = useState("all");
  const [updatingUser, setUpdatingUser] = useState(null);
  const axiosSecure = useAxiosSecure();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Admin not logged in");

      const token = await currentUser.getIdToken(true);
      const res = await axiosSecure.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to Load Users",
        text: err.response?.data?.message || "Could not fetch users data",
        background: '#FEF2F2'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (user, newRole) => {
    const { _id, name, email, role: currentRole } = user;
    
    if (currentRole === newRole) {
      Swal.fire({
        icon: "info",
        title: "Role Unchanged",
        text: `User is already a ${newRole}`,
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const confirm = await Swal.fire({
      title: `Change User Role?`,
      html: `
        <div class="text-left">
          <p>Change role for <strong>${name || email}</strong> from <span class="font-semibold">${currentRole}</span> to <span class="font-semibold">${newRole}</span>?</p>
          <div class="mt-3 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">
              ${newRole === "admin" 
                ? "⚠️ This user will gain full administrative privileges." 
                : newRole === "vendor"
                ? "This user will be able to manage products and advertisements."
                : "This user will have regular user privileges."
              }
            </p>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: newRole === "admin" ? "#DC2626" : "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: `Make ${newRole}`,
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setUpdatingUser(_id);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Admin not logged in");

      const token = await currentUser.getIdToken(true);
      await axiosSecure.put(
        `/users/${_id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Role Updated!",
        html: `
          <div class="text-center">
            <div class="text-green-500 text-4xl mb-2">✓</div>
            <p><strong>${name || email}</strong> is now a <strong>${newRole}</strong></p>
          </div>
        `,
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
        background: '#F0F9FF'
      });
      fetchUsers();
    } catch (err) {
      console.error("Role update error:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.message || "Could not update user role",
        background: '#FEF2F2'
      });
    } finally {
      setUpdatingUser(null);
    }
  };

  // Search and filter logic
  const filteredUsers = users.filter((user) => {
    const name = user.name || "";
    const email = user.email || "";
    const role = user.role || "user";
    
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Calculate statistics
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === "admin").length,
    vendors: users.filter(u => u.role === "vendor").length,
    users: users.filter(u => !u.role || u.role === "user").length,
  };

  // Get role badge color
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

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FaCrown className="text-red-600" />;
      case "vendor":
        return <FaStore className="text-purple-600" />;
      default:
        return <FaUser className="text-blue-600" />;
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

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchQuery("");
    setRoleFilter("all");
    setCurrentPage(1);
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <FaUserShield className="text-blue-500" />
            User Management
          </h1>
          <p className="text-gray-600">Manage all users and their roles in the system</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <div className="text-right">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {stats.total} Total Users
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
          <div className="text-sm text-gray-600">Administrators</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{stats.vendors}</div>
          <div className="text-sm text-gray-600">Vendors</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{stats.users}</div>
          <div className="text-sm text-gray-600">Regular Users</div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Role Filter */}
          <div className="flex gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="block pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="vendor">Vendors</option>
                <option value="user">Users</option>
              </select>
            </div>
            
            <button
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <FaSearch />
              Search
            </button>

            {(searchQuery || roleFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <FaSync />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {currentUsers.length === 0 ? (
          <div className="text-center py-16">
            <FaUser className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Users Found</h3>
            <p className="text-gray-500">
              {searchQuery || roleFilter !== "all" 
                ? "Try adjusting your search or filter criteria" 
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
                      Role & Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            {getRoleIcon(user.role)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || "No Name"}
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
                        <div className="flex justify-center gap-2">
                          {user.role !== "admin" && (
                            <>
                              <button
                                onClick={() => handleUpdateRole(user, "admin")}
                                disabled={updatingUser === user._id}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:bg-red-300"
                              >
                                {updatingUser === user._id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                    Updating...
                                  </>
                                ) : (
                                  <>
                                    <FaCrown />
                                    Make Admin
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleUpdateRole(user, "vendor")}
                                disabled={updatingUser === user._id}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:bg-purple-300"
                              >
                                <FaStore />
                                Make Vendor
                              </button>
                            </>
                          )}
                          {user.role === "admin" && (
                            <span className="text-sm text-gray-500 italic">System Administrator</span>
                          )}
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
                {currentUsers.map((user) => (
                  <div key={user._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                          {getRoleIcon(user.role)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {user.name || "No Name"}
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

                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      {user.role !== "admin" && (
                        <>
                          <button
                            onClick={() => handleUpdateRole(user, "admin")}
                            disabled={updatingUser === user._id}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1 disabled:bg-red-300"
                          >
                            <FaCrown />
                            Admin
                          </button>
                          <button
                            onClick={() => handleUpdateRole(user, "vendor")}
                            disabled={updatingUser === user._id}
                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1 disabled:bg-purple-300"
                          >
                            <FaStore />
                            Vendor
                          </button>
                        </>
                      )}
                      {user.role === "admin" && (
                        <span className="text-sm text-gray-500 italic w-full text-center">System Administrator</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        {filteredUsers.length > usersPerPage && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastUser, filteredUsers.length)}
                </span>{" "}
                of <span className="font-medium">{filteredUsers.length}</span> results
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
    </div>
  );
};

export default AdminAllUsers;