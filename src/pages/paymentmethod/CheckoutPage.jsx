import PaymentForm from "./PaymentForm";


const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <PaymentForm amount={99}/> {/* Pass amount as props */}
    </div>
  );
};

export default CheckoutPage;
