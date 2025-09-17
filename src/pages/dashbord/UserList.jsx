// components/admin/UserList.jsx
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";

const UserList = () => {
  const axiosInstance = useAxios();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosInstance.get("/admin/users");
        setUsers(data);
      } catch {
        toast.error("Failed to load users");
      }
    };
    fetchUsers();
  }, [axiosInstance]);

  const handleMakeVendor = async (userId) => {
    if (!window.confirm("Are you sure to make this user a Vendor?")) return;
    try {
      await axiosInstance.put(`/admin/make-vendor/${userId}`);
      setUsers(users.map(u => u._id === userId ? { ...u, role: "vendor" } : u));
      toast.success("User promoted to Vendor!");
    } catch {
      toast.error("Failed to promote user");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b">
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.role !== "vendor" && (
                  <button
                    onClick={() => handleMakeVendor(u._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Make Vendor
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
