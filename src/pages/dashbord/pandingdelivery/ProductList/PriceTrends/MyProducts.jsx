import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useUserRole from "../../../../../hooks/useUserRole";
import useAxiosSecure from "../../../../../hooks/UseAxiosSecure";
import Loading from "../../../../loading/Loading";

const MyProducts = () => {
  const { role, loading: roleLoading } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosSecure.get("/vendor/products");
      setProducts(data);
    } catch (err) {
      console.error("Fetch My Products Error:", err);
      Swal.fire("Error", "Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "vendor") fetchProducts();
  }, [role]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete product?",
      text: "This will delete the entire product with all its items",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/vendor/products/${id}`);
      Swal.fire("Deleted!", "Product deleted successfully", "success");
      fetchProducts();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete product", "error");
    }
  };

  // Function to get status badge color
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

  if (roleLoading || loading) return <Loading />;
  if (role !== "vendor") return <p className="text-center text-red-500 mt-8">Access denied</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
        <button
          onClick={() => navigate("/dashboard/add-product")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span>+</span> Add New Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">No products found</p>
          <button
            onClick={() => navigate("/dashboard/add-product")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Market & Vegetable
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.items[0]?.image ? (
                          <img
                            src={product.items[0].image}
                            alt={product.items[0].item_name}
                            className="h-12 w-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.vendorName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.vendorEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {product.marketName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.vegetable}
                      </div>
                      {product.marketDescription && (
                        <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                          {product.marketDescription}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2 max-w-md">
                        {product.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm border-b pb-2 last:border-b-0 last:pb-0">
                            <div className="flex items-center gap-2">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.item_name}
                                  className="h-8 w-8 object-cover rounded"
                                />
                              )}
                              <span className="font-medium">{item.item_name}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-green-600">
                                ${item.current_price}
                              </div>
                              <div className="text-xs text-gray-500">
                                per {item.unit}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(product.date).toLocaleDateString()}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/update-product/${product._id}`)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {products.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{products.length}</div>
            <div className="text-sm text-blue-800">Total Products</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.status === 'approved').length}
            </div>
            <div className="text-sm text-green-800">Approved</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {products.filter(p => p.status === 'pending').length}
            </div>
            <div className="text-sm text-yellow-800">Pending</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {products.filter(p => p.status === 'rejected').length}
            </div>
            <div className="text-sm text-red-800">Rejected</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;