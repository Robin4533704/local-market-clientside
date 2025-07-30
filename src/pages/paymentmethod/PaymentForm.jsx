import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axios from 'axios';

const PaymentForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    const { data } = await axios.post('http://localhost:5000/api/payment/create-payment-intent', { amount });

    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setError(result.error.message);
      setSuccess('');
    } else if (result.paymentIntent.status === 'succeeded') {
      setSuccess('Payment successful!');
      setError('');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto space-y-4">
      <CardElement />
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
      <button
        type="submit"
        className="btn btn-success w-full"
        disabled={!stripe || processing}
      >
        {processing ? 'Processing…' : `Pay $${amount}`}
      </button>
    </form>
  );
};

export default PaymentForm;
