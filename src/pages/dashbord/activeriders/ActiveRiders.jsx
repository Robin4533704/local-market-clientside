import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";

const ActiveRiders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  const fetchRiders = async () => {
    const { data } = await axiosSecure.get("/riders/active");
    return data;
  };

  const { data: riders = [], isLoading, isError, error } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: fetchRiders,
  });

  const deactivateMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/riders/${id}`, { status: "inactive" });
    },
    onSuccess: () => queryClient.invalidateQueries(["activeRiders"]),
  });

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredRiders = riders.filter((rider) =>
    rider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
    return <p className="text-center mt-6 text-gray-600">Loading riders...</p>;
  if (isError)
    return (
      <p className="text-center mt-6 text-red-600">Error: {error.message}</p>
    );

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Active Riders
      </h2>

      {/* Search box */}
      <div className="flex justify-center md:justify-start mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Riders table / responsive cards */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-green-100">
            <tr>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Phone</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Vehicle</th>
              <th className="border p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.length > 0 ? (
              filteredRiders.map((rider) => (
                <tr
                  key={rider._id}
                  className="hover:bg-green-50 transition-colors duration-200"
                >
                  <td className="border p-3">{rider.name}</td>
                  <td className="border p-3">{rider.phone}</td>
                  <td className="border p-3">{rider.email}</td>
                  <td className="border p-3">{rider.vehicleType}</td>
                  <td className="border p-3 text-center">
                    <button
                      onClick={() => deactivateMutation.mutate(rider._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg shadow-sm transition"
                      disabled={deactivateMutation.isLoading}
                    >
                      {deactivateMutation.isLoading
                        ? "Processing..."
                        : "Deactivate"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No riders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile view: cards */}
      <div className="md:hidden space-y-4">
        {filteredRiders.length > 0 ? (
          filteredRiders.map((rider) => (
            <div
              key={rider._id}
              className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg mb-1">{rider.name}</h3>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Phone:</span> {rider.phone}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Email:</span> {rider.email}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Vehicle:</span> {rider.vehicleType}
              </p>
              <button
                onClick={() => deactivateMutation.mutate(rider._id)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg shadow-sm transition"
                disabled={deactivateMutation.isLoading}
              >
                {deactivateMutation.isLoading ? "Processing..." : "Deactivate"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No riders found.</p>
        )}
      </div>
    </div>
  );
};

export default ActiveRiders;
