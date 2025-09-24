import { useState, useEffect } from "react";
import service from "../../../../public/Services.json";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/UseAxiosSecure";
import UseAuth from "../../../hooks/UseAuth";

const BeARider = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();

  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    region: "",
    district: "",
    phone: "",
    nationalId: "",
    bikeBrand: "",
    bikeRegNumber: "",
    status: "pending",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill name/email from Firebase user
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  // Load unique regions
  useEffect(() => {
    const uniqueRegions = [...new Set(service.map(item => item.region))];
    setRegions(uniqueRegions);
  }, []);

  // Load districts based on region
  useEffect(() => {
    if (formData.region) {
      const filteredDistricts = [
        ...new Set(service
          .filter(item => item.region === formData.region)
          .map(item => item.district))
      ];
      setDistricts(filteredDistricts);
      setFormData(prev => ({ ...prev, district: "" }));
    } else {
      setDistricts([]);
      setFormData(prev => ({ ...prev, district: "" }));
    }
  }, [formData.region]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if user already exists
      const existing = await axiosSecure.get(`/riders?email=${formData.email}`);
      if (existing.data.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "User already exists! You cannot submit twice.",
        });
        setIsSubmitting(false);
        return;
      }

      // Submit new rider
      const res = await axiosSecure.post("/riders", formData);
      console.log('Rider submission response:', res.data);

      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "Your Be A Rider application has been submitted successfully.",
        });

        // Reset form fields except name/email
        setFormData(prev => ({
          ...prev,
          age: "",
          region: "",
          district: "",
          phone: "",
          nationalId: "",
          bikeBrand: "",
          bikeRegNumber: "",
        }));
      }
    } catch (error) {
      console.error("Error submitting application:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong! Please check the form and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto"
      >
        <h2 className="text-2xl font-semibold text-center">BeARider Registration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
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
                <option key={idx} value={region}>{region}</option>
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
              disabled={!formData.region}
              className="select select-bordered w-full"
            >
              <option value="">Select District</option>
              {districts.map((district, idx) => (
                <option key={idx} value={district}>{district}</option>
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

        <div className="pt-4">
          <button
            type="submit"
            className="btn bg-lime-300 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeARider;
