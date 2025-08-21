import React, { useState } from 'react';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../hooks/UseAxiosSecure';


const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
const axiosSecure = UseAxiosSecure()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // () অবশ্যই দিতে হবে

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await axiosSecure.post('/contact', formData);
    if (res.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: `Thank you, ${formData.name}!`,
        timer: 3000,
        showConfirmButton: false
      });
      setFormData({ name: '', email: '', message: '' });
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.response?.data?.error || 'Something went wrong!'
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-lg mx-auto pt-16 pb-12 sm:pt-24 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">Name:</label>
          <input
            type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">Email:</label>
          <input
            type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="message" className="block mb-1 font-medium">Message:</label>
          <textarea
            id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <button
          type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
