import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAxios from "../../../../../hooks/useAxios";

const MyOrders = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders");
        setOrders(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [axiosInstance]);

  if (loading) return <p className="pt-24 px-4">Loading orders...</p>;
  if (!orders.length) return <p className="pt-24 px-4">No orders found.</p>;

  return (
    <div className="pt-24 px-4 md:px-20">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Product</th>
              <th className="border px-4 py-2">Market</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border px-4 py-2">{order.product_name}</td>
                <td className="border px-4 py-2">{order.marketName}</td>
                <td className="border px-4 py-2">{order.final_price}</td>
                <td className="border px-4 py-2">{order.date}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => navigate(`/order/${order._id}`)}
                    className="bg-blue-500 text-white px-2 rounded"
                  >
                    🔍 View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;
