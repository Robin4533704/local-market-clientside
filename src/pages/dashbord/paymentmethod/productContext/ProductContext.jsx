// ProductContext.jsx
import React, { createContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import useAxios from "../../../../hooks/useAxios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const axiosInstance = useAxios();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/products");
      setProducts(res.data); // সব product set করা হবে
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || err.message || "Failed to load products",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [axiosInstance]); // dependency হিসাবে axiosInstance রাখা ভালো

  return (
    <ProductContext.Provider
      value={{ products, setProducts, loading, fetchProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
};
