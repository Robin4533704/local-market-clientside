import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../loading/Loading';
import useAxiosSecure from '../../../hooks/UseAxiosSecure';
import UseAuth from '../../../hooks/UseAuth';

const PaymentHistory = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();

  const { isLoading, data: payments = [] } = useQuery({
    queryKey: ['payment', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      console.log('Payment API response:', res.data); // debug
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Loading />
      </div>
    );
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
            {payments.map((pay, index) => (
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
        {payments.length === 0 && (
          <div className="text-center py-4 text-gray-500">No payment records found.</div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
