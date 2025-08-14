import React from 'react';
import UseAuth from '../../../hooks/UseAuth';
import { useQuery } from '@tanstack/react-query';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import Loading from '../../loading/Loading';

const PaymentHistry = () => {
  const { user } = UseAuth();
  const axiosSecure = UseAxiosSecure();

  const { isPending, data: payment = [] } = useQuery({
    queryKey: ['payment', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email, // ensures query only runs when email exists
  });

  if (isPending) {
    return <div className="p-4 text-center text-gray-500"> <Loading/> </div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Parcel ID</th>
              <th className="px-4 py-2 border">Amount</th>
            
              <th className="px-4 py-2 border">Transaction ID</th>
              <th className="px-4 py-2 border">Method</th>
              <th className="px-4 py-2 border">Paid At</th>
            </tr>
          </thead>
          <tbody>
            {payment.map((pay, index) => (
              <tr key={pay.transactionId || index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{index + 1}</td>
                <td className="px-4 py-2 border">{pay.parcelId}</td>
                <td className="px-4 py-2 border">${pay.amount}</td>
              
                <td className="px-4 py-2 border">{pay.transactionId}</td>
                <td className="px-4 py-2 border capitalize">{pay.paymentMethod}</td>
                <td className="px-4 py-2 border">{new Date(pay.paid_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {payment.length === 0 && (
          <div className="text-center py-4 text-gray-500">No payment records found.</div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistry;
