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
      showCancelButton: true,
      confirmButtonText: "Yes",
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

  if (roleLoading || loading) return <Loading />;
  if (role !== "vendor") return <p>Access denied</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Products</h2>
      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border px-2 py-1">Image</th>
              <th className="border px-2 py-1">Item Name</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const firstItem = p.items[0];
              return (
                <tr key={p._id} className="text-center">
                  <td className="border px-2 py-1">
                    {firstItem?.image ? (
                      <img
                        src={firstItem.image}
                        alt={firstItem.item_name}
                        className="h-12 w-12 object-cover mx-auto rounded"
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="border px-2 py-1">{firstItem?.item_name || "-"}</td>
                  <td className="border px-2 py-1">{firstItem?.current_price} / {firstItem?.unit}</td>
                  <td className="border px-2 py-1">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="border px-2 py-1">{p.status}</td>
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => navigate(`/dashboard/update-product/${p._id}`)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-1"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyProducts;
