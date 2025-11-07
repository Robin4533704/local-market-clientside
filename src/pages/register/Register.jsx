import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaCamera, FaCheck, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import UseAuth from "../../hooks/UseAuth";
import useAxios from "../../hooks/useAxios";

const Register = () => {
  const axiosInstance = useAxios();
  const {
    register: authRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm();

  const { createUser, updateUserProfiles } = UseAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const watchPassword = watch("password", "");

  // Image upload with validation
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(image.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Image Type",
        text: "Please upload JPEG, JPG, PNG, or GIF images only.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (image.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Please upload an image smaller than 5MB.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    const imgbbKey = import.meta.env.VITE_IMAGE_UPLOAD_KEY;

    if (!imgbbKey) {
      Swal.fire({
        icon: "error",
        title: "Configuration Error",
        text: "Image upload service is not configured properly.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    const url = `https://api.imgbb.com/1/upload?key=${imgbbKey}`;

    try {
      setImageUploading(true);
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setProfilePic(data.data.display_url);
        Swal.fire({
          icon: "success",
          title: "Image Uploaded!",
          text: "Your profile picture has been uploaded successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.error?.message || "Image upload failed");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Failed to upload image. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setImageUploading(false);
    }
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "" };
    
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
    if (password.match(/\d/)) strength += 1;
    if (password.match(/[^a-zA-Z\d]/)) strength += 1;
    
    const strengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong"][strength];
    const strengthColor = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500"
    ][strength];
    
    return { strength, text: strengthText, color: strengthColor };
  };

  const passwordStrength = getPasswordStrength(watchPassword);

  // Handle registration
  const onSubmit = async (data) => {
    try {
      // Create user in Firebase
      const result = await createUser(data.email, data.password);
      console.log("User created:", result);

      // Update user profile
      await updateUserProfiles({
        displayName: data.name.trim(),
        photoURL: profilePic || "/default-avatar.png",
      });

      // Prepare user data for backend
      const userInfo = {
        email: data.email.toLowerCase().trim(),
        role: "user",
        displayName: data.name.trim(),
        photoURL: profilePic || "/default-avatar.png",
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      // Save to database
      await axiosInstance.post("/users", userInfo, {
        headers: { "Content-Type": "application/json" },
      });

      // Success message
      await Swal.fire({
        icon: "success",
        title: "Welcome Aboard! 🎉",
        text: "Your account has been created successfully. You can now explore all features.",
        confirmButtonColor: "#10b981",
        confirmButtonText: "Get Started",
      });

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "Something went wrong during registration. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email address is already registered. Please use a different email or try logging in.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Your password is too weak. Please choose a stronger password with at least 6 characters including letters and numbers.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "The email address you entered is invalid. Please check and try again.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection and try again.";
      }

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
        confirmButtonColor: "#ef4444",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <FaUser className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join us today and start your journey
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <div className="relative">
                <input
                  {...authRegister("name", {
                    required: "Full name is required",
                    minLength: { 
                      value: 2, 
                      message: "Name must be at least 2 characters long" 
                    },
                    maxLength: {
                      value: 50,
                      message: "Name must be less than 50 characters"
                    }
                  })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  ⚠️ {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <div className="relative">
                <input
                  {...authRegister("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  ⚠️ {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <div className="relative">
                <input
                  {...authRegister("password", {
                    required: "Password is required",
                    minLength: { 
                      value: 6, 
                      message: "Password must be at least 6 characters" 
                    },
                    validate: {
                      hasNumber: value => /\d/.test(value) || "Should contain at least one number",
                      hasLetter: value => /[a-zA-Z]/.test(value) || "Should contain at least one letter"
                    }
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 pl-11 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {watchPassword && (
                <div className="space-y-2 mt-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.strength <= 1 ? "text-red-500" :
                      passwordStrength.strength <= 2 ? "text-orange-500" :
                      passwordStrength.strength <= 3 ? "text-blue-500" : "text-green-500"
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.strength <= 1 ? "bg-red-500 w-1/4" :
                        passwordStrength.strength <= 2 ? "bg-orange-500 w-1/2" :
                        passwordStrength.strength <= 3 ? "bg-blue-500 w-3/4" : "bg-green-500 w-full"
                      }`}
                    ></div>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  ⚠️ {errors.password.message}
                </p>
              )}
            </div>

            {/* Profile Picture Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
                <span className="text-gray-500 font-normal ml-1">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={imageUploading}
                />
                <FaCamera className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              {/* Upload Status */}
              <div className="flex items-center gap-2 text-sm mt-2">
                {imageUploading && (
                  <span className="text-blue-500 flex items-center gap-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent"></div>
                    Uploading image...
                  </span>
                )}
                {profilePic && !imageUploading && (
                  <span className="text-green-500 flex items-center gap-1">
                    <FaCheck className="text-green-500" />
                    Image uploaded successfully
                  </span>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="checkbox"
                  {...authRegister("terms", {
                    required: "You must accept the terms and conditions",
                  })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </div>
              <label className="text-sm text-gray-600">
                I agree to the{" "}
                <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                ⚠️ {errors.terms.message}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || imageUploading}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center pt-6 border-t border-gray-200 mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft size={14} />
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;