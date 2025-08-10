// Payment.jsx (route page)
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentFrom';


// stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_payment_key);
// console.log(import.meta.env.VITE_payment_key);
const Payment = () => {
  // console.log('hello');
  return (
    <div className="max-w-xl mx-auto my-10">
      <Elements stripe={stripePromise}>
        <PaymentForm/>
      </Elements>
    </div>
  );
};

export default Payment;
