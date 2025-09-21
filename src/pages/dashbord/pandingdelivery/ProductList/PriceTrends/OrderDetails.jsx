import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import useAxiosSecure from "../../../../../hooks/UseAxiosSecure";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const OrderDetails = () => {
  const { id } = useParams(); // MongoDB _id
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const axios = useAxiosSecure();

  // Price trend data
  const [priceTrend, setPriceTrend] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!order) {
          const { data } = await axios.get(`/orders/${id}`); // backend: _id
          setOrder(data);
          preparePriceTrend(data);
        } else {
          preparePriceTrend(order);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const preparePriceTrend = (orderData) => {
     
      if (orderData.items && orderData.items.length > 0) {
        const trendData = orderData.items.map((item) => ({
          name: item.item_name,
          price: item.price,
        }));
        setPriceTrend(trendData);
      } else {
        setPriceTrend([{ name: orderData.product_name, price: orderData.final_price }]);
      }
    };

    fetchOrder();
  }, [id, order]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      <div className="mb-6">
        <p><strong>Product Name:</strong> {order.product_name}</p>
        <p><strong>Market:</strong> {order.marketName}</p>
        <p><strong>Price:</strong> ৳{order.final_price}</p>
        <p>
          <strong>Items:</strong> {order.items?.map(i => `${i.item_name} (${i.unit})`).join(", ") || "No items"}
        </p>
        <p><strong>Status:</strong> {order.paid ? "Paid" : "Pending"}</p>
        <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Price Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={priceTrend}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderDetails;
