import React, { useState, useContext } from "react"; 
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { ProductContext } from "../../../paymentmethod/productContext/ProductContext";
import useAxios from "../../../../../hooks/useAxios";



const AddProducts = () => {
  const { products, setProducts } = useContext(ProductContext); 
  console.log(products)
  const axiosInstance = useAxios()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    product_name: "",
    image: "",
    final_price: 0,
    marketName: "",
    vendorName: "",
    items: [{ item_name: "", price: 0, unit: "kg" }],
    reviews: [],
    status: "approved",
    date: new Date().toISOString().split("T")[0],
  });

 

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index][name] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItemRow = () =>
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { item_name: "", price: 0, unit: "kg" }],
    }));

  const removeItemRow = (index) =>
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));

  // Submit handler
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axiosInstance.post("/products", formData);

    if (data.success || data.insertedId) {
      Swal.fire("Success", "Product added successfully!", "success");

      // ✅ Context state update
      setProducts((prev) => [...prev, { ...formData, _id: data.insertedId }]);

      // Reset form
      setFormData({
        product_name: "",
        image: "",
        final_price: 0,
        marketName: "",
        vendorName: "",
        items: [{ item_name: "", price: 0, unit: "kg" }],
        reviews: [],
        status: "approved",
        date: new Date().toISOString().split("T")[0],
      });
    } else {
      Swal.fire("Error", data?.message || "Failed to add product", "error");
    }
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to add product", "error");
  }
  navigate("/productlist")
};


  const handleAddtable = () => navigate("/addtable");

  return (
    <div className="pt-24 px-4 md:px-20 min-h-screen bg-[#f5f0e1]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Add New Product</h2>
        <p onClick={handleAddtable} className="text-blue-600 btn cursor-pointer">
          View Products Table
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded shadow mb-6"
      >
        <input
          type="text"
          name="product_name"
          value={formData.product_name}
          onChange={handleChange}
          placeholder="Product Name"
          className="border p-2 w-full rounded mb-2"
          required
        />
        <input
          type="text"
          name="vendorName"
          value={formData.vendorName}
          onChange={handleChange}
          placeholder="Vendor Name"
          className="border p-2 w-full rounded mb-2"
          required
        />
        <input
          type="text"
          name="marketName"
          value={formData.marketName}
          onChange={handleChange}
          placeholder="Market Name"
          className="border p-2 w-full rounded mb-2"
          required
        />
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="border p-2 w-full rounded mb-2"
        />
        <input
          type="number"
          name="final_price"
          value={formData.final_price}
          onChange={handleChange}
          placeholder="Final Price"
          className="border p-2 w-full rounded mb-2"
        />

        <h3 className="font-semibold mt-2 mb-2">Items</h3>
        {formData.items.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              name="item_name"
              value={item.item_name}
              onChange={(e) => handleItemChange(e, index)}
              placeholder="Item Name"
              className="border p-2 rounded flex-1"
            />
            <input
              type="number"
              name="price"
              value={item.price}
              onChange={(e) => handleItemChange(e, index)}
              placeholder="Price"
              className="border p-2 rounded w-24"
            />
            <input
              type="text"
              name="unit"
              value={item.unit}
              onChange={(e) => handleItemChange(e, index)}
              placeholder="Unit"
              className="border p-2 rounded w-24"
            />
            <button
              type="button"
              onClick={() => removeItemRow(index)}
              className="bg-red-500 text-white px-2 rounded"
            >
              ❌
            </button>
          </div>
        ))}

        <div className="flex gap-4 mt-4">
          <button
            type="button"
            onClick={addItemRow}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          >
            ➕ Add Item
          </button>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;
