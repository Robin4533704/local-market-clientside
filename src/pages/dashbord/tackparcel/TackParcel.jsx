import React, { useState } from 'react';
import updateTracking from '../../../pages/dashbord/tackparcel/UpdateTracking';

const TackParcel = () => {
  const [trackingId, setTrackingId] = useState('');
  const [parcelId, setParcelId] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');
  const { mutate, isPending, isSuccess, error } = updateTracking();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ trackingId, parcelId, status, location });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow rounded max-w-md">
      <input
        type="text"
        placeholder="Tracking ID"
        value={trackingId}
        onChange={(e) => setTrackingId(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      <input
        type="text"
        placeholder="Parcel ID"
        value={parcelId}
        onChange={(e) => setParcelId(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      <input
        type="text"
        placeholder="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {isPending ? 'Submitting...' : 'Add Tracking Update'}
      </button>

      {isSuccess && <p className="text-green-600">✅ Tracking update added!</p>}
      {error && <p className="text-red-500">❌ {error.message}</p>}
    </form>
  );
};

export default TackParcel;
