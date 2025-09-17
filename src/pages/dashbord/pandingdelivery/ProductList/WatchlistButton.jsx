import React from "react";
import WatchlistRow from "./WatchlistRow";

const WatchlistTable = ({ watchlist, onRemoveItem, onAddMore }) => {
  const watchArray = Array.isArray(watchlist) ? watchlist : [];

  return (
    <table className="min-w-full border">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2">Product Name</th>
          <th className="p-2">Market Name</th>
          <th className="p-2">Date</th>
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {watchArray.map((item) => (
          <WatchlistRow
            key={item.id}
            item={item}
            onRemove={() => onRemoveItem(item.id)}
            onAddMore={() => onAddMore(item.id)}
          />
        ))}
      </tbody>
    </table>
  );
};

export default WatchlistTable;
