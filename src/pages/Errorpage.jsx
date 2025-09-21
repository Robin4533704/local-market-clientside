import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f0e1] text-center px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">Sorry, the page you are looking for does not exist.</p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold transition-colors duration-300"
      >
        ← Go Back Home
      </button>
    </div>
  );
};

export default ErrorPage;
