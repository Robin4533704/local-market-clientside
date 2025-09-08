import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
const userAxios = useAxios()
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await userAxios.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found</p>;

  // Determine order stage
  let statusMessage = "Pending";
  if (order.riderAccepted) statusMessage = "Rider Accepted - On the way";
  else if (order.adminAccepted) statusMessage = "Admin Accepted - Awaiting Rider";
  else if (order.status) statusMessage = order.status;

  return (
    <div className="pt-24 p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Status:</strong> {statusMessage}</p>
      <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Products</h2>
      {order.products && order.products.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">#</th>
              <th className="border border-gray-300 p-2">Product Name</th>
              <th className="border border-gray-300 p-2">Quantity</th>
              <th className="border border-gray-300 p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((p, idx) => (
              <tr key={idx} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2 text-center">{idx + 1}</td>
                <td className="border border-gray-300 p-2">{p.name}</td>
                <td className="border border-gray-300 p-2 text-center">{p.quantity}</td>
                <td className="border border-gray-300 p-2 text-right">${p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products found in this order.</p>
      )}
    </div>
  );
};

export default OrderDetails;
