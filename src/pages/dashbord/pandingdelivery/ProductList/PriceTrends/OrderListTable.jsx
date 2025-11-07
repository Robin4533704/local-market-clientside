import React, { useEffect, useState } from "react";
import OrderRow from "./OrderRow";
import { 
  FaShoppingBag, 
  FaBox, 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt,
  FaDollarSign,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaTruck
} from "react-icons/fa";

const OrderListTable = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    const loadOrders = () => {
      try {
        const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        // Sort by date (newest first) by default
        const sortedOrders = storedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = orders;

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.product_name?.toLowerCase().includes(term) ||
        order.marketName?.toLowerCase().includes(term) ||
        order.tracking_id?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date) - new Date(a.date);
        case "price":
          return (b.final_price || 0) - (a.final_price || 0);
        case "name":
          return (a.product_name || "").localeCompare(b.product_name || "");
        default:
          return 0;
      }
    });

    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, sortBy]);

  const handleRemove = (id) => {
    const updatedOrders = orders.filter((order) => order._id !== id);
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      confirmed: orders.filter(order => order.status === "confirmed").length,
      pending: orders.filter(order => order.status === "pending").length,
      shipped: orders.filter(order => order.status === "shipped").length,
      delivered: orders.filter(order => order.status === "delivered").length,
      cancelled: orders.filter(order => order.status === "cancelled").length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <FaCheckCircle className="text-green-500" />;
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "shipped":
        return <FaTruck className="text-blue-500" />;
      case "delivered":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="pt-24 px-4 md:px-8 lg:px-16">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-4">
            <FaShoppingBag className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            My Orders
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Track and manage all your purchases in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { status: "all", label: "Total", count: statusCounts.all, color: "bg-gradient-to-r from-blue-500 to-purple-500" },
            { status: "confirmed", label: "Confirmed", count: statusCounts.confirmed, color: "bg-gradient-to-r from-green-500 to-emerald-500" },
            { status: "pending", label: "Pending", count: statusCounts.pending, color: "bg-gradient-to-r from-yellow-500 to-orange-500" },
            { status: "shipped", label: "Shipped", count: statusCounts.shipped, color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
            { status: "delivered", label: "Delivered", count: statusCounts.delivered, color: "bg-gradient-to-r from-green-500 to-teal-500" },
            { status: "cancelled", label: "Cancelled", count: statusCounts.cancelled, color: "bg-gradient-to-r from-red-500 to-pink-500" },
          ].map((stat) => (
            <div
              key={stat.status}
              className={`${stat.color} text-white rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
              onClick={() => setStatusFilter(stat.status)}
            >
              <div className="text-2xl font-bold mb-1">{stat.count}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                ▼
              </div>
            </div>

            {/* Sort By */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none"
              >
                <option value="date">Sort by Date</option>
                <option value="price">Sort by Price</option>
                <option value="name">Sort by Name</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Orders Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBox className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm || statusFilter !== "all" ? "No matching orders found" : "No orders yet"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Start shopping to see your orders here"
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Product Details
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Market Info
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <FaDollarSign className="text-green-500" />
                            Price
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="text-blue-500" />
                            Date
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <OrderRow key={order._id} order={order} onRemove={handleRemove} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden">
                <div className="p-4 space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-lg mb-1">
                            {order.product_name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {order.marketName}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Qty: {order.quantity}</span>
                            <span>${Number(order.final_price || 0).toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-2 justify-end">
                            {getStatusIcon(order.status)}
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              order.status === "confirmed" ? "bg-green-100 text-green-800" :
                              order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                              order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                              order.status === "delivered" ? "bg-green-100 text-green-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {order.status || "pending"}
                            </span>
                          </div>
                          <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                            order.paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {order.paid ? "Paid" : "Pending"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => handleRemove(order._id)}
                          className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                  <span>
                    Showing {filteredOrders.length} of {orders.length} orders
                  </span>
                  {searchTerm && (
                    <span className="text-blue-600 font-medium">
                      Search: "{searchTerm}"
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Help Section */}
        {orders.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <FaExclamationTriangle className="text-blue-500" />
              Need Help With Your Orders?
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <p className="font-medium mb-2">Order Issues</p>
                <ul className="space-y-1">
                  <li>• Track your package delivery</li>
                  <li>• Request order cancellation</li>
                  <li>• Report missing items</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Support</p>
                <ul className="space-y-1">
                  <li>• Contact customer service</li>
                  <li>• Return policy information</li>
                  <li>• Payment assistance</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderListTable;