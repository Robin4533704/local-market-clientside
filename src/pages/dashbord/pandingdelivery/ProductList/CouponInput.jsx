import React, { useState } from "react";

const CouponInput = ({ onApply }) => {
  const [coupon, setCoupon] = useState("");

  const handleChange = (e) => setCoupon(e.target.value);

  const handleApply = () => {
    if (!coupon.trim()) {
      alert("Please enter a coupon code");
      return;
    }
    onApply(coupon); // parent কম্পোনেন্টকে কুপন পাঠাচ্ছে
    setCoupon(""); // Apply করলে input খালি হবে
  };

  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
      <input
        type="text"
        value={coupon}
        onChange={handleChange}
        placeholder="Coupon code"
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          outline: "none",
          flex: 1
        }}
      />
      <button
        onClick={handleApply}
        style={{
          padding: "10px 20px",
          borderRadius: "5px",
          backgroundColor: "#facc15",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Apply
      </button>
    </div>
  );
};

export default CouponInput;
