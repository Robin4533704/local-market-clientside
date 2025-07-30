import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../loading/Loading";
import Swal from "sweetalert2";
import { AuthContext } from "../../constex/AuthContext";
import useAxiosSecure from "../../hooks/UseAxiosSecure";
import UseAuth from "../../hooks/UseAuth";

const MyParcelsTable = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ['parcels', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    }
  });
     const handlePay = (id) =>{
      console.log("proceed to payment for", id);
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
              Swal.fire('Deleted!',
                 'Your parcel has been deleted.', 'success');
              queryClient.invalidateQueries(['parcels']);
            }
          })
          .catch(() => {
            Swal.fire('Error!', 'There was an error deleting the parcel.', 'error');
          });
      }
    });
  };

  if (isLoading) return <p className="text-center mt-10"> <Loading></Loading> </p>;

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
          <td className="border border-gray-300 px-4 py-2">{new Date(parcel.creation_date).toLocaleString()}</td>
          <td className="border border-gray-300 px-4 py-2">{parcel.cost}</td>
          <td className="border border-gray-300 px-4 py-2">
            <span
              className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                parcel.payment_status === "paid" ? "bg-green-500" : "bg-pink-500"
              }`}
            >
              {parcel.payment_status}
            </span>
          </td>
          <td className="border border-gray-300 px-4 py-2 space-y-1">
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
              <button className="btn btn-xs btn-info text-white">View</button>
              <button onClick={handlePay} className="btn btn-xs btn-success text-white">Pay</button>
              <button onClick={() => handleDelete(parcel._id)} className="btn btn-xs btn-error text-white">Delete</button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default MyParcelsTable;
