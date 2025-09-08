import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch notifications from server
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();

    // Socket.io connection
    const socket = io("http://localhost:5000");
    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  const handleClick = async (notif) => {
    // If notification has related order, navigate to it
    if (notif.relatedOrder) {
      navigate(`/orders/${notif.relatedOrder}`);
    }

    // Mark notification as read in DB
    try {
      await axios.patch(`http://localhost:5000/notifications/${notif._id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notif._id ? { ...n, status: "read" } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const unreadCount = notifications.filter(n => n.status !== "read").length;

  return (
    <div className="relative">
      <button className="relative">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border shadow-lg rounded">
        {notifications.length === 0 ? (
          <p className="p-2 text-gray-500">No notifications</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleClick(notif)}
              className={`p-2 border-b cursor-pointer hover:bg-gray-100 ${
                notif.status !== "read" ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              <p>{notif.message}</p>
              <small className="text-gray-500">
                {new Date(notif.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationBell;
