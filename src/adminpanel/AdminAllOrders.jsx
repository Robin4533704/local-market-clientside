import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { Check, X, Trash2 } from "lucide-react";

const AdminAllOrders = () => {
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const { data } = await axiosSecure.get("/admin/orders");
      setOrders(data);
    } catch (err) {
      console.error("Fetch orders error:", err);
      Swal.fire("Error", "Failed to fetch orders", "error");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosSecure.put(`/admin/orders/${id}/status`, { status: newStatus });
      Swal.fire("Success", `Order ${newStatus}`, "success");
      fetchOrders();
    } catch (err) {
      console.error("Status update error:", err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  // Delete order
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This order will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/admin/orders/${id}`);
        Swal.fire("Deleted!", "Order has been removed.", "success");
        fetchOrders();
      } catch (err) {
        console.error("Delete order error:", err);
        Swal.fire("Error", "Failed to delete order", "error");
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Orders (Admin)</h2>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Items</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-center hover:bg-gray-50">
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">{order.customerName || order.customerEmail}</td>
                <td className="border p-2">
                  {order.items?.map((item, i) => (
                    <div key={i}>{item.item_name} ({item.quantity || 1})</div>
                  ))}
                </td>
                <td className="border p-2">${order.total || 0}</td>
                <td className="border p-2 capitalize">{order.status}</td>
                <td className="border p-2">
                  {order.date ? new Date(order.date).toLocaleString() : "N/A"}
                </td>
                <td className="border p-2 flex gap-2 justify-center flex-wrap">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded disabled:opacity-50"
                    onClick={() => handleStatusUpdate(order._id, "completed")}
                    disabled={order.status === "completed" || order.status === "cancelled"}
                    title="Mark Completed"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded disabled:opacity-50"
                    onClick={() => handleStatusUpdate(order._id, "cancelled")}
                    disabled={order.status === "completed" || order.status === "cancelled"}
                    title="Cancel"
                  >
                    <X size={16} />
                  </button>
                  <button
                    className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded"
                    onClick={() => handleDelete(order._id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAllOrders;
