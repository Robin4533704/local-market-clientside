import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loading from '../../loading/Loading';
import useAxios from '../../../hooks/useAxios';
import UseAuth from '../../../hooks/UseAuth';

const PaymentForm = ({ paymentData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = UseAuth();
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const { product, quantity, subtotal, discount, total, coupon } = paymentData;
  const amountInCents = Math.round(total * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const card = elements.getElement(CardElement);
    if (!card) return;

    // Step 1: Create payment method
    const { error: stripeError } = await stripe.createPaymentMethod({
      type: 'card',
      card,
      billing_details: {
        name: user.displayName,
        email: user.email,
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setIsProcessing(false);
      return;
    }

    // Step 2: Create payment intent
    let clientSecret;
    try {
      const res = await axiosSecure.post('/create-payment-intent', {
        amountInCents,
        productId: product._id,
        quantity,
      });
      clientSecret = res.data.clientSecret;
    } catch (err) {
      setIsProcessing(false);
      Swal.fire('Error', 'Failed to initiate payment.', 'error');
      return;
    }

    // Step 3: Confirm card payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    setIsProcessing(false);

    if (result.error) {
      setError(result.error.message);
      Swal.fire('Payment Failed', result.error.message, 'error');
      return;
    }

    if (result.paymentIntent.status === 'succeeded') {
      // Save order after successful payment
      const orderData = {
        userId: user.uid,
        userName: user.displayName,
        products: [
          {
            productId: product._id,
            name: product.product_name,
            price: product.final_price,
            quantity,
          },
        ],
        subtotal,
        discount,
        total,
        coupon,
        paymentStatus: 'paid',
        transactionId: result.paymentIntent.id,
        date: new Date().toLocaleDateString(),
      };

      try {
        const orderRes = await axiosSecure.post('/orders', orderData);
        const orderId = orderRes.data.orderId;

        Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          html: `<p>Transaction ID: <strong>${result.paymentIntent.id}</strong><br/>Order ID: <strong>${orderId}</strong></p>`,
          confirmButtonText: 'Go to My Orders',
        }).then((res) => {
          if (res.isConfirmed) navigate('/orderlist');
        });
      } catch (err) {
        Swal.fire('Payment Succeeded', 'Order save failed.', 'warning');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 w-full relative"
    >
      <div className="border border-gray-300 rounded-md p-4 mb-4 bg-gray-50">
        <CardElement className="p-2" />
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-lime-400 via-green-400 to-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200"
      >
        {isProcessing ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
      </button>

      {isProcessing && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
          <Loading />
        </div>
      )}

      {error && <p className="mt-4 text-red-600 text-center font-medium">{error}</p>}
    </form>
  );
};

export default PaymentForm;
