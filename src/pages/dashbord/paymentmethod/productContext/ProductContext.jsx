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
      const response = await axiosInstance.get("/products");
      setProducts(response.data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to load products",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
