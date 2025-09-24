import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loading from '../../loading/Loading';
import UseAuth from '../../../hooks/UseAuth';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import { useQueryClient } from '@tanstack/react-query';

const ParcelPaymentForm = ({ paymentData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = UseAuth();
  const axiosSecure = UseAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // ✅ QueryClient add

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const {
    product = {},
    quantity = 1,
    subtotal = 0,
    discount = 0,
    total = 0,
    coupon,
    _id: parcelId
  } = paymentData || {};

  if (!paymentData || !product._id) {
    return <p className="text-center mt-10 text-red-600">Parcel data incomplete, cannot proceed to payment.</p>;
  }

  const amountInCents = Math.round(total * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const card = elements.getElement(CardElement);
    if (!card) {
      setError('Card element not found');
      setIsProcessing(false);
      return;
    }

    // Create payment method
    const { error: stripeError } = await stripe.createPaymentMethod({
      type: 'card',
      card,
      billing_details: { name: user.displayName, email: user.email },
    });

    if (stripeError) {
      setError(stripeError.message);
      setIsProcessing(false);
      return;
    }

    // Create payment intent
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
      Swal.fire({ icon: 'error', title: 'Payment Error', text: err?.message || 'Failed to initiate payment.' });
      return;
    }

    // Confirm payment
    const result = await stripe.confirmCardPayment(clientSecret, { payment_method: { card } });
    setIsProcessing(false);

    if (result.error) {
      setError(result.error.message);
      Swal.fire({ icon: 'error', title: 'Payment Failed', text: result.error.message });
      return;
    }

    if (result.paymentIntent?.status === 'succeeded') {
      // Save order
      const orderData = {
        userId: user.uid,
        userName: user.displayName,
        products: [{ productId: product._id, name: product.product_name, price: product.final_price, quantity }],
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

        // ✅ Update parcel payment_status
        if (parcelId) {
          await axiosSecure.patch(`/parcels/${parcelId}`, { payment_status: 'paid' });
          queryClient.invalidateQueries(['parcels', user?.email]); // live update
        }

        Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          html: `<p>Transaction ID: <strong>${result.paymentIntent.id}</strong><br/>Order ID: <strong>${orderId}</strong></p>`,
          confirmButtonText: 'Go to My Orders',
        }).then((res) => res.isConfirmed && navigate('/dashbord/myparcels'));

      } catch (err) {
        Swal.fire({ icon: 'warning', title: 'Payment Succeeded', text: err?.message || 'Order save failed.' });
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
        disabled={!stripe || isProcessing || total <= 0}
        className="w-full bg-gradient-to-r from-lime-400 via-green-400 to-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200"
      >
        {isProcessing ? 'Processing Payment...' : `Pay $${(total || 0).toFixed(2)}`}
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

export default ParcelPaymentForm;
