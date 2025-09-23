import React from "react";
import axios from "axios";

const AdminOrderRow = ({ order, fetchOrders }) => {
  const handleAccept = async () => {
    try {
      await axios.post(`https://daily-local-market-server.vercel.app/orders/${order._id}/admin-accept`);
      alert("Order accepted, notification sent to rider");
      fetchOrders(); // refresh orders list
    } catch (err) {
      console.error(err);
      alert("Failed to accept order");
    }
  };

  return (
    <tr>
      <td>{order._id}</td>
      <td>{order.userName}</td>
      <td>{order.status}</td>
      <td>
        {order.status === "pending" && (
          <button onClick={handleAccept} className="bg-blue-500 text-white px-3 py-1 rounded">
            Accept
          </button>
        )}
      </td>
    </tr>
  );
};

export default AdminOrderRow;
