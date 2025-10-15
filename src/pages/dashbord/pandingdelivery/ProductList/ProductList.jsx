import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaStar, FaCalendarAlt, FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";
import Swal from "sweetalert2";
import Loading from "../../../loading/Loading";
import UseAuth from "../../../../hooks/UseAuth";
import { ProductContext } from "../../paymentmethod/productContext/ProductContext";
import useAxios from "../../../../hooks/useAxios";
import useUserRole from "../../../../hooks/useUserRole";

const ProductList = () => {
  const { products, setProducts, loading } = useContext(ProductContext);
  const navigate = useNavigate();
  const { user } = UseAuth(); 
  const { role } = useUserRole();
  const axiosInstance = useAxios();

  const handleDetails = (product) => {
    if (!user) return navigate("/login");
    navigate(`/product-details/${product._id}`, { state: { product } });
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosInstance.delete(`/products/${id}`);
        Swal.fire("Deleted!", "Product has been deleted.", "success");
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete product", "error");
      }
    }
  };

  const handleEdit = (product) => {
    navigate(`/editproducts/${product._id}`, { state: { product } });
  };

  if (loading) return <Loading />;

  return (
    <div className="pt-16 px-4 md:px-20 bg-[#f5deb3] min-h-screen">
      {/* Header + Breadcrumb */}
      <div className="flex justify-between items-center mb-8 bg-gray-100 p-8 rounded-lg shadow-md">
        <div>
          <NavLink to="/" className="text-black btn hover:underline mr-2">Home</NavLink>
          <span className="btn">Products</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid pb-2 lg:px-20 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-5 mt-8">
        {!products || products.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">
            {loading ? "Loading products..." : "No products found."}
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="relative bg-white rounded-lg shadow-md p-4 cursor-pointer hover:scale-105 transition-transform flex flex-col"
            >
              {/* Product Image */}
              <div className="w-full h-48 sm:h-56 md:h-48 lg:h-56 overflow-hidden rounded-lg mb-3">
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.product_name || "Product"}
                  className="w-full h-full object-cover transition-transform hover:scale-110"
                  onClick={() => handleDetails(product)}
                />
              </div>

              {/* Product Info */}
              <h3 className="font-semibold text-lg mb-1 truncate">{product.product_name || "Unnamed Product"}</h3>
              <div className="flex flex-col gap-1 mb-2 text-sm sm:text-base">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-gray-700">
                    <BsCurrencyDollar /> {product.final_price || 0}
                  </div>

                  {/* Admin Edit/Delete */}
                  {role === "admin" && (
                    <div className="absolute right-2 flex gap-2 items-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                        className="p-2 rounded-full transition-transform transform hover:scale-110 shadow-md bg-yellow-100 hover:bg-yellow-200"
                        title="Edit Product"
                      >
                        <FaEdit className="w-4 h-4 text-yellow-600" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(product._id); }}
                        className="p-2 rounded-full transition-transform transform hover:scale-105 shadow-md"
                        title="Delete Product"
                      >
                        <FaTrashAlt className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 text-yellow-500"><FaStar /> {product.stars || 0}</div>
                <div className="flex items-center gap-1"><MdOutlineInventory2 /> Qty: {product.count || 0}</div>
                <div className="flex items-center gap-1"><FaCalendarAlt /> {new Date(product.date || Date.now()).toLocaleDateString()}</div>
                <div className="flex items-center gap-1">🏪 {product.marketName || "N/A"}</div>
                <div className="flex items-center gap-1">👨‍🌾 {product.vendorName || "N/A"}</div>
              </div>

              {/* View Details Button */}
              <button
                onClick={(e) => { e.stopPropagation(); handleDetails(product); }}
                className="mt-auto w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FaEye size={20} /> View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
