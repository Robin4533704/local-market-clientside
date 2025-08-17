import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";
import { FaUserShield } from "react-icons/fa";

const MakeAdmin = () => {
  const [emailQuery, setEmailQuery] = useState("");
  const axiosSecure = UseAxiosSecure();

  // সব ইউজার আনলোড
  const { data: allUsers = [], refetch, isLoading, error } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // ইউজার সার্চ
  const { data: searchedUsers = [], refetch: refetchSearch } = useQuery({
    queryKey: ["searchedUsers", emailQuery],
    enabled: !!emailQuery,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?email=${emailQuery}`);
      return res.data;
    },
  });

  // Role আপডেট
  const { mutateAsync: updateRole } = useMutation({
    mutationFn: async ({ id, role }) =>
      await axiosSecure.patch(`/users/${id}/role`, { role }),
    onSuccess: () => {
      refetch();
      refetchSearch();
    },
  });

  const handleRoleChange = async (id, currentRole) => {
    const action = currentRole === "admin" ? "Remove admin" : "Make admin";
    const newRole = currentRole === "admin" ? "user" : "admin";

    const confirm = await Swal.fire({
      title: `${action}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (!confirm.isConfirmed) return;

    try {
      await updateRole({ id, role: newRole });
      Swal.fire("Success", `${action} successful`, "success");
    } catch (err) {
      Swal.fire("Error", "Failed to update user role", "error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailQuery(e.target.email.value);
  };

  const displayUsers = emailQuery ? searchedUsers : allUsers;

  return (
   <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
  <h2 className="text-2xl font-bold mb-4">🔑 Manage User Role</h2>

  {/* সার্চ ফর্ম */}
  <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
    <input
      type="email"
      name="email"
      placeholder="Enter user email"
      className="flex-1 border p-2 rounded-md"
    />
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
    >
      Search
    </button>
    {/* সব ইউজার দেখাতে চাইলে সার্চ খালি করতে পারো */}
    {emailQuery && (
      <button
        type="button"
        className="ml-2 bg-gray-300 px-3 py-2 rounded-md"
        onClick={() => {
          setEmailQuery("");
        }}
      >
        View All Users
      </button>
    )}
  </form>

  {/* ইউজার তালিকা */}
  {isLoading ? (
    <p>Loading...</p>
  ) : error ? (
    <p className="text-red-600 mb-3">Error loading users</p>
  ) : (
    displayUsers.length > 0 && (
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
                  {new Date(user.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">{user.role || "user"}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleRoleChange(user._id, user.role)}
                    className={`px-3 py-1 rounded-md text-white ${
                      user.role === "admin"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
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
    )
  )}
</div>

  );
};

export default MakeAdmin;