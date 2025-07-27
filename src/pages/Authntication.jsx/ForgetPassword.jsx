import React from 'react';

const ForgotPassword = () => {
  const handleReset = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    // এখানে তোমার firebase বা backend API দিয়ে reset করতে পারো
    console.log("Password reset link sent to:", email);
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="input input-bordered w-full"
          required
        />
        <button type="submit" className="btn btn-primary w-full">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
