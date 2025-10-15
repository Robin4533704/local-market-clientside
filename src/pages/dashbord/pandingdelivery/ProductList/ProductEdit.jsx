import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../../loading/Loading";
import useUserRole from "../../../../hooks/useUserRole";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { auth } from "../../../../Firebase.config";

const ProductEdit = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure(); // ✅ secure axios instance
  const { role, loading: roleLoading } = useUserRole();
  const isMounted = useRef(true);

  const initialProduct = location.state?.product || {};
  const [formData, setFormData] = useState({
    product_name: "",
    image: "",
    final_price: "",
    marketName: "",
    vendorName: "",
    count: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Role-based redirect
  useEffect(() => {
    if (roleLoading) return;
    if (role !== "admin") {
      Swal.fire("Access Denied", "You are not authorized to edit products", "error");
      navigate("/");
    }
  }, [role, roleLoading, navigate]);

  // Fetch product data
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get(`/products/${id}`);
        const data = res.data;
        setFormData({
          product_name: data.product_name || "",
          image: data.image || "",
          final_price: data.final_price || "",
          marketName: data.marketName || "",
          vendorName: data.vendorName || "",
          count: data.count || 0,
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load product data", "error");
        navigate("/productlist");
      } finally {
        setLoading(false);
      }
    };

    if (!initialProduct || Object.keys(initialProduct).length === 0) {
      fetchProduct();
    } else {
      setFormData(initialProduct);
    }
  }, [id, initialProduct, axiosSecure, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const { _id, ...updateData } = formData;

    // Firebase থেকে fresh token নাও
    const token = await auth.currentUser.getIdToken(true);
    console.log("Token being sent:", token); // ✅ এখানে debug করো

    await axiosSecure.put(`/products/${id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Swal.fire("Success", "Product updated successfully!", "success");
    navigate("/productlist");
  } catch (err) {
    console.error("Update error:", err);
    Swal.fire("Error", "Failed to update product", "error");
  } finally {
    setLoading(false);
  }
};


  if (loading || roleLoading) return <Loading />;

  return (
    <div className="pt-16 px-4 md:px-20 min-h-screen bg-[#f5deb3]">
      <h2 className="text-3xl font-bold mb-6 text-center">Edit Product</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto flex flex-col gap-4"
      >
        <input
          type="text"
          name="product_name"
          placeholder="Product Name"
          value={formData.product_name}
          onChange={handleChange}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          name="final_price"
          placeholder="Final Price"
          value={formData.final_price}
          onChange={handleChange}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          name="marketName"
          placeholder="Market Name"
          value={formData.marketName}
          onChange={handleChange}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="vendorName"
          placeholder="Vendor Name"
          value={formData.vendorName}
          onChange={handleChange}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          name="count"
          placeholder="Quantity"
          value={formData.count}
          onChange={handleChange}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="bg-lime-500 hover:bg-lime-600 text-white py-3 rounded-lg font-semibold mt-4 transition-all"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default ProductEdit;
