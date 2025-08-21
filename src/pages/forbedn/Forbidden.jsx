// ForbiddenPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const Forbidden = () => {
    
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center bg-white p-10 rounded-xl shadow-lg max-w-md">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-2">Access Forbidden</h2>
        <p className="text-gray-600 mb-6">
          Oops! You don't have permission to access this page.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
