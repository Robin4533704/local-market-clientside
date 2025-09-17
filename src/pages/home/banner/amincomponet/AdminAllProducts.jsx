import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const AdminAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);

  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/admin/products");
      setProducts(res.data.map((p) => ({ ...p, _id: p._id.toString() })));
    } catch (err) {
      console.error("Failed to fetch products:", err);
      Swal.fire("Error", "Could not fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Approve product
  const handleApprove = async (id) => {
    try {
      await axiosSecure.put(`/products/${id}/approve`);
      Swal.fire("Success", "Product approved", "success");
      fetchProducts();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not approve product", "error");
    }
  };

  // Reject product
  const handleReject = async (id) => {
    try {
      await axiosSecure.put(`/products/${id}/reject`);
      Swal.fire("Success", "Product rejected", "success");
      fetchProducts();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not reject product", "error");
    }
  };

  // Open delete confirmation modal
  const openRemoveModal = (id) => {
    setProductToRemove(id);
    setShowConfirm(true);
  };

  const handleRemove = async () => {
  if (!productToRemove) return;

  console.log("Attempting to delete product with id:", productToRemove);

  try {
    const res = await axiosSecure.delete(`/products/${productToRemove}`);
    console.log("Delete response data:", res.data);

    setShowConfirm(false);
    setProductToRemove(null);
    Swal.fire("Deleted", "Product deleted successfully", "success");
    fetchProducts();
  } catch (err) {
    console.error("Delete error details:", err);
    if (err.response) {
      console.error("Server response:", err.response.data);
      Swal.fire(
        "Error",
        err.response.data?.message || "Could not delete product",
        "error"
      );
    } else if (err.request) {
      console.error("No response received:", err.request);
      Swal.fire("Error", "No response from server", "error");
    } else {
      console.error("Other error:", err.message);
      Swal.fire("Error", err.message, "error");
    }
  }
};


  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Products (Admin)</h2>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Vendor</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-100">
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{product.vendorName}</td>
              <td className="border p-2 capitalize">{product.status}</td>
              <td className="border p-2 flex gap-2">
                {product.status === "pending" && (
                  <>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleApprove(product._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleReject(product._id)}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => navigate(`/edit-product/${product._id}`)}
                >
                  Update
                </button>
                <button
                  className="bg-gray-700 text-white px-2 py-1 rounded"
                  onClick={() => openRemoveModal(product._id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div className="modal bg-black bg-opacity-50 fixed inset-0 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow">
            <p>Are you sure you want to delete this product?</p>
            <div className="flex gap-2 mt-2">
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={handleRemove}
              >
                Yes
              </button>
              <button
                className="bg-gray-400 text-white px-2 py-1 rounded"
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllProducts;
