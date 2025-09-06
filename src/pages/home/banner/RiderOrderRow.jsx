import React from "react";
import axios from "axios";

const RiderOrderRow = ({ order, fetchOrders }) => {
  const handleAccept = async () => {
    try {
      await axios.post(`http://localhost:5000/orders/${order._id}/rider-accept`);
      alert("Order accepted, notification sent to user");
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
        {order.status === "acceptedByAdmin" && (
          <button onClick={handleAccept} className="bg-green-500 text-white px-3 py-1 rounded">
            Accept
          </button>
        )}
      </td>
    </tr>
  );
};

export default RiderOrderRow;
