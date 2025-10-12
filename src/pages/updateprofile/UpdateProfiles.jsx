import React, { useState } from 'react';
import UseAuth from '../../hooks/UseAuth';
import defaultImage from '../../assets/images/download.png';
import { Link } from 'react-router';
import axios from 'axios';

const UpdateProfiles = () => {
  const { user, updateUserProfiles } = UseAuth();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  if (!user) return null;

  const handleImageChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadClick = async () => {
   
    if (!selectedFile) {
      setError('দয়া করে একটি ছবি নির্বাচন করুন।');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);


    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`,
        formData
      );
 console.log("ImgBB Key:", import.meta.env.VITE_IMAGE_UPLOAD_KEY);
      const imageUrl = res.data.data.url;
      await updateUserProfiles({ photoURL: imageUrl });
      console.log('Profile picture updated successfully.');
      setOpenModal(false);
      setSelectedFile(null);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('ছবি আপলোডে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 pt-28 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-center text-gray-700">
        আপনার প্রোফাইল আপডেট করুন
      </h1>

      {/* প্রোফাইল ছবি */}
      <div className="flex justify-center mb-6">
        <img
          src={user.photoURL || defaultImage}
          alt="প্রোফাইল ছবি"
          className="h-24 w-24 rounded-full object-cover border-4 border-gray-300"
        />
      </div>

      {/* ইউজার ইমেইল দেখানো */}
      <p className="text-center mb-4 text-gray-600">{user.email}</p>

      {/* Update Profile Button */}
      <div className="flex gap-2 justify-center">
        <button
  onClick={() => setOpenModal(true)}
  className="py-2 px-6 rounded text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-700 transition"
>
  Update Profile
</button>

        <Link
  to="/"
  className="btn  py-2 px-4 rounded text-white bg-gradient-to-r from-lime-400 via-lime-500 to-green-500 hover:from-lime-500 hover:to-green-600 transition"
>
  Cancel
</Link>

      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm relative">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
              প্রোফাইল ছবি আপডেট করুন
            </h2>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mb-4 p-2 border border-gray-300 rounded cursor-pointer"
            />

            {/* Update Profile Button */}
            <button
              onClick={handleUploadClick}
              className="w-full mb-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
              disabled={loading}
            >
              {loading ? 'আপলোড হচ্ছে...' : 'ছবি আপডেট করুন'}
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => {
                setOpenModal(false);
                setSelectedFile(null);
                setError(null);
              }}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded transition"
            >
              Cancel
            </button>

            {error && <p className="text-center text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProfiles;
