import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.off("notification");
  }, []);

  return (
    <div className="relative">
      <button className="relative">
        🔔
        {notifications.length > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">{notifications.length}</span>}
      </button>
      {notifications.length > 0 && (
        <ul className="absolute mt-2 w-64 bg-white shadow-lg rounded-md">
          {notifications.map((n, i) => (
            <li key={i} className="p-2 border-b last:border-b-0">{n.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
