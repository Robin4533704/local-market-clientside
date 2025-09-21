import React from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiCheckCircle, FiClock } from "react-icons/fi";

const OrderRow = ({ order, onRemove }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    console.log("Navigating with ID:", order._id);
    navigate(`/dashboard/order-details/${order._id}`, { state: { order } });
  };

  return (
    <tr className="hover:bg-gray-50 border-b text-center">
      <td>{order.product_name}</td>
      <td>{order.marketName}</td>
      <td>৳{order.final_price}</td>
      <td>{order.items?.length || 0}</td>
      <td>{new Date(order.date).toLocaleDateString()}</td>
      <td>
        {order.paid ? (
          <span className="text-green-600 flex items-center gap-1">
            Paid <FiCheckCircle />
          </span>
        ) : (
          <span className="text-red-600 flex items-center gap-1">
            Pending <FiClock />
          </span>
        )}
      </td>
      <td className="flex justify-center gap-2">
        <button onClick={handleViewDetails} className="bg-blue-500 text-white px-3 py-1 rounded">
          🔍 
        </button>
        <button onClick={() => onRemove(order._id)} className="bg-red-500 text-white px-3 py-1 rounded">
          <FiTrash2 /> 
        </button>
      </td>
    </tr>
  );
};

export default OrderRow;
