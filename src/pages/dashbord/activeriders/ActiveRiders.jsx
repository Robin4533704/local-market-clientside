import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";


const ActiveRiders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch active riders
  const fetchRiders = async () => {
    const { data } = await axiosSecure.get("/riders/active");
    return data;
  };

  const {
    data: riders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: fetchRiders,
  });

  // Deactivate rider mutation
  const deactivateMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/riders/${id}`, { status: "inactive" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["activeRiders"]);
    },
  });

  // Handle search input change
  const handleSearch = (e) => setSearchTerm(e.target.value);

  // Filter riders
  const filteredRiders = riders.filter((rider) =>
    rider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <p>Loading riders...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Active Riders</h2>

      {/* Search box */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleSearch}
        className="border p-2 mb-4 w-full max-w-xs rounded"
      />

      {/* Riders table */}
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Vehicle</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.length > 0 ? (
              filteredRiders.map((rider) => (
                <tr key={rider._id}>
                  <td className="border p-2">{rider.name}</td>
                  <td className="border p-2">{rider.phone}</td>
                  <td className="border p-2">{rider.email}</td>
                  <td className="border p-2">{rider.vehicleType}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => deactivateMutation.mutate(rider._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
                <td colSpan="5" className="text-center p-4">
                  No riders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveRiders;
