import React, { useContext } from "react";
import { NavLink } from "react-router-dom"; // react-router -> react-router-dom
import { ProductContext } from "../../../paymentmethod/productContext/ProductContext";


const AddTable = () => {
  const { products, removeProduct, loading } = useContext(ProductContext);

  if (loading) return <p className="pt-24 px-4">Loading...</p>;

  return (
    <div className="pt-24 px-4 md:px-20 min-h-screen bg-[#f5f0e1]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Products Table</h2>
        <NavLink to="/addproduct" className="btn">Back</NavLink>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Product Name</th>
              <th className="border border-gray-300 px-4 py-2">Vendor</th>
              <th className="border border-gray-300 px-4 py-2">Market</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Items</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={p._id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">
                  <img src={p.image} alt={p.product_name} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="border px-4 py-2">{p.product_name}</td>
                <td className="border px-4 py-2">{p.vendorName}</td>
                <td className="border px-4 py-2">{p.marketName}</td>
                <td className="border px-4 py-2">${p.final_price}</td>
                <td className="border px-4 py-2">
                  {p.items?.map((item, i) => (
                    <div key={i}>{item.item_name} - {item.price} / {item.unit}</div>
                  ))}
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => removeProduct(p._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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

export default AddTable;
