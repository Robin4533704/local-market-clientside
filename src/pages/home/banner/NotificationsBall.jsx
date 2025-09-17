import React, { useContext, useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "./NotificationProvider";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Backend socket connection

const NotificationBell = () => {
  const { notifications, setNotifications, unreadCount, setUnreadCount, markAllRead } =
    useContext(NotificationContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Live socket listener for incoming notifications
  useEffect(() => {
    socket.on("notification", (data) => {
      // prepend new notification
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off("notification");
    };
  }, [setNotifications, setUnreadCount]);

  const toggleDropdown = () => {
    setOpen(!open);
    if (!open) markAllRead(); // dropdown open হলে unread count reset
  };

  const handleNotificationClick = (notification) => {
    markAllRead(); // mark all as read
    if (notification.relatedOrder) {
      navigate(`/orders/${notification.relatedOrder}`); // navigate to order details
    } else {
      console.log("No related order ID for this notification");
    }
    setOpen(false); // dropdown বন্ধ করা
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="relative">
        <FaBell className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto z-50">
          {notifications.length === 0 && <p className="p-2">No notifications</p>}
          {notifications.map((n, idx) => (
            <div
              key={idx}
              className="border-b p-2 text-sm hover:bg-amber-500 cursor-pointer"
              onClick={() => handleNotificationClick(n)}
            >
              {n.message}
              <div className="text-blue-400 text-xs">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
