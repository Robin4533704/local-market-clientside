import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../../../hooks/UseAxiosSecure";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosInstance = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/orders"); // get all orders
        setOrders(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [axiosInstance]);

  const handleViewDetails = (order) => {
    console.log("Navigating with ID:", order._id);
    navigate(`/dashboard/order-details/${order._id}`, { state: { order } });
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!orders.length) return <p className="text-center mt-10">No orders found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th>Products</th>
            <th>Total</th>
            <th>Payment Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.products?.map(p => p.name).join(", ") || "No products"}</td>
              <td>৳{order.total || 0}</td>
              <td>{order.paymentStatus || "Pending"}</td>
              <td>
                <button
                  onClick={() => handleViewDetails(order)}
                  className="btn btn-sm btn-primary"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrders;
