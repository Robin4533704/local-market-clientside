import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../loading/Loading";
import Swal from "sweetalert2";

import UseAuth from "../../hooks/UseAuth";
import { Link, useNavigate } from "react-router-dom"; 
import UseAxiosSecure from "../../hooks/UseAxiosSecure";

const MyParcels = () => {
  const { user } = UseAuth();
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ['parcels', user?.email],
    enabled: !!user?.email, 
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    }
  });

  const handlePay = (parcel) => {
    if (!parcel) return;

    const paymentData = {
      product: parcel,
      quantity: 1,
      subtotal: parcel.cost,
      discount: 0,
      total: parcel.cost,
      coupon: null,
      _id: parcel._id
    };

    // Navigate to payment form
    navigate(`/dashboard/parcelpayment/${parcel._id}`, { state: paymentData });
  };

  const handleDelete = (parcelId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/parcels/${parcelId}`)
          .then(res => {
            if (res.data.deletedCount > 0) {
              Swal.fire('Deleted!', 'Your parcel has been deleted.', 'success');
              queryClient.invalidateQueries(['parcels', user?.email]);
            }
          })
          .catch(() => {
            Swal.fire('Error!', 'There was an error deleting the parcel.', 'error');
          });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="text-center mt-10">
        <Loading />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-4">
      <table className="table table-zebra w-full min-w-[700px] text-sm border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Created At</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Cost</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Payment</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((parcel) => (
            <tr key={parcel._id} className="text-left">
              <td className="border border-gray-300 px-4 py-2 break-words">{parcel.title}</td>
              <td className="border border-gray-300 px-4 py-2">{parcel.type}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(parcel.creation_date).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">${parcel.cost}</td>
              <td className="border border-gray-300 px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                    parcel.payment_status === "paid" ? "bg-green-500" : "bg-pink-500"
                  }`}
                >
                  {parcel.payment_status || "unpaid"}
                </span>
              </td>
              <td className="border border-gray-300 px-4 py-2 space-y-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                  <Link to="/dashboard/payment-history" className="btn btn-xs btn-info text-white">View</Link>
                  
                  {parcel.payment_status !== 'paid' && (
                    <button
                      onClick={() => handlePay(parcel)}
                      className="btn btn-xs btn-success text-white"
                    >
                      Pay Now
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(parcel._id)}
                    className="btn btn-xs btn-error text-white"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyParcels;
