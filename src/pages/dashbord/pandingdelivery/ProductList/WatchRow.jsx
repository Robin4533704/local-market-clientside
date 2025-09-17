import React from "react";

const WatchlistRow = ({ item, onRemove, onAddMore }) => {
  return (
    <tr className="border-b">
      <td className="p-2">{item.product_name}</td>

      <td className="p-2">{item.marketName}</td>
      <td className="p-2">{item.date}</td>
      <td className="p-2 flex gap-2">
        <button
          className="bg-green-500 text-white px-2 py-1 rounded"
          onClick={onAddMore}
        >
          Add More
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded"
          onClick={onRemove}
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

export default WatchlistRow;
