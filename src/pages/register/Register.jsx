import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import UseAuth from "../../hooks/UseAuth";
import SocialLogin from "../SocialLogin";
import axios from "axios";

const Register = () => {
  const axiosInstance = useAxios();
  const { register: authRegister, handleSubmit, formState: { errors } } = useForm();
  const { createUser, updateUserProfiles } = UseAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;

    try {
      const res = await axios.post(url, formData);
      if (res.data.success) {
        setProfilePic(res.data.data.display_url);
      }
    } catch (err) {
      console.error("Image upload error:", err);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Firebase signup
      const result = await createUser(data.email, data.password);
      console.log(result.user);
      // Firebase profile update
      await updateUserProfiles({
        displayName: data.name,
        photoURL: profilePic,
      });

      // MongoDB backend insert
      const userInfo = {
        email: data.email,
        role: "user",
        displayName: data.name,
        photoURL: profilePic,
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      await axiosInstance.post("/users", userInfo);

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "You have successfully created an account!",
        confirmButtonColor: "#22c55e",
      });

      navigate(from);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message || "Something went wrong!",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-md bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <input
          {...authRegister("name", { required: "Name required" })}
          placeholder="Name"
          className={`input input-bordered w-full ${errors.name ? "border-red-500" : ""}`}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        {/* Email */}
        <input
          {...authRegister("email", { required: "Email required" })}
          type="email"
          placeholder="Email"
          className={`input input-bordered w-full ${errors.email ? "border-red-500" : ""}`}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        {/* Password */}
        <div className="relative">
          <input
            {...authRegister("password", { required: "Password required", minLength: 6 })}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`input input-bordered w-full pr-10 ${errors.password ? "border-red-500" : ""}`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Profile Image */}
        <input type="file" onChange={handleImageUpload} accept="image/*" className="input w-full" />

        <button
          type="submit"
          className="btn w-full bg-green-500 hover:bg-green-600 text-white font-bold"
        >
          Register Now
        </button>
      </form>

      <p className="mt-2">
        Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
      </p>

      <SocialLogin />
    </div>
  );
};

export default Register;
