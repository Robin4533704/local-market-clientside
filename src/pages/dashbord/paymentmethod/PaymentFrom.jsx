import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

   const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const { parcelId } = useParams();
  const axiosSecure = UseAxiosSecure();

  const { isPending, data: parcelinfo = {} } = useQuery({
    queryKey: ['parcels', parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return '...loading';
  }

  const amount = parcelinfo.cost;
  const amountInCents = Math.round(amount * 100); // Stripe চায় সেন্টে
  console.log(amountInCents);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!stripe || !elements){
    return; 

  } 

  const card = elements.getElement(CardElement);

  if (!card){
      console.error("CardElement not found.");
    return;
  }
 // Create payment method
  const { error, paymentMethod } = await stripe.createPaymentMethod({
  type: 'card',
  card,
});

if (error) {
  console.error("Payment Method Error:", error.message);
  setError(error.message);
  return;
} else {
  setError('');
  console.log("✅ payment method", paymentMethod);
}


  if (error) {
    console.error("Payment Method Error:", error);
    return;
   
  }
   
  else{
    setError(``);
    console.log("✅ payment method", paymentMethod);
  }


// Send request to backend to get clientSecret 
 const res = await axiosSecure.post('/create-payment-intent', {
  amountInCents,
  parcelId,

 })
 const clientSecret =res.data.clientSecret
 const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Customer Name',
        },
      }
    });
     if (result.error) {
     setError(`Payment failed: ${result.error.message}`);
      toast.error(`Payment failed: ${result.error.message}`);
     
    } else {
      if (result.paymentIntent.status === 'succeeded') {
         setError(null);
      toast.success('Payment Successful!');
       
      }
    }
 console.log('res from intent', res);
};


  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 w-full"
    >
      {/* Card Element */}
      <div className="border border-gray-300 rounded-md p-4 mb-4 bg-gray-50">
        <CardElement className="p-2" />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!stripe}
        className="w-full bg-gradient-to-r from-lime-400 via-green-400 to-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200"
      >
        Pay ${amount}
      </button>

      {/* Error */}
      {error && (
        <p className="mt-4 text-red-600 text-center font-medium">{error}</p>
      )}
    </form>
  );
};

export default PaymentForm;
