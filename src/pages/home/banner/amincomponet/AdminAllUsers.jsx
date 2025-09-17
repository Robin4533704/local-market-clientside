import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../../../hooks/useAxios";
import { getAuth } from "firebase/auth";
import Loading from "../../../loading/Loading";

const AdminAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const reqInterceptor = useAxios();

  // সব user fetch করা
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Admin not logged in");

      const token = await user.getIdToken(true);

      const res = await reqInterceptor.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      Swal.fire("Error", "Could not fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // user role update করা
  const handleUpdateRole = async (id, newRole) => {
    try {
      await reqInterceptor.put(`/users/${id}/role`, { role: newRole });
      Swal.fire("Success", "User role updated", "success");
      fetchUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not update role", "error");
    }
  };

  if (loading) return <div><Loading/> </div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Users (Admin)</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100">
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2 flex gap-2">
                  {user.role !== "admin" && (
                    <>
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => handleUpdateRole(user._id, "admin")}
                      >
                        Make Admin
                      </button>
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => handleUpdateRole(user._id, "vendor")}
                      >
                        Make Vendor
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAllUsers;
