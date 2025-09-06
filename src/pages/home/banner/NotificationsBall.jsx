import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";
import Loading from "../../loading/Loading";

const NotificationsBall = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/notifications?toRole=${user.role}`);
        setNotifications(res.data || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  if (loading) return <p> <Loading/> </p>;

  const unreadCount = notifications.filter(n => n.status === "unread").length;

  return (
    <div className="relative inline-block">
      <Bell size={28} className="text-amber-400" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationsBall;
