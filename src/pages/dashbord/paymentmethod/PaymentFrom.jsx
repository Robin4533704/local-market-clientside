import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UseAuth from '../../../hooks/UseAuth';
import Swal from 'sweetalert2';
import Loading from '../../loading/Loading';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const { parcelId } = useParams(); // Ensure your route has :parcelId
  const axiosSecure = UseAxiosSecure();
  const { user } = UseAuth();
  const navigate = useNavigate();

  // Fetch parcel info
  const { isLoading, data: parcelinfo = {} } = useQuery({
    queryKey: ['parcels', parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  const amount = parcelinfo.cost;
  if (!amount || isNaN(amount)) {
    console.error('Invalid amount:', parcelinfo);
    return <p className="text-red-600 text-center mt-4">Invalid parcel cost.</p>;
  }

  const amountInCents = Math.round(amount * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) {
      console.error('CardElement not found.');
      return;
    }

    // Step 1: Create payment method
    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (stripeError) {
      setError(stripeError.message);
      return;
    } else {
      setError('');
      console.log('✅ Payment Method:', paymentMethod);
    }

    // Step 2: Get clientSecret from backend
    let clientSecret;
    try {
      const res = await axiosSecure.post('/create-payment-intent', {
        amountInCents,
        parcelId,
      });
      console.log('Sending to server:', { amountInCents, parcelId });
      clientSecret = res.data.clientSecret;
    } catch (err) {
      console.error('Error getting clientSecret:', err);
      toast.error('Failed to initiate payment.');
      return;
    }

    // Step 3: Confirm card payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: user.displayName,
          email: user.email,
        },
      },
    });

    if (result.error) {
      setError(`Payment failed: ${result.error.message}`);
      toast.error(`Payment failed: ${result.error.message}`);
      return;
    }

    if (result.paymentIntent.status === 'succeeded') {
      toast.success('Payment Successful!');
      console.log('✅ Payment Success:', result);

      // Step 4: Save payment entry & update parcel
      const paymentEntry = {
        parcelId,
        email: user.email,
        amount,
        transactionId: result.paymentIntent.id,
        paymentMethod: result.paymentIntent.payment_method_types?.[0] || 'unknown',
      };

      try {
        const paymentsres = await axiosSecure.post('/payments', paymentEntry);
        if (paymentsres.data.insertedId) {
          Swal.fire({
            title: 'Payment Successful!',
            html: `<strong>Transaction ID:</strong><br/><code>${result.paymentIntent.id}</code>`,
            icon: 'success',
            confirmButtonText: 'Go to My Parcels',
            confirmButtonColor: '#3085d6',
          }).then((res) => {
            if (res.isConfirmed) navigate('/dashboard/myparcels');
          });
        }
      } catch (err) {
        console.error('Failed to record payment:', err);
        toast.error('Payment succeeded, but failed to save record.');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 w-full"
    >
      <div className="border border-gray-300 rounded-md p-4 mb-4 bg-gray-50">
        <CardElement className="p-2" />
      </div>

      <button
        type="submit"
        disabled={!stripe}
        className="w-full bg-gradient-to-r from-lime-400 via-green-400 to-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200"
      >
        Pay ${amount}
      </button>

      {error && <p className="mt-4 text-red-600 text-center font-medium">{error}</p>}
    </form>
  );
};

export default PaymentForm;
