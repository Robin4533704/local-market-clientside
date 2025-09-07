// ProductCard.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, NavLink } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../../loading/Loading";
import UseAuth from "../../../../hooks/UseAuth";
import toast from "react-hot-toast";

const VALID_COUPONS = {
  SAVE10: 10,
  SAVE20: 20,
  FREESHIP: 5,
};

const ProductCard = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = UseAuth();

  const [product, setProduct] = useState(location.state || null);
  const [quantity, setQuantity] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);


  // Review State
  const [reviews, setReviews] = useState(product?.reviews || []);
  const [newReview, setNewReview] = useState("");

  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/shoppingdata/${id}`);
          setProduct(res.data);
          setReviews(res.data.reviews || []);
        } catch (err) {
          console.error(err);
          setError("Failed to load product");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, product]);

  const handleQuantityChange = (e) => setQuantity(Number(e.target.value));
  const handleCouponChange = (e) => setCoupon(e.target.value);

  const applyCoupon = () => {
    const code = coupon.toUpperCase().trim();
    if (!code) return alert("Please enter a coupon code");

    if (VALID_COUPONS[code]) {
      setDiscount(VALID_COUPONS[code]);
      setAppliedCoupon(code);
      alert(`Coupon applied: ${code} (${VALID_COUPONS[code]}% off)`);
    } else {
      alert("Invalid coupon code");
      setDiscount(0);
      setAppliedCoupon("");
    }
    setCoupon("");
  };

  const subtotal = (product?.final_price || product?.price || 0) * quantity;
  const totalAfterDiscount = subtotal - (subtotal * discount) / 100;

const handleCheckout = async () => {
  if (!product) return;
  setProcessing(true);

  const orderData = {
    userId: user?.uid || "guest",
    userName: user?.displayName || "Guest",
    products: [
      {
        productId: product._id,
        name: product.product_name,
        price: product.price,
        quantity,
      },
    ],
    subtotal,
    discount,
    total: totalAfterDiscount,
    coupon: appliedCoupon,
    paymentStatus: "paid",
  };

  try {
    // Server will handle notifications
    const res = await axios.post("http://localhost:5000/orders", orderData);
    const orderId = res.data.orderId; // Server sends inserted orderId

    Swal.fire({
      icon: "success",
      title: "Order Confirmed!",
      html: `<p>Order ID: <strong>${orderId}</strong></p>`,
      confirmButtonText: "OK",
    });

    // No frontend POST to /notifications needed
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Order Failed",
      text: "Failed to confirm order. Please try again.",
      confirmButtonText: "OK",
    });
  } finally {
    setProcessing(false);
  }
};



  // Add Review
const handleAddReview = async () => {
  if (!newReview) return toast.warning("Please write a review");

  try {
   const res = await axios.post(
  `http://localhost:5000/shoppingdata/${product._id}/reviews`,
  {
    userName: user?.displayName || "Guest",
    comment: newReview,
    rating: 5,
  }
);


    // Update front-end reviews state
    setReviews([res.data, ...reviews]);
    setNewReview("");
    toast.success("Review added!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to add review");
  }
};


  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="pt-26 px-4 md:px-20 bg-[#f5f0e1] min-h-screen font-sans">
      <div className="mb-6 text-sm">
        <NavLink to="/" className="text-black btn">Home</NavLink>
        <span className="ml-2 btn">Cart</span>
      </div>

      <h1 className="text-3xl font-semibold text-center mb-8">{product.product_name}</h1>

      {/* Product Details Table */}
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
                <img src={product.image} alt={product.product_name} className="w-60 h-60 object-cover rounded shadow" />
                <span className="text-lg font-medium">{product.product_name}</span>
              </td>
              <td className="border px-4 py-2">${product.price}</td>
              <td className="border px-4 py-2">
                <input type="number" min="1" value={quantity} onChange={handleQuantityChange} className="w-20 text-center border rounded px-2 py-1"/>
              </td>
              <td className="border px-4 py-2">${subtotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Coupon and Update */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <button onClick={() => alert("Cart updated")} className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded font-semibold">
          Update Cart
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <input type="text" placeholder="Coupon code" value={coupon} onChange={handleCouponChange} className="border rounded px-3 py-1 outline-none min-w-[150px]" />
          <button onClick={applyCoupon} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded font-semibold">
            Apply
          </button>
        </div>
      </div>

      {/* Cart Totals */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-t border-gray-300 pt-6 gap-4 mb-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">Cart Totals</h3>
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Discount ({appliedCoupon || "None"}): {discount}%</p>
          <p className="font-bold">Total: ${totalAfterDiscount.toFixed(2)}</p>
        </div>
        <button onClick={handleCheckout} disabled={processing} className={`px-6 py-3 rounded font-bold text-white ${processing ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}>
          {processing ? "Processing..." : "Proceed to Checkout"}
        </button>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Reviews</h3>

        {/* Add Review */}
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Write a review..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            className="border rounded px-3 py-1 flex-1"
          />
          <button
            onClick={handleAddReview}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded font-semibold"
          >
            Submit
          </button>
        </div>

        {/* Display Reviews */}
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            reviews.map((rev, idx) => (
              <div key={idx} className="border-b py-2">
                <p className="font-semibold">{rev.userName}:</p>
                <p>{rev.comment}</p>
                <p className="text-xs text-gray-400">{new Date(rev.date).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
