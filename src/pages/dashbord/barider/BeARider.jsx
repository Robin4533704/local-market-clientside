import { useState, useEffect } from "react";

import service from "../../../../public/Services.json"; // your service centers data
import Swal from "sweetalert2";
import UseAuth from "../../../hooks/UseAuth";
 import UseAxiosSecure from "../../../hooks/UseAxiosSecure";

const BeARider = () => {
  const { user } = UseAuth(); // Assuming user has displayName and email
  const [regions, setRegions] = useState([]);
   const axiosSecure = UseAxiosSecure();
  const [districts, setDistricts] = useState([]);
  
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    age: "",
    region: "",
    district: "",
    phone: "",
    nationalId: "",
    bikeBrand: "",
    bikeRegNumber: "",
    status: "pending",
  });

  // Load unique regions from serviceCenters data
  useEffect(() => {
    const uniqueRegions = [...new Set(service.map(item => item.region))];
    setRegions(uniqueRegions);
  }, []);

  // Load districts based on selected region
  useEffect(() => {
    if (formData.region) {
      const filteredDistricts =service
        .filter(item => item.region === formData.region)
        .map(item => item.district);
      setDistricts(filteredDistricts);
    } else {
      setDistricts([]);
    }
  }, [formData.region]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit form
const handleSubmit = (e) => {
  e.preventDefault();

  axiosSecure.post("/riders", formData)
    .then(res => {
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "Your Be A Rider application has been submitted successfully.",
        });

        // Reset form after success
        setFormData({
          name: user?.displayName || "",
          email: user?.email || "",
          age: "",
          region: "",
          district: "",
          phone: "",
          nationalId: "",
          bikeBrand: "",
          bikeRegNumber: "",
          status: "pending",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: "Could not save your application. Please try again.",
        });
      }
    })
    .catch(error => {
      console.error("Error submitting application:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please check the form and try again.",
      });
    });
};



  return (
  <form
  onSubmit={handleSubmit}
  className="space-y-6 bg-white p-6 rounded shadow max-w-4xl mx-auto"
>
  <h2 className="text-2xl font-semibold text-center">Bearer Registration</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Name */}
    <div>
      <label className="block mb-1 font-medium">Full Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        readOnly
        className="input input-bordered w-full bg-gray-100"
      />
    </div>

    {/* Email */}
    <div>
      <label className="block mb-1 font-medium">Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        readOnly
        className="input input-bordered w-full bg-gray-100"
      />
    </div>

    {/* Age */}
    <div>
      <label className="block mb-1 font-medium">Age</label>
      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        required
        className="input input-bordered w-full"
      />
    </div>

    {/* Region */}
    <div>
      <label className="block mb-1 font-medium">Region</label>
      <select
        name="region"
        value={formData.region}
        onChange={handleChange}
        required
        className="select select-bordered w-full"
      >
        <option value="">Select Region</option>
        {regions.map((region, idx) => (
          <option key={idx} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>

    {/* District */}
    <div>
      <label className="block mb-1 font-medium">District</label>
      <select
        name="district"
        value={formData.district}
        onChange={handleChange}
        required
        className="select select-bordered w-full"
        disabled={!formData.region}
      >
        <option value="">Select District</option>
        {districts.map((district, idx) => (
          <option key={idx} value={district}>
            {district}
          </option>
        ))}
      </select>
    </div>

    {/* Phone */}
    <div>
      <label className="block mb-1 font-medium">Phone Number</label>
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
        className="input input-bordered w-full"
      />
    </div>

    {/* National ID */}
    <div>
      <label className="block mb-1 font-medium">National ID Card Number</label>
      <input
        type="text"
        name="nationalId"
        value={formData.nationalId}
        onChange={handleChange}
        required
        className="input input-bordered w-full"
      />
    </div>

    {/* Bike Brand */}
    <div>
      <label className="block mb-1 font-medium">Bike Brand</label>
      <input
        type="text"
        name="bikeBrand"
        value={formData.bikeBrand}
        onChange={handleChange}
        required
        className="input input-bordered w-full"
      />
    </div>

    {/* Bike Registration Number */}
    <div>
      <label className="block mb-1 font-medium">Bike Registration Number</label>
      <input
        type="text"
        name="bikeRegNumber"
        value={formData.bikeRegNumber}
        onChange={handleChange}
        required
        className="input input-bordered w-full"
      />
    </div>
  </div>

  {/* Hidden Status */}
  <input type="hidden" name="status" value="pending" />

  {/* Submit */}
  <div className="pt-4">
    <button type="submit" className="btn bg-lime-300 w-full">
      Submit Application
    </button>
  </div>
</form>

  );
};

export default BeARider;
