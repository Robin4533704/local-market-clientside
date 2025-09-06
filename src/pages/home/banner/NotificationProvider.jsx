import React, { createContext, useState, useEffect } from "react";
import UseAuth from "../hooks/UseAuth";
import axios from "axios";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = UseAuth();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    if (!user?.role) return;
    try {
      const res = await axios.get(`http://localhost:5000/notifications?toRole=${user.role}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Fetch Notifications Error:", err.message);
    }
  };

  useEffect(() => {
    if (!user?.role) return;

    fetchNotifications(); // initial fetch
    const interval = setInterval(fetchNotifications, 10000); // polling every 10s

    return () => clearInterval(interval);
  }, [user?.role]);

  return (
    <NotificationContext.Provider value={{ notifications, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
