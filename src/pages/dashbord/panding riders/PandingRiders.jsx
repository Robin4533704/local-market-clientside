import React, { useState } from 'react';
import { FaEye, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import UseAuth from '../../../hooks/UseAuth';
import useAxiosSecure from '../../../hooks/UseAxiosSecure';



const PandingRiders = () => {
  const { user } = UseAuth(); // wait for auth state
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Open modal to show rider details
  const openModal = (rider) => {
    setSelectedRider(rider);
    setModalOpen(true);
  };

  // Fetch pending riders only if user exists
  const { data: riders = [], isLoading, refetch } = useQuery({
    queryKey: ['panding-riders'],
    enabled: !!user, // wait until user is loaded
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/riders/pending");
        return res.data;
      } catch (err) {
        console.error("Fetch pending riders error:", err);
        return [];
      }
    },
  });

  // Approve/Reject handler
  const handleDecision = async (riderId, action, email) => {
    const confirm = await Swal.fire({
      title: `${action === "approve" ? "Approve" : "Reject"} Application?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const status = action === "approve" ? "active" : "rejected";
      const res = await axiosSecure.patch(`/riders/${riderId}`, { status, email });

      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Rider ${status} successfully!`,
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        setModalOpen(false);
        refetch();
      }
    } catch (err) {
      console.error("Decision error:", err);
      Swal.fire({ icon: "error", title: "Error", text: err.message || "Error updating rider status" });
    }
  };

  if (!user) return <p className="text-center mt-4">Checking user...</p>;
  if (isLoading) return <p className="text-center mt-4">Loading pending riders...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Pending Riders</h2>
      {riders.length === 0 ? (
        <p>No pending riders found</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Region</th>
              <th className="border px-4 py-2">District</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider) => (
              <tr key={rider._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{rider.name}</td>
                <td className="border px-4 py-2">{rider.phone}</td>
                <td className="border px-4 py-2">{rider.email}</td>
                <td className="border px-4 py-2">{rider.region || 'N/A'}</td>
                <td className="border px-4 py-2">{rider.district || 'N/A'}</td>
                <td className="border px-4 py-2 flex justify-center gap-3">
                  <button onClick={() => openModal(rider)} title="View Details" className="text-blue-600 hover:text-blue-900 text-xl"><FaEye /></button>
                  <button onClick={() => handleDecision(rider._id, "approve", rider.email)} title="Approve Rider" className="text-green-600 hover:text-green-900 text-xl"><FaCheckCircle /></button>
                  <button onClick={() => handleDecision(rider._id, "reject", rider.email)} title="Reject Rider" className="text-red-600 hover:text-red-900 text-xl"><FaTimesCircle /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Rider Detail Modal */}
      {modalOpen && selectedRider && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">Rider Details</h3>
            <p><strong>Name:</strong> {selectedRider.name}</p>
            <p><strong>Phone:</strong> {selectedRider.phone}</p>
            <p><strong>Email:</strong> {selectedRider.email}</p>
            <p><strong>Region:</strong> {selectedRider.region || 'N/A'}</p>
            <p><strong>District:</strong> {selectedRider.district || 'N/A'}</p>
            <p><strong>Address:</strong> {selectedRider.address || 'N/A'}</p>
            <p><strong>Status:</strong> {selectedRider.status}</p>

            <div className="mt-6 flex justify-end gap-4">
              <button onClick={() => handleDecision(selectedRider._id, "approve", selectedRider.email)} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"><FaCheckCircle /> Approve</button>
              <button onClick={() => handleDecision(selectedRider._id, "reject", selectedRider.email)} className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"><FaTimesCircle /> Reject</button>
              <button onClick={() => setModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PandingRiders;
