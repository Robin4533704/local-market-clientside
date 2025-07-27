import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import UseAuth from "../../hooks/UseAuth";
import Swal from "sweetalert2";
import { Link } from "react-router";
import SocialLogin from "../SocialLogin";

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
 const {createUser} = UseAuth()
  const onSubmit = (data) => {
  console.log("Form data:", data);
  createUser(data.email, data.password)
    .then((result) => {
      console.log(result.user);
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "You have successfully created an account!",
        confirmButtonColor: "#22c55e"
      });
    })
    .catch((error) => {
      console.error("error", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message || "Something went wrong!",
        confirmButtonColor: "#ef4444"
      });
    });
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-md bg-white">
      <h1 className="text-2xl font-bold mb-2 text-center">Create Account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Name */}
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          {...register("name", { 
            required: "Name is required", 
            pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces allowed" } 
          })}
          placeholder="Name"
          className={`input input-bordered w-full ${errors.name ? "border-red-500" : ""}`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}

        {/* Email */}
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          {...register("email", { 
            required: "Email is required", 
            pattern: { 
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
              message: "Invalid email address" 
            } 
          })}
          type="email"
          placeholder="Email"
          className={`input input-bordered w-full ${errors.email ? "border-red-500" : ""}`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}

        {/* Photo URL */}
        <label className="label">
          <span className="label-text">Photo URL</span>
        </label>
        <input
          {...register("photo", { 
            required: "Photo URL is required",
            pattern: {
              value: /^(ftp|http|https):\/\/[^ "]+$/,
              message: "Invalid URL"
            }
          })}
          placeholder="Photo URL"
          className={`input input-bordered w-full ${errors.photo ? "border-red-500" : ""}`}
        />
        {errors.photo && (
          <p className="text-red-500 text-sm mt-1">{errors.photo.message}</p>
        )}

        {/* Password */}
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <div className="relative">
          <input
            {...register("password", { 
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" }
            })}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`input input-bordered w-full pr-10 ${errors.password ? "border-red-500" : ""}`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn text-white font-semibold w-full transition duration-200 hover:shadow-lg hover:scale-105 bg-gradient-to-r from-lime-400 via-lime-500 to-green-500 hover:from-lime-500 hover:to-green-600"
        >
          Register Now
        </button>
        <p>Alrady have a accout ? <Link to="/login" className="btn btn-link">Login</Link></p>
      </form>
      <SocialLogin/>
     
    </div>
  );
};

export default Register;
