import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import UseAuth from "../hooks/UseAuth";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = UseAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user?.role) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/notifications?toRole=${user.role}`);
        console.log("User role:", user.role); 
        setNotifications(res.data);
      } catch (err) {
        console.error("Fetch Notifications Error:", err.message);
      }
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [user]);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
