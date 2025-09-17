import React, { useState, useEffect } from "react";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);

  // Load products from localStorage
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(storedProducts);
  }, []);

  // Remove product
  const handleRemove = (_id) => {
    if (window.confirm("Are you sure you want to remove this product?")) {
      const updated = products.filter((p) => p._id !== _id);
      setProducts(updated);
      localStorage.setItem("products", JSON.stringify(updated));
    }
  };

  if (products.length === 0)
    return <p className="text-center mt-10 text-gray-500">No products found.</p>;

  return (
    <div className="pt-8 px-4 md:px-20">
      <h2 className="text-2xl font-bold mb-6">Product List</h2>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 transition duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={p.image} alt={p.product_name} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{p.product_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.marketName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.vendorName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {p.price ? `${p.price}৳` : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{p.final_price}৳</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.status || "approved"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {p.items && p.items.length > 0 ? (
                    <ul className="list-disc ml-5">
                      {p.items.map((item, index) => (
                        <li key={index}>
                          {item.item_name} - {item.price}৳ / {item.unit}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleRemove(p._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;
