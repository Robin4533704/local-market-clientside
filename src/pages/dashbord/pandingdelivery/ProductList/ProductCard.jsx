import React, { useEffect, useState } from "react";
import { useParams, useLocation, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../../loading/Loading";
import UseAuth from "../../../../hooks/UseAuth";
import useAxios from "../../../../hooks/useAxios";
import { 
  FaShoppingCart, 
  FaHome, 
  FaTag, 
  FaPercentage, 
  FaArrowLeft,
  FaPlus,
  FaMinus,
  FaCheck,
  FaShippingFast,
  FaLock,
  FaUndo
} from "react-icons/fa";

const VALID_COUPONS = {
  SAVE10: { discount: 10, type: "percentage", description: "10% off your order" },
  SAVE20: { discount: 20, type: "percentage", description: "20% off your order" },
  FREESHIP: { discount: 5, type: "fixed", description: "Free shipping discount" },
  WELCOME15: { discount: 15, type: "percentage", description: "15% welcome discount" },
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
  const [couponError, setCouponError] = useState("");

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

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(99, value));
    setQuantity(newQuantity);
  };

  const incrementQuantity = () => handleQuantityChange(quantity + 1);
  const decrementQuantity = () => handleQuantityChange(quantity - 1);

  const handleCouponChange = (e) => {
    setCoupon(e.target.value);
    setCouponError("");
  };

  const applyCoupon = () => {
    const code = coupon.toUpperCase().trim();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (VALID_COUPONS[code]) {
      const couponData = VALID_COUPONS[code];
      setDiscount(couponData.discount);
      setAppliedCoupon(code);
      setCouponError("");
      
      Swal.fire({
        icon: "success",
        title: "Coupon Applied! 🎉",
        html: `
          <div class="text-center">
            <p class="mb-2"><strong>${code}</strong></p>
            <p class="text-green-600">${couponData.description}</p>
            <p class="text-sm text-gray-600 mt-2">Discount: ${couponData.discount}${couponData.type === "percentage" ? "%" : "$"}</p>
          </div>
        `,
        confirmButtonColor: "#10b981",
      });
    } else {
      setDiscount(0);
      setAppliedCoupon("");
      setCouponError("Invalid coupon code. Please try again.");
      
      Swal.fire({
        icon: "error",
        title: "Invalid Coupon",
        text: "The coupon code you entered is not valid.",
        confirmButtonColor: "#ef4444",
      });
    }
    setCoupon("");
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon("");
    Swal.fire({
      icon: "info",
      title: "Coupon Removed",
      text: "Discount has been removed from your order.",
      confirmButtonColor: "#6b7280",
    });
  };

  // Safe price calculation
  const price = Number(product?.final_price ?? product?.price ?? 0);
  const subtotal = price * quantity;
  
  // Calculate discount based on type
  const discountAmount = VALID_COUPONS[appliedCoupon]?.type === "percentage" 
    ? (subtotal * discount) / 100 
    : discount;
  
  const totalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const shippingFee = totalAfterDiscount > 500 ? 0 : 60;
  const finalTotal = totalAfterDiscount + shippingFee;

  const handleCheckout = () => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please log in to proceed with checkout",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Continue Shopping",
        confirmButtonColor: "#10b981",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location } });
        }
      });
      return;
    }

    navigate(`/checkout/${product._id}`, {
      state: {
        product,
        quantity,
        subtotal,
        discount: discountAmount,
        total: finalTotal,
        coupon: appliedCoupon,
        shippingFee,
      },
    });
  };

  const handleUpdateCart = () => {
    Swal.fire({
      icon: "success",
      title: "Cart Updated!",
      text: "Your cart has been updated successfully",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  if (loading) return <Loading />;
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaShoppingCart className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for is not available.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <p className="text-center text-red-500 text-xl">Product not found</p>
    </div>
  );

  const imageUrl = product.image && !product.image.startsWith("http")
    ? `${import.meta.env.VITE_API_URL || ""}${product.image}`
    : product.image || "/placeholder.png";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation Breadcrumb */}
      <div className="pt-24 px-4 md:px-8 lg:px-16">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <NavLink 
            to="/" 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FaHome />
            Home
          </NavLink>
          <span className="text-gray-400">/</span>
          <NavLink 
            to="/productlist" 
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Products
          </NavLink>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-medium">Shopping Cart</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <FaArrowLeft />
          Back to Product
        </button>

        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Shopping Cart
            </h1>
            <p className="text-gray-600 text-lg">
              Review your items and proceed to checkout
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Cart Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                {/* Product Item */}
                <div className="flex flex-col md:flex-row gap-6 p-6 border-b border-gray-200 last:border-b-0">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={product.product_name || "Product"}
                      className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl shadow-md"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {product?.product_name || "No Name"}
                    </h3>
                    {product.marketName && (
                      <p className="text-gray-600 mb-3 flex items-center gap-2">
                        <FaTag className="text-blue-500" />
                        Sold by: {product.marketName}
                      </p>
                    )}
                    
                    {/* Price and Quantity Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="text-2xl font-bold text-green-600">
                        ${isNaN(price) ? "0.00" : price.toFixed(2)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <span className="text-gray-700 font-medium">Quantity:</span>
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
                          <button
                            onClick={decrementQuantity}
                            disabled={quantity <= 1}
                            className={`p-1 rounded transition-colors ${
                              quantity <= 1 
                                ? "text-gray-400 cursor-not-allowed" 
                                : "text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            <FaMinus size={14} />
                          </button>
                          <span className="w-12 text-center font-semibold text-lg">
                            {quantity}
                          </span>
                          <button
                            onClick={incrementQuantity}
                            className="p-1 rounded text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            <FaPlus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Subtotal:</span>
                        <span className="text-xl font-bold text-gray-800">
                          ${isNaN(subtotal) ? "0.00" : subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6">
                  <button
                    onClick={handleUpdateCart}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <FaUndo />
                    Update Cart
                  </button>
                  
                  <NavLink
                    to="/productlist"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
                  >
                    Continue Shopping
                  </NavLink>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaPercentage className="text-green-500" />
                  Apply Coupon Code
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Enter coupon code (e.g., SAVE10)"
                      value={coupon}
                      onChange={handleCouponChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    />
                    {couponError && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        ⚠️ {couponError}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={applyCoupon}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
                  >
                    Apply Coupon
                  </button>
                </div>

                {/* Applied Coupon */}
                {appliedCoupon && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaCheck className="text-green-500" />
                        <div>
                          <p className="font-semibold text-green-800">{appliedCoupon}</p>
                          <p className="text-sm text-green-600">
                            {VALID_COUPONS[appliedCoupon]?.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Available Coupons */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Available Coupons:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(VALID_COUPONS).map(([code, data]) => (
                      <div
                        key={code}
                        className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-blue-600">{code}</span>
                          <span className="text-green-600 font-semibold">
                            {data.discount}{data.type === "percentage" ? "%" : "$"} off
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{data.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FaShoppingCart className="text-blue-500" />
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  {/* Price Breakdown */}
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${isNaN(subtotal) ? "0.00" : subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon}):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-2">
                      <FaShippingFast className="text-blue-500" />
                      Shipping:
                    </span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `${shippingFee.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <hr className="my-4" />

                  {/* Final Total */}
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total:</span>
                    <span>${isNaN(finalTotal) ? "0.00" : finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-3"
                >
                  <FaShoppingCart />
                  Proceed to Checkout
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaLock className="text-green-500" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaShippingFast className="text-blue-500" />
                      <span>Fast Delivery</span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {subtotal < 500 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 text-center">
                      Add ${(500 - subtotal).toFixed(2)} more for <strong>FREE shipping</strong>!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;