import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Swal from "sweetalert2";
import { getAuth } from "firebase/auth"; // Firebase auth import
import useAxios from "../../../../hooks/useAxios";

const PriceTrends = () => {
  const axiosInstance = useAxios();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
const fetchTrackedItems = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Swal.fire("Error", "User not logged in", "error");
      setLoading(false);
      return;
    }

    // Force refresh token to avoid expired token
    const token = await user.getIdToken(true); 

    const res = await axiosInstance.get("/tracked-items", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setItems(res.data || []);
    if (res.data?.length) setSelected(res.data[0]);
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to load tracked items", "error");
  } finally {
    setLoading(false);
  }
};

    fetchTrackedItems();
  }, [axiosInstance]);

  if (loading) return <p className="pt-24 px-4">Loading...</p>;
  if (!items.length) return <p className="pt-24 px-4">No tracked items found.</p>;

  // ✅ priceHistory merge করে চার্ট ডাটা বানানো
  const mergedData = useMemo(() => {
    if (!selected?.traders) return [];

    const dateMap = {};
    selected.traders.forEach((trader) => {
      trader.priceHistory?.forEach((entry) => {
        const date = new Date(entry.date).toISOString().split("T")[0]; // clean date
        if (!dateMap[date]) dateMap[date] = { date };
        dateMap[date][trader.name] = entry.price;
      });
    });

    // তারিখ sort করে array বানানো
    return Object.values(dateMap).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [selected]);

  // ✅ রঙের লিস্ট
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ff7300",
    "#ffc658",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
  ];

  return (
    <div className="pt-24 px-4 md:px-20 flex flex-col md:flex-row gap-6">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/4 bg-gray-100 rounded p-4">
        <h3 className="text-lg font-bold mb-4">Tracked Items</h3>
        <ul>
          {items.map((item) => (
            <li
              key={item._id}
              onClick={() => setSelected(item)}
              className={`p-2 rounded cursor-pointer mb-2 ${
                selected?._id === item._id
                  ? "bg-blue-200 font-semibold"
                  : "bg-white"
              }`}
            >
              {item.productName}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Chart Panel */}
      <div className="flex-1 bg-white rounded shadow p-4">
        {selected && (
          <>
            <h2 className="text-xl font-bold mb-2">🥕 {selected.productName}</h2>
            <p className="text-gray-600 mb-4">Market: {selected.marketName}</p>

            {mergedData.length ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={mergedData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />

                  {selected.traders.map((trader, idx) => (
                    <Line
                      key={trader.name}
                      type="monotone"
                      dataKey={trader.name}
                      stroke={colors[idx % colors.length]}
                      dot={false}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>No price data available.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PriceTrends;
