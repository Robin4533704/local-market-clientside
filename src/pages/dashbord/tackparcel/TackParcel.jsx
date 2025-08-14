import React, { useState, useEffect } from 'react';
import UseAxiosSecure from '../../../hooks/UseAxiosSecure';
import Loading from '../../loading/Loading';

// Simple Loading Component


const TackParcel = () => {
  const [trackingId, setTrackingId] = useState('');
  const [parcelId, setParcelId] = useState('');
  const [status, setStatus] = useState('pending');
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState('');

  const axiosSecure = UseAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
useEffect(() => {
  setLoading(true);
 fetch('/public/Services.json')

    .then(res => res.json())
    .then(data => {
      console.log('Fetched locations:', data);
      setLocations(data || []);
      // প্রথম district default হিসেবে set করা
      if (data && data.length > 0 && data[0].district) {
        setLocation(data[0].district);
      }
    })
    .catch(err => {
      console.error('Error fetching locations:', err);
      setLocations([]);
      setLocation('');
    })
    .finally(() => setLoading(false));
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const res = await axiosSecure.post('/tracking', { trackingId, parcelId, status, location });
      if (res.status === 201) {
        setSuccess(true);
        setTrackingId('');
        setParcelId('');
        setStatus('pending');
        if (locations.length > 0) setLocation(locations[0].district);
        else setLocation('');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading/>
  }

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
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 rounded w-full"
        required
      >
        <option value="pending">Pending</option>
        <option value="in transit">In Transit</option>
        <option value="delivered">Delivered</option>
      </select>

  
<select
  value={location}
  onChange={(e) => setLocation(e.target.value)}
  className="border p-2 rounded w-full"
  required
>
  {locations.length > 0 ? (
    locations.map((loc, index) => (
      <option key={index} value={loc.district || loc.name}>
        {loc.district || loc.name}
      </option>
    ))
  ) : (
    <option disabled>No locations found</option>
  )}
</select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        Add Tracking Update
      </button>
      {success && <p className="text-green-600">✅ Tracking update added successfully!</p>}
      {error && <p className="text-red-500">❌ {error}</p>}
    </form>
  );
};

export default TackParcel;
