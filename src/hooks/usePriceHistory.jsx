import { useEffect, useState } from "react";
import useAxiosSecure from "./UseAxiosSecure";


const usePriceHistory = (productId) => {
  const axiosSecure = useAxiosSecure();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    axiosSecure
      .get(`/api/products/${productId}/price-trends`)
      .then(res => setData(res.data))
      .catch(err => console.error("Fetch price history error:", err))
      .finally(() => setLoading(false));
  }, [productId, axiosSecure]);

  return { data, loading };
};

export default usePriceHistory;
