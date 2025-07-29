import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import useAxiosSecure from "../../hooks/UseAxiosSecure";
import { AuthContext } from "../../constex/AuthContext";

const MyParcels = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ['myparcels', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    }
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-xl font-semibold mb-4">My Parcels</h2>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Created At</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((parcel, index) => (
            <tr key={parcel._id}>
              <td>{index + 1}</td>
              <td>
                <span className="capitalize">{parcel.type}</span>
              </td>
              <td>{new Date(parcel.creation_date).toLocaleDateString()}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                    parcel.payment_status === "paid" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {parcel.payment_status}
                </span>
              </td>
              <td>
                <button className="btn btn-sm btn-info mr-2">View</button>
                <button className="btn btn-sm text-white bg-lime-400">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyParcels;
