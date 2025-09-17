import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/UseAxiosSecure";

const MakeVendor = () => {
  const [emailQuery, setEmailQuery] = useState("");
  const axiosSecure = useAxiosSecure();

  // সব user load
  const { data: allUsers = [], refetch: refetchAll, isLoading: isAllLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
    enabled: !emailQuery,
  });

  // সার্চ করা ইউজার
  const { data: searchedUsers = [], refetch: refetchSearch, isLoading: isSearchLoading } = useQuery({
    queryKey: ["searchedUsers", emailQuery],
    enabled: !!emailQuery,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?email=${emailQuery}`);
      return res.data;
    },
  });

  // Role update
  const { mutateAsync: updateRole } = useMutation({
    mutationFn: async ({ email, newRole }) =>
      await axiosSecure.patch(`/users/${encodeURIComponent(email)}/role`, { newRole }),
    onSuccess: () => {
      refetchAll();
      refetchSearch();
    },
  });

  const handleRoleChange = async (email, currentRole) => {
    const action = currentRole === "vendor" ? "Remove Vendor" : "Make Vendor";
    const newRole = currentRole === "vendor" ? "user" : "vendor";

    const confirm = await Swal.fire({
      title: `${action}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (!confirm.isConfirmed) return;

    try {
      await updateRole({ email, newRole });
      Swal.fire("Success", `${action} successful`, "success");
    } catch (err) {
      console.error("MakeVendor error:", err);
      Swal.fire("Error", "Failed to update vendor role", "error");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setEmailQuery(e.target.email.value.trim());
  };

  const displayUsers = emailQuery ? searchedUsers : allUsers;
  const isLoading = emailQuery ? isSearchLoading : isAllLoading;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">🛍 Manage Vendor Role</h2>

      {/* search form */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
        <input
          type="email"
          name="email"
          placeholder="Enter user email"
          className="flex-1 border p-2 rounded-md"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Search
        </button>
        {emailQuery && (
          <button
            type="button"
            className="ml-2 bg-gray-300 px-3 py-2 rounded-md"
            onClick={() => setEmailQuery("")}
          >
            View All Users
          </button>
        )}
      </form>

      {/* users list */}
      {isLoading ? (
        <p>Loading...</p>
      ) : displayUsers.length > 0 ? (
        <div className="overflow-x-auto border p-4 rounded-md bg-gray-50">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Created At</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayUsers.map((user) => (
                <tr key={user._id} className="text-center">
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">
                    {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
                  </td>
                  <td className="px-4 py-2 border">{user.role || "user"}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleRoleChange(user.email, user.role)}
                      className={`px-3 py-1 rounded-md text-white ${
                        user.role === "vendor" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {user.role === "vendor" ? "Remove Vendor" : "Make Vendor"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-red-500">No users found</p>
      )}
    </div>
  );
};

export default MakeVendor;
