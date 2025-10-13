import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { Check, X, Pencil, Trash2 } from "lucide-react";

const AdminAllProducts = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const { data } = await axiosSecure.get("/admin/products");
      setProducts(data);
    } catch {
      Swal.fire("Error", "Failed to fetch products", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

const handleApprove = async (id) => {
  try {
    const res = await axiosSecure.put(`/products/${id}/approve`);
    console.log("Product approved:", res.data);
  } catch (err) {
    console.error("Approve error:", err);
  }
};


  const handleReject = async (id) => {
    const { value: reason } = await Swal.fire({
      title: "Reject Product",
      input: "text",
      inputLabel: "Reason for rejection",
      inputPlaceholder: "Enter rejection reason",
      showCancelButton: true,
    });

    if (reason) {
      try {
        await axiosSecure.put(`/products/${id}/reject`, { reason });
        Swal.fire("Rejected", "Product rejected successfully", "success");
        fetchProducts();
      } catch {
        Swal.fire("Error", "Failed to reject product", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/products/${id}`);
          Swal.fire("Deleted!", "Product has been removed.", "success");
          fetchProducts();
        } catch {
          Swal.fire("Error", "Failed to delete product", "error");
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Products (Admin)</h2>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Vendor</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="text-center hover:bg-gray-50">
                <td className="border p-2">
                  <img
                    src={p.image || "https://via.placeholder.com/60"}
                    alt={p.marketName}
                    className="w-14 h-14 object-cover rounded mx-auto"
                  />
                </td>
                <td className="border p-2">{p.marketName}</td>
                <td className="border p-2">{p.vendorName}</td>
                <td className="border p-2 capitalize">{p.status}</td>
                <td className="border p-2 flex gap-2 justify-center flex-wrap">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded disabled:opacity-50"
                    onClick={() => handleApprove(p._id)}
                    disabled={p.status === "approved" || p.status === "rejected"}
                    title="Approve"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded disabled:opacity-50"
                    onClick={() => handleReject(p._id)}
                    disabled={p.status === "approved" || p.status === "rejected"}
                    title="Reject"
                  >
                    <X size={16} />
                  </button>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                    onClick={() =>
                      navigate(`/dashboard/AdminUpdate/${p._id}`)
                    }
                    title="Update"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded"
                    onClick={() => handleDelete(p._id)}
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAllProducts;
