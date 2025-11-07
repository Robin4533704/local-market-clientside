import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { Check, X, Trash2, Search, Filter, Eye, Calendar, User, Package, DollarSign, MoreVertical } from "lucide-react";

const AdminAllOrders = () => {
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get("/admin/orders");
      setOrders(data);
    } catch (err) {
      console.error("Fetch orders error:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to Load Orders",
        text: "There was an error loading the orders data.",
        background: '#FEF2F2'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const handleStatusUpdate = async (order, newStatus) => {
    const { _id, customerName, customerEmail, status: currentStatus } = order;
    
    if (currentStatus === newStatus) {
      Swal.fire({
        icon: "info",
        title: "Status Unchanged",
        text: `Order is already ${newStatus}`,
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const confirm = await Swal.fire({
      title: `Update Order Status?`,
      html: `
        <div class="text-left">
          <p>Change order status from <span class="font-semibold">${currentStatus}</span> to <span class="font-semibold">${newStatus}</span>?</p>
          <div class="mt-3 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">
              Customer: <strong>${customerName || customerEmail}</strong><br>
              Order ID: <strong>${_id.slice(-8)}</strong>
            </p>
          </div>
          ${newStatus === "cancelled" ? `
            <p class="mt-2 text-sm text-red-600">
              ⚠️ This will cancel the order and may require refund processing.
            </p>
          ` : ''}
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: newStatus === "completed" ? "#10B981" : "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: `Mark as ${newStatus}`,
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setActionLoading(_id);
    try {
      await axiosSecure.put(`/admin/orders/${_id}/status`, { status: newStatus });
      Swal.fire({
        icon: "success",
        title: "Status Updated!",
        html: `
          <div class="text-center">
            <div class="text-green-500 text-4xl mb-2">✓</div>
            <p>Order marked as <strong>${newStatus}</strong></p>
          </div>
        `,
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
        background: '#F0F9FF'
      });
      fetchOrders();
    } catch (err) {
      console.error("Status update error:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.message || "Failed to update order status",
        background: '#FEF2F2'
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Delete order
  const handleDelete = async (order) => {
    const { _id, customerName, customerEmail, total } = order;
    
    const confirm = await Swal.fire({
      title: "Delete Order?",
      html: `
        <div class="text-left">
          <p>Are you sure you want to delete this order?</p>
          <div class="mt-3 p-3 bg-red-50 rounded-lg">
            <p class="text-sm text-red-800">
              <strong>Customer:</strong> ${customerName || customerEmail}<br>
              <strong>Order ID:</strong> ${_id.slice(-8)}<br>
              <strong>Amount:</strong> $${total || 0}<br>
            </p>
          </div>
          <p class="mt-2 text-sm text-red-600">
            ⚠️ This action cannot be undone and will permanently remove the order from the system.
          </p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true
    });

    if (confirm.isConfirmed) {
      setActionLoading(_id);
      try {
        await axiosSecure.delete(`/admin/orders/${_id}`);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          html: `
            <div class="text-center">
              <div class="text-green-500 text-4xl mb-2">✓</div>
              <p>Order has been deleted</p>
            </div>
          `,
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true,
          background: '#F0F9FF'
        });
        fetchOrders();
      } catch (err) {
        console.error("Delete order error:", err);
        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text: err.response?.data?.message || "Failed to delete order",
          background: '#FEF2F2'
        });
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  // Filter and search logic
  const filteredOrders = orders.filter(order => {
    const customerName = order.customerName || "";
    const customerEmail = order.customerEmail || "";
    const orderId = order._id || "";
    
    const matchesSearch = 
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Get status color and icon
  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <Check className="h-3 w-3" />
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <Package className="h-3 w-3" />
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <X className="h-3 w-3" />
        };
      case "processing":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <Package className="h-3 w-3" />
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <Package className="h-3 w-3" />
        };
    }
  };

  // Statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(order => order.status === "pending").length,
    completed: orders.filter(order => order.status === "completed").length,
    cancelled: orders.filter(order => order.status === "cancelled").length,
    totalRevenue: orders
      .filter(order => order.status === "completed")
      .reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0)
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Order Management</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <div className="text-right">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {stats.total} Total Orders
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalRevenue)}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders by customer name, email, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {currentOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Package className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "No orders available"
              }
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items & Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status & Date
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    return (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            Order #{order._id.slice(-8)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(order.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{order.customerName || "N/A"}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                          </div>
                          <div className="text-sm font-semibold text-green-600">
                            {formatCurrency(order.total)}
                          </div>
                          {order.items && order.items.slice(0, 2).map((item, i) => (
                            <div key={i} className="text-xs text-gray-500 truncate">
                              {item.item_name} (x{item.quantity || 1})
                            </div>
                          ))}
                          {order.items && order.items.length > 2 && (
                            <div className="text-xs text-gray-400">
                              +{order.items.length - 2} more items
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${statusConfig.color}`}>
                              {statusConfig.icon}
                              {order.status}
                            </span>
                            <div className="text-xs text-gray-500">
                              {formatDate(order.date)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {order.status !== "completed" && order.status !== "cancelled" && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(order, "completed")}
                                  disabled={actionLoading === order._id}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Mark as Completed"
                                >
                                  {actionLoading === order._id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                  ) : (
                                    <Check className="h-4 w-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(order, "cancelled")}
                                  disabled={actionLoading === order._id}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Cancel Order"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(order)}
                              disabled={actionLoading === order._id}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete Order"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <div className="p-4 space-y-4">
                {currentOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  return (
                    <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Order #{order._id.slice(-8)}
                          </h3>
                          <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${statusConfig.color}`}>
                          {statusConfig.icon}
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{order.customerName || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-green-600">{formatCurrency(order.total)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span>{order.items?.length || 0} items</span>
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {order.customerEmail}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          Details
                        </button>
                        {order.status !== "completed" && order.status !== "cancelled" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(order, "completed")}
                              disabled={actionLoading === order._id}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1 disabled:bg-green-300"
                            >
                              <Check className="h-4 w-4" />
                              Complete
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(order, "cancelled")}
                              disabled={actionLoading === order._id}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1 disabled:bg-red-300"
                            >
                              <X className="h-4 w-4" />
                              Cancel
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(order)}
                          disabled={actionLoading === order._id}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1 disabled:bg-gray-300"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        {filteredOrders.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredOrders.length)}
                </span>{" "}
                of <span className="font-medium">{filteredOrders.length}</span> orders
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border rounded-lg ${
                        currentPage === pageNum
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Order Details</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Order Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium">#{selectedOrder._id.slice(-8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusConfig(selectedOrder.status).color}`}>
                          {getStatusConfig(selectedOrder.status).icon}
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium">{formatDate(selectedOrder.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Customer Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer Name:</span>
                        <span className="font-medium">{selectedOrder.customerName || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedOrder.customerEmail}</span>
                      </div>
                      {selectedOrder.customerPhone && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{selectedOrder.customerPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Order Items</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Item</th>
                          <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Quantity</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Price</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedOrder.items?.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">{item.item_name}</div>
                              {item.description && (
                                <div className="text-sm text-gray-500">{item.description}</div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-900">
                              {item.quantity || 1}
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-900">
                              {formatCurrency(item.current_price)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                              {formatCurrency((item.current_price || 0) * (item.quantity || 1))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                            Total:
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-bold text-green-600">
                            {formatCurrency(selectedOrder.total)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {selectedOrder.status !== "completed" && selectedOrder.status !== "cancelled" && (
                      <>
                        <button
                          onClick={() => {
                            handleStatusUpdate(selectedOrder, "completed");
                            closeModal();
                          }}
                          disabled={actionLoading === selectedOrder._id}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-green-300"
                        >
                          <Check className="h-5 w-5" />
                          Mark as Completed
                        </button>
                        <button
                          onClick={() => {
                            handleStatusUpdate(selectedOrder, "cancelled");
                            closeModal();
                          }}
                          disabled={actionLoading === selectedOrder._id}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-red-300"
                        >
                          <X className="h-5 w-5" />
                          Cancel Order
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        handleDelete(selectedOrder);
                        closeModal();
                      }}
                      disabled={actionLoading === selectedOrder._id}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300"
                    >
                      <Trash2 className="h-5 w-5" />
                      Delete Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllOrders;