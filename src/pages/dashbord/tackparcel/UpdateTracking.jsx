import React from 'react';
import { useMutation } from '@tanstack/react-query';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';

const UpdateTracking = () => {
     const axiosSecure = UseAxiosSecure();

  const mutation = useMutation({
    mutationFn: async ({ trackingId, parcelId, status, location }) => {
      const res = await axiosSecure.post('/tracking', {
        trackingId,
        parcelId,
        status,
        location,
      });
      return res.data;
    },
  });

  return mutation;
};


export default UpdateTracking;