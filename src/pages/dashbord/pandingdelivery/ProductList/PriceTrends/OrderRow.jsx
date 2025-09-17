import React from "react";
import { useNavigate } from "react-router-dom";

const OrderRow = ({ order, onRemove }) => {
  const navigate = useNavigate();

  const handleRemoveClick = () => {
    if (window.confirm(`Are you sure you want to remove "${order.product_name}"?`)) {
      onRemove(order._id);
    }
  };

  const handleAddProductClick = async () => {
    try {
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      const data = await res.json();
      if (data.success) {
        alert(`${order.product_name} added to database`);
        navigate("/addproduct");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition duration-200 border-b">
      <td className="px-6 py-4">{order.product_name}</td>
      <td className="px-6 py-4">{order.marketName}</td>
      <td className="px-6 py-4">{order.final_price}৳</td>
      <td className="px-6 py-4">{order.quantity}</td>
      <td className="px-6 py-4">{order.date}</td>
      <td className="px-6 py-4 space-x-2">
        <button
          onClick={handleRemoveClick}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Remove
        </button>
        <button
          onClick={handleAddProductClick}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
        >
          Add Product
        </button>
      </td>
    </tr>
  );
};

export default OrderRow;
