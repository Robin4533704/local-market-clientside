import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";

const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const CheckoutForm = ({ paymentData }) => {
  const {
    product,
    quantity: initialQty,
    subtotal: initialSubtotal,
    discount: initialDiscount,
    total: initialTotal,
    coupon,
  } = paymentData;

  const [quantity, setQuantity] = useState(initialQty);
  const [subtotal, setSubtotal] = useState(initialSubtotal);
  const [discount, setDiscount] = useState(initialDiscount);
  const [total, setTotal] = useState(initialTotal);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const newSubtotal = product.price * quantity;
    const newTotal = newSubtotal - discount;
    setSubtotal(newSubtotal);
    setTotal(newTotal > 0 ? newTotal : 0);
  }, [quantity, discount, product.price]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const res = await fetch("http://localhost:5000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountInCents: Math.round(total * 100),
          parcelId: product._id,
          quantity,
          discount,
          coupon: coupon || null,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${text}`);
      }

      const { clientSecret } = await res.json();
      const card = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });
     console.log(paymentIntent)
      if (error) throw error;

      // 🔹 Save order to localStorage
      const order = {
        _id: new Date().getTime(),
        product_name: product.product_name,
        marketName: product.marketName || "Local Market",
        final_price: total,
        quantity,
        date: new Date().toLocaleDateString(),
      };
      const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
      storedOrders.push(order);
      localStorage.setItem("orders", JSON.stringify(storedOrders));

      Swal.fire(
        "Payment Successful",
        `Your payment of $${total.toFixed(2)} for "${product.product_name}" was successful.`,
        "success"
      );

      navigate("/orderlist"); // Redirect to order list
    } catch (err) {
      console.error(err);
      Swal.fire("Payment Error", err.message || "Payment failed", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handlePayment}
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4">{product.product_name}</h2>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Quantity:</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="border p-2 rounded w-full"
        />
      </div>

      <p className="mb-2">Subtotal: ${subtotal.toFixed(2)}</p>
      <p className="mb-2">Discount: ${discount.toFixed(2)}</p>
      <p className="mb-4 font-bold text-lg">Total: ${total.toFixed(2)}</p>

      <CardElement className="border p-2 rounded mb-4" />

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-2 px-4 rounded text-white font-bold ${
          processing ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const Checkout = () => {
  const location = useLocation();
  const paymentData = location.state;

  if (!paymentData)
    return <p className="text-center mt-10 text-red-600">No product selected for payment.</p>;

  return (
    <div className="pt-24 px-4 md:px-20 min-h-screen bg-[#f5f0e1]">
      <Elements stripe={stripePromise}>
        <CheckoutForm paymentData={paymentData} />
      </Elements>
    </div>
  );
};

export default Checkout;
