import React, { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import UseAuth from "../../../hooks/UseAuth";
import useAxios from "../../../hooks/useAxios";
import Loading from "../../loading/Loading";

const ProductDetails = () => {
  const location = useLocation();
  const { product: initialProduct } = location.state || {};
  const { user } = UseAuth();
  const userUserAxios = useAxios();

  const [product, setProduct] = useState(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState(null);

  const [reviews, setReviews] = useState(product?.reviews || []);
  const [newReview, setNewReview] = useState("");

  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        try {
          const res = await userUserAxios.get(`/shoppingdata/${initialProduct?._id}`);
          setProduct(res.data);
          setReviews(res.data.reviews || []);
        } catch (err) {
          console.error(err);
          setError("Failed to load product");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [product, initialProduct, userUserAxios]);

  const handleAddReview = async () => {
    if (!newReview) return toast.warning("Please write a review");

    try {
      const res = await userUserAxios.post(
        `/shoppingdata/${product._id}/reviews`,
        {
          userName: user?.displayName || "Guest",
          comment: newReview,
          rating: 5,
        }
      );
      setReviews([res.data, ...reviews]);
      setNewReview("");
      toast.success("Review added!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add review");
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="pt-24 px-4 md:px-20 min-h-screen bg-[#f5f0e1] font-sans">
      <div className="mb-6 text-sm">
        <NavLink to="/" className="text-black btn">Home</NavLink>
        <span className="ml-2 btn">Product Details</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <img src={product.image} alt={product.product_name} className="w-full md:w-96 h-96 object-cover rounded shadow" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{product.product_name}</h1>
          <p className="mt-2 text-gray-500 line-through">${product.price}</p>
          <p className="text-green-600 font-bold text-xl">${product.final_price}</p>
          <p className="mt-4">{product.description}</p>
          <p className="mt-2 text-yellow-500 font-semibold">Stars: {product.stars}</p>
          <p className="mt-1 font-medium">Status: {product.status}</p>
          <p className="mt-2 font-medium">Available Quantity: {product.count}</p>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Reviews</h3>

        {/* Add Review */}
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Write a review..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            className="border rounded px-3 py-1 flex-1"
          />
          <button
            onClick={handleAddReview}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded font-semibold"
          >
            Submit
          </button>
        </div>

        {/* Display Reviews */}
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            reviews.map((rev, idx) => (
              <div key={idx} className="border-b py-2">
                <p className="font-semibold">{rev.userName}:</p>
                <p>{rev.comment}</p>
                <p className="text-xs text-gray-400">{new Date(rev.date).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
