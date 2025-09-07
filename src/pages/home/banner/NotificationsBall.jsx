import React, { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const NotificationsBall = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user"); // default
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const auth = getAuth();

  // Fetch user & notifications
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Fetch role from backend
        try {
          const resUser = await axios.get(`http://localhost:5000/users/${firebaseUser.uid}`);
          const userRole = resUser.data.role || "user";
          setRole(userRole);

          const resNotifs = await axios.get("http://localhost:5000/notifications", {
            params: { toRole: userRole },
          });
          setNotifications(resNotifs.data);
        } catch (err) {
          console.error("Error fetching notifications or role:", err);
        }
      } else {
        setUser(null);
        setRole("user");
        setNotifications([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-3 bg-gray-200 rounded-full hover:bg-gray-300"
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {open && notifications.length > 0 && (
        <ul className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md border border-gray-200 z-50">
          {notifications.map((notif) => (
            <li key={notif._id} className="px-4 py-2 hover:bg-gray-100 border-b last:border-b-0">
              <p className="text-sm">{notif.message}</p>
              <p className="text-xs text-gray-400">Status: {notif.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsBall;
