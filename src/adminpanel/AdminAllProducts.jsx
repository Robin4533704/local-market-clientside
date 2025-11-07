import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { Check, X, Pencil, Trash2, Search, Filter, Eye, MoreVertical } from "lucide-react";

const AdminAllProducts = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.get("/admin/products");
      setProducts(data);
    } catch (error) {
      console.error("Fetch products error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to load products",
        text: "There was an error loading the products data.",
        background: '#FEF2F2'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleApprove = async (id, productName) => {
    setActionLoading(id);
    try {
      await axiosSecure.put(`/products/${id}/approve`);
      Swal.fire({
        icon: "success",
        title: "Product Approved!",
        html: `
          <div class="text-center">
            <div class="text-green-500 text-4xl mb-2">✓</div>
            <p><strong>${productName}</strong> has been approved</p>
            <p class="text-sm text-gray-600 mt-2">The product is now visible to customers</p>
          </div>
        `,
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
        background: '#F0F9FF'
      });
      fetchProducts();
    } catch (error) {
      console.error("Approve error:", error);
      Swal.fire({
        icon: "error",
        title: "Approval Failed",
        text: error.response?.data?.message || "Failed to approve product",
        background: '#FEF2F2'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id, productName) => {
    const { value: reason } = await Swal.fire({
      title: "Reject Product",
      html: `
        <div class="text-left">
          <p>Reject <strong>${productName}</strong>?</p>
          <p class="text-sm text-gray-600 mt-2">Please provide a reason for rejection:</p>
        </div>
      `,
      input: "textarea",
      inputLabel: "Rejection Reason",
      inputPlaceholder: "Enter the reason for rejecting this product...",
      inputAttributes: {
        maxlength: "500",
        rows: "4"
      },
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Reject Product",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return 'Please provide a rejection reason';
        }
        if (value.length < 10) {
          return 'Reason must be at least 10 characters long';
        }
      }
    });

    if (reason) {
      setActionLoading(id);
      try {
        await axiosSecure.put(`/products/${id}/reject`, { reason });
        Swal.fire({
          icon: "success",
          title: "Product Rejected",
          html: `
            <div class="text-center">
              <div class="text-red-500 text-4xl mb-2">✗</div>
              <p><strong>${productName}</strong> has been rejected</p>
            </div>
          `,
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true,
          background: '#FEF2F2'
        });
        fetchProducts();
      } catch (error) {
        console.error("Reject error:", error);
        Swal.fire({
          icon: "error",
          title: "Rejection Failed",
          text: error.response?.data?.message || "Failed to reject product",
          background: '#FEF2F2'
        });
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleDelete = async (id, productName) => {
    Swal.fire({
      title: "Delete Product?",
      html: `
        <div class="text-left">
          <p>Are you sure you want to delete <strong>${productName}</strong>?</p>
          <p class="text-sm text-gray-600 mt-2">This action cannot be undone and will permanently remove the product from the system.</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        setActionLoading(id);
        try {
          await axiosSecure.delete(`/products/${id}`);
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            html: `
              <div class="text-center">
                <div class="text-green-500 text-4xl mb-2">✓</div>
                <p><strong>${productName}</strong> has been deleted</p>
              </div>
            `,
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
            background: '#F0F9FF'
          });
          fetchProducts();
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire({
            icon: "error",
            title: "Deletion Failed",
            text: error.response?.data?.message || "Failed to delete product",
            background: '#FEF2F2'
          });
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  const handleViewDetails = (product) => {
    Swal.fire({
      title: product.marketName,
      html: `
        <div class="text-left space-y-3">
          <div class="flex items-center gap-3">
            <img src="${product.image || "https://via.placeholder.com/60"}" 
                 alt="${product.marketName}" 
                 class="w-16 h-16 object-cover rounded-lg">
            <div>
              <p class="font-semibold">${product.marketName}</p>
              <p class="text-sm text-gray-600">${product.vegetable || "N/A"}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label class="font-medium text-gray-700">Vendor</label>
              <p>${product.vendorName}</p>
            </div>
            <div>
              <label class="font-medium text-gray-700">Email</label>
              <p class="truncate">${product.vendorEmail}</p>
            </div>
            <div>
              <label class="font-medium text-gray-700">Status</label>
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}">
                ${product.status}
              </span>
            </div>
            <div>
              <label class="font-medium text-gray-700">Date</label>
              <p>${new Date(product.date).toLocaleDateString()}</p>
            </div>
          </div>
          ${product.marketDescription ? `
            <div>
              <label class="font-medium text-gray-700">Description</label>
              <p class="text-sm text-gray-600">${product.marketDescription}</p>
            </div>
          ` : ''}
          ${product.items && product.items.length > 0 ? `
            <div>
              <label class="font-medium text-gray-700">Items (${product.items.length})</label>
              <div class="max-h-32 overflow-y-auto">
                ${product.items.map(item => `
                  <div class="flex justify-between items-center py-1 border-b">
                    <span>${item.item_name}</span>
                    <span class="text-green-600 font-semibold">$${item.current_price}/${item.unit}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: '500px'
    });
  };

  // Filter and search logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.marketName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.vendorEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.vegetable?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || product.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Statistics
  const stats = {
    total: products.length,
    pending: products.filter(p => p.status === "pending").length,
    approved: products.filter(p => p.status === "approved").length,
    rejected: products.filter(p => p.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Product Management</h1>
          <p className="text-gray-600">Review and manage all vendor products</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <div className="text-right">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {stats.total} Total Products
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Products</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-gray-600">Rejected</div>
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
              placeholder="Search products by name, vendor, or vegetable..."
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
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {currentProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Products Found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "No products available for review"
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
                      Product Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor Information
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
                  {currentProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={product.image || "https://via.placeholder.com/60"}
                            alt={product.marketName}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.marketName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.vegetable || "N/A"}
                            </div>
                            {product.items && product.items.length > 0 && (
                              <div className="text-xs text-gray-400">
                                {product.items.length} item{product.items.length !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{product.vendorName}</div>
                        <div className="text-sm text-gray-500">{product.vendorEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                            {product.status}
                          </span>
                          <div className="text-xs text-gray-500">
                            {new Date(product.date).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleViewDetails(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleApprove(product._id, product.marketName)}
                            disabled={product.status === "approved" || product.status === "rejected" || actionLoading === product._id}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Approve Product"
                          >
                            {actionLoading === product._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(product._id, product.marketName)}
                            disabled={product.status === "approved" || product.status === "rejected" || actionLoading === product._id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Reject Product"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/dashboard/AdminUpdate/${product._id}`)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id, product.marketName)}
                            disabled={actionLoading === product._id}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <div className="p-4 space-y-4">
                {currentProducts.map((product) => (
                  <div key={product._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || "https://via.placeholder.com/60"}
                          alt={product.marketName}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{product.marketName}</h3>
                          <p className="text-sm text-gray-500">{product.vegetable || "N/A"}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Vendor:</span> {product.vendorName}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {product.vendorEmail}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {new Date(product.date).toLocaleDateString()}
                      </div>
                      {product.items && product.items.length > 0 && (
                        <div>
                          <span className="font-medium">Items:</span> {product.items.length}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleViewDetails(product)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Details
                      </button>
                      {product.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(product._id, product.marketName)}
                            disabled={actionLoading === product._id}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1 disabled:bg-green-300"
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(product._id, product.marketName)}
                            disabled={actionLoading === product._id}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1 disabled:bg-red-300"
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => navigate(`/dashboard/AdminUpdate/${product._id}`)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id, product.marketName)}
                        disabled={actionLoading === product._id}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-1 disabled:bg-gray-300"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        {filteredProducts.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredProducts.length)}
                </span>{" "}
                of <span className="font-medium">{filteredProducts.length}</span> products
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
    </div>
  );
};

export default AdminAllProducts;