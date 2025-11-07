import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { 
  FaCreditCard, 
  FaLock, 
  FaShoppingBag, 
  FaStore, 
  FaTag, 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaShippingFast
} from "react-icons/fa";

const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

// Safe number conversion function
const safeNumber = (value, defaultValue = 0) => {
  if (value === null || value === undefined) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

// Safe toFixed function
const safeToFixed = (value, decimals = 2) => {
  const num = safeNumber(value);
  return num.toFixed(decimals);
};

const CheckoutForm = ({ paymentData }) => {
  const {
    product,
    quantity: initialQty,
    discount: initialDiscount = 0,
    coupon,
    shippingFee = 0
  } = paymentData;

  const [quantity, setQuantity] = useState(safeNumber(initialQty, 1));
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(safeNumber(initialDiscount));
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: ""
  });
  const [processing, setProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  // Safe price extraction
  const unitPrice = safeNumber(product?.final_price ?? product?.price, 0);

  // Calculate prices
  useEffect(() => {
    const newSubtotal = unitPrice * quantity;
    const discountAmount = (newSubtotal * discount) / 100;
    const newTotal = Math.max(0, newSubtotal - discountAmount + shippingFee);
    
    setSubtotal(newSubtotal);
    setTotal(newTotal);
  }, [quantity, discount, unitPrice, shippingFee]);

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Validate customer info
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required customer details",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    if (!stripe || !elements) {
      Swal.fire({
        icon: "error",
        title: "Payment System Error",
        text: "Payment system is not ready. Please try again.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (total <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Amount",
        text: "Total amount must be greater than 0",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    setProcessing(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountInCents: Math.round(total * 100),
          parcelId: product?._id || "unknown",
          quantity,
          discount,
          coupon: coupon || null,
          customerInfo,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }

      const { clientSecret } = await res.json();
      const card = elements.getElement(CardElement);

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { 
          card,
          billing_details: {
            name: customerInfo.fullName,
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: {
              line1: customerInfo.address,
              city: customerInfo.city,
              postal_code: customerInfo.zipCode,
            }
          }
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Save order locally
        const order = {
          _id: new Date().getTime().toString(),
          product_name: product?.product_name || "Unknown Product",
          marketName: product?.marketName || "Local Market",
          vendorName: product?.vendorName || "Unknown Vendor",
          final_price: total,
          quantity,
          discount,
          coupon: coupon || null,
          customerInfo,
          date: new Date().toISOString(),
          paid: true,
          status: "confirmed",
          tracking_id: `ORD-${Date.now()}`,
        };

        const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        storedOrders.unshift(order);
        localStorage.setItem("orders", JSON.stringify(storedOrders));

        await Swal.fire({
          icon: "success",
          title: "Payment Successful! 🎉",
          html: `
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p class="mb-3 text-lg font-semibold">Thank you for your purchase!</p>
              <p class="mb-2">Order Total: <strong>$${safeToFixed(total)}</strong></p>
              <p class="mb-2">Product: <strong>${product?.product_name || "Unknown Product"}</strong></p>
              <p class="mb-3">Quantity: <strong>${quantity}</strong></p>
              <div class="bg-gray-100 p-3 rounded-lg mt-3">
                <p class="text-sm font-mono text-gray-700">Order ID: ${order.tracking_id}</p>
              </div>
            </div>
          `,
          confirmButtonColor: "#10b981",
          confirmButtonText: "View Orders",
        });

        navigate("/dashboard/orderlist");
      }
    } catch (err) {
      console.error("Payment error:", err);
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: err.message || "There was an issue processing your payment. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setProcessing(false);
    }
  };

  const discountAmount = (subtotal * discount) / 100;

  // Card element options
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '10px 12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Order Summary & Customer Info */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaUser className="text-blue-500" />
              Customer Information
            </h2>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={customerInfo.fullName}
                    onChange={handleCustomerInfoChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleCustomerInfoChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleCustomerInfoChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={customerInfo.address}
                  onChange={handleCustomerInfoChange}
                  placeholder="Enter your complete delivery address"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleCustomerInfoChange}
                    placeholder="Enter your city"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={customerInfo.zipCode}
                    onChange={handleCustomerInfoChange}
                    placeholder="Enter ZIP code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaShoppingBag className="text-green-500" />
              Order Summary
            </h2>

            {/* Product Details */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-4">
              <img
                src={product?.image || "/placeholder.png"}
                alt={product?.product_name || "Product"}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{product?.product_name || "Unknown Product"}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  {product?.marketName && (
                    <span className="flex items-center gap-1">
                      <FaStore className="text-blue-500" />
                      {product.marketName}
                    </span>
                  )}
                  {product?.vendorName && (
                    <span className="flex items-center gap-1">
                      <FaUser className="text-green-500" />
                      {product.vendorName}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">${safeToFixed(unitPrice)}</p>
                <p className="text-sm text-gray-500">Qty: {quantity}</p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>${safeToFixed(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <FaTag className="text-green-500" />
                    Discount {coupon && `(${coupon})`}:
                  </span>
                  <span>-${safeToFixed(discountAmount)}</span>
                </div>
              )}

              {shippingFee > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <FaShippingFast className="text-blue-500" />
                    Shipping:
                  </span>
                  <span>${safeToFixed(shippingFee)}</span>
                </div>
              )}

              <hr className="my-3" />

              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total:</span>
                <span>${safeToFixed(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaCreditCard className="text-purple-500" />
              Payment Details
            </h2>

            <form onSubmit={handlePayment} className="space-y-6">
              {/* Card Element */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Credit Card Information
                </label>
                <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
                  <CardElement options={cardElementOptions} />
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <FaLock className="text-green-500" />
                  Your payment information is secure and encrypted
                </p>
              </div>

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-6 py-4 border-t border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaLock className="text-green-500" />
                  <span>SSL Secure</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-blue-500" />
                  <span>256-bit Encryption</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={!stripe || processing || total <= 0}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing Payment...
                  </>
                ) : total <= 0 ? (
                  "Invalid Amount"
                ) : (
                  <>
                    <FaCreditCard />
                    Pay ${safeToFixed(total)}
                  </>
                )}
              </button>

              {/* Guarantee Message */}
              <div className="text-center">
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  Your satisfaction is 100% guaranteed
                </p>
              </div>
            </form>
          </div>

          {/* Trust Indicators */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <FaLock className="text-blue-500" />
              Why Shop With Confidence?
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500 text-xs" />
                Secure payment processing
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500 text-xs" />
                Buyer protection guarantee
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500 text-xs" />
                Encrypted data transmission
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500 text-xs" />
                24/7 customer support
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentData = location.state;

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShoppingBag className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">No Product Selected</h2>
            <p className="text-gray-600 mb-6">Please select a product to proceed with checkout.</p>
            <button
              onClick={() => navigate("/productlist")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="pt-24 px-4 md:px-8 lg:px-16">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <FaArrowLeft />
            Back to Cart
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
            Checkout
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Complete your purchase securely
          </p>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm paymentData={paymentData} />
        </Elements>
      </div>
    </div>
  );
};

export default Checkout;