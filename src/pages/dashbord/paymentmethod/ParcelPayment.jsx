import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation } from 'react-router-dom';
import ParcelPaymentForm from './parcelPaymentfrom';


// Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const ParcelPayment = () => {
  const location = useLocation();
  const paymentData = location.state; // product, quantity, subtotal, discount, total, coupon

  if (!paymentData) {
    return <p className="text-center mt-10 text-red-600">No product data for payment.</p>;
  }

  return (
    <div className="max-w-xl mx-auto my-10">
      <Elements stripe={stripePromise}>
        <ParcelPaymentForm paymentData={paymentData} />
      </Elements>
    </div>
  );
};

export default ParcelPayment;
