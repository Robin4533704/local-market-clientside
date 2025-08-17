// src/pages/Auth/ForgotPassword.jsx
import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../constex/AuthContext";
import { useNavigate } from "react-router";
 // path ঠিক করুন

const ForgotPassword = () => {
  const navigate = useNavigate()
  const { passwordReset } = useContext(AuthContext);
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await passwordReset(email);
      Swal.fire({
        icon: "success",
        title: "Reset Link Sent!",
        text: `Password reset link has been sent to ${email}`,
        timer: 3000,
        showConfirmButton: false,
      });
      setEmail("");
       navigate("/login"); // form reset
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input input-bordered w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full btn btn-primary py-2 text-white font-semibold hover:bg-blue-700 transition duration-300"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
