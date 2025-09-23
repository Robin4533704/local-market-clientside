import React, { useEffect, useState } from "react";
import { useParams, useLocation, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../../loading/Loading";
import UseAuth from "../../../../hooks/UseAuth";
import useAxios from "../../../../hooks/useAxios";
import { FaShoppingCart } from "react-icons/fa";

const VALID_COUPONS = {
  SAVE10: 10,
  SAVE20: 20,
  FREESHIP: 5,
};

const ProductCard = () => {
  const userUserAxios = useAxios();
  const { id } = useParams();
  const location = useLocation();
  const { user } = UseAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(location.state?.product || null);
  const [quantity, setQuantity] = useState(location.state?.quantity || 1);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState(null);

  // Fetch product if not passed via state
  useEffect(() => {
    if (!product && id) {
      const fetchProduct = async () => {
        try {
          const res = await userUserAxios.get(`/shoppingdata/${id}`);
          if (res.data) setProduct(res.data);
          else setError("Product not found");
        } catch (err) {
          console.error(err);
          setError("Failed to load product");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else setLoading(false);
  }, [id, product, userUserAxios]);

  const handleQuantityChange = (e) => setQuantity(Number(e.target.value));
  const handleCouponChange = (e) => setCoupon(e.target.value);

  const applyCoupon = () => {
    const code = coupon.toUpperCase().trim();
    if (!code) return Swal.fire("Oops!", "Please enter a coupon code", "warning");

    if (VALID_COUPONS[code]) {
      setDiscount(VALID_COUPONS[code]);
      setAppliedCoupon(code);
      Swal.fire("Success!", `Coupon applied: ${code} (${VALID_COUPONS[code]}% off)`, "success");
    } else {
      setDiscount(0);
      setAppliedCoupon("");
      Swal.fire("Error", "Invalid coupon code", "error");
    }
    setCoupon("");
  };

  // Safe price calculation
  const price = Number(product?.final_price ?? product?.price ?? 0);
  const subtotal = price * quantity;
  const totalAfterDiscount = subtotal - (subtotal * discount) / 100;

  const handleCheckout = () => {
    navigate(`/checkout/${product._id}`, {
      state: {
        product,
        quantity,
        subtotal,
        discount,
        total: totalAfterDiscount,
        coupon: appliedCoupon,
      },
    });
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  const imageUrl =
    product.image && !product.image.startsWith("http")
      ? `https://daily-local-market-server.vercel.app${product.image}`
      : product.image || "/placeholder.png";

  return (
    <div className="pt-26 px-4 md:px-20 bg-[#f5f0e1] min-h-screen font-sans">
      <div className="mb-6 text-sm">
        <NavLink to="/" className="text-black btn">Home</NavLink>
        <span className="ml-2 btn">Cart</span>
      </div>

      <h1 className="text-3xl font-semibold text-center mb-8">{product?.product_name || "No Title"}</h1>

      <div className="overflow-x-auto mb-8">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-[#d3c7b9] h-12">
              <th className="border px-4 py-2">Product</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#e7e2d9]">
              <td className="border px-4 py-2 flex items-center gap-4">
                <img
                  src={imageUrl}
                  alt={product.product_name || "No Name"}
                  className="w-60 h-60 object-cover rounded shadow"
                />
                <span className="text-lg font-medium">{product?.product_name || "No Name"}</span>
              </td>
              <td className="border px-4 py-2">${isNaN(price) ? "0.00" : price.toFixed(2)}</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-20 text-center border rounded px-2 py-1"
                />
              </td>
              <td className="border px-4 py-2">${isNaN(subtotal) ? "0.00" : subtotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Coupon + Update */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <button
          onClick={() => Swal.fire("Updated!", "Cart updated successfully", "success")}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded font-semibold"
        >
          Update Cart
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Coupon code"
            value={coupon}
            onChange={handleCouponChange}
            className="border rounded px-3 py-1 outline-none min-w-[150px]"
          />
          <button
            onClick={applyCoupon}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded font-semibold"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Totals + Checkout */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-t border-gray-300 pt-6 gap-4 mb-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">Cart Totals</h3>
          <p>Subtotal: ${isNaN(subtotal) ? "0.00" : subtotal.toFixed(2)}</p>
          <p>Discount ({appliedCoupon || "None"}): {discount}%</p>
          <p className="font-bold">Total: ${isNaN(totalAfterDiscount) ? "0.00" : totalAfterDiscount.toFixed(2)}</p>
        </div>
        <button
          onClick={handleCheckout}
          className="px-6 py-3 flex gap-2 rounded font-bold text-white bg-green-500 hover:bg-green-600"
        >
          <FaShoppingCart size={20} /> Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
