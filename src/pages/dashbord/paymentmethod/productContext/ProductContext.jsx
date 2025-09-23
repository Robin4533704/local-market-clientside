import React, { createContext, useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  // Axios instance with memoization
  const axiosInstance = useMemo(() => {
    const baseURL =
      import.meta.env.VITE_API_URL || "http://localhost:5000"; // local fallback
    return axios.create({
      baseURL,
      timeout: 60000, // 60s
      withCredentials: true,
    });
  }, []);

  const fetchProducts = async (pageNumber = 1, retries = 3) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/api/products?page=${pageNumber}&limit=${limit}`
      );

      // Ensure response format
      if (res.data && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
        setTotal(res.data.total || 0);
        setPage(res.data.page || pageNumber);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      if (retries > 0) {
        console.warn(`Retrying fetchProducts... attempts left: ${retries}`);
        return fetchProducts(pageNumber, retries - 1);
      }
      console.error("Fetch products error:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || err.message || "Failed to load products",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [axiosInstance]);

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        loading,
        fetchProducts,
        page,
        limit,
        total,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
