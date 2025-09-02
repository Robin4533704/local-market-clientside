import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";
import { LoaderIcon } from "react-hot-toast";
import { FaSearch } from "react-icons/fa"; // search icon

const ActiveRiders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [queryTerm, setQueryTerm] = useState("");
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  const handleSearch = () => {
    setQueryTerm(searchTerm); // button চাপলে search হবে
  };

  const fetchRiders = async () => {
    const { data } = await axiosSecure.get("/riders/active", {
      params: { search: queryTerm },
    });
    return data;
  };

  const { data: riders = [], isLoading } = useQuery({
    queryKey: ["activeRiders", queryTerm],
    queryFn: fetchRiders,
    keepPreviousData: true,
  });

  const deactivateMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/riders/${id}`, { status: "inactive" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["activeRiders"]);
      Swal.fire({
        icon: "success",
        title: "Rider Deactivated",
        text: "The rider has been successfully deactivated.",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong!",
      });
    },
  });

  if (isLoading)
    return (
      <p className="text-center mt-6">
        <LoaderIcon className="w-12 h-12 mx-auto text-green-500" />
      </p>
    );

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Active Riders
      </h2>

      {/* সার্চ বক্স + আইকন */}
      <div className="flex items-center justify-center md:justify-start mb-6 border border-gray-300 rounded-lg px-3 py-2 w-full md:w-64 focus-within:ring-2 focus-within:ring-green-400">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="ml-2 text-white bg-green-500 px-3 py-1 rounded flex items-center"
        >
          <FaSearch className="mr-1" /> Search
        </button>
      </div>

      {/* ডেস্কটপ টেবিল */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-green-100">
            <tr>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Phone</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">National Id</th>
              <th className="border p-3 text-left">District</th>
              <th className="border p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {riders.length > 0 ? (
              riders.map((rider) => (
                <tr key={rider._id} className="hover:bg-green-50 transition-colors duration-200">
                  <td className="border p-3">{rider.name}</td>
                  <td className="border p-3">{rider.phone}</td>
                  <td className="border p-3">{rider.email}</td>
                  <td className="border p-3">{rider.nationalId}</td>
                  <td className="border p-3">{rider.district}</td>
                  <td className="border p-3 text-center">
                    <button
                      onClick={() => deactivateMutation.mutate(rider._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg shadow-sm transition"
                      disabled={deactivateMutation.isLoading}
                    >
                      {deactivateMutation.isLoading ? "Processing..." : "Deactivate"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No riders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* মোবাইল কার্ড */}
      <div className="md:hidden space-y-4">
        {riders.length > 0 ? (
          riders.map((rider) => (
            <div key={rider._id} className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition">
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
