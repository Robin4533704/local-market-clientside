import React from 'react';
import { useForm } from 'react-hook-form';
import { FaLock } from 'react-icons/fa';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'; // react-router এর সঠিক import
import UseAuth from '../../hooks/UseAuth';
import SocialLogin from '../SocialLogin';
import Swal from 'sweetalert2';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
    const location = useLocation()
    const navigate = useNavigate()
   const from = location.state?.from?.pathname || '/';




  const { singInUser } = UseAuth();

  const onSubmit = (data) => {
    singInUser(data.email, data.password)
      .then((result) => {
      Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome back, ${result.user.email}!`,
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(from);
      })
      .catch((error) => {
        // কোনো এরর হলে
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.message || 'Something went wrong!',
        });
      });
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl mx-auto mt-10">
      <div className="card-body">
        <h1 className="text-3xl font-bold text-center mb-2">Login Now!</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: 'Enter a valid email address',
              },
            })}
            type="email"
            placeholder="Enter your email"
            className="input input-bordered w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          {/* Password */}
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            {...register('password', {
              required: 'Password is required',
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                message:
                  'Password must be at least 6 characters long and contain at least one letter and one number',
              },
            })}
            type="password"
            placeholder="Enter your password"
            className="input input-bordered w-full"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <div className="flex items-center justify-start gap-2 text-sm mt-2">
            <FaLock className="text-blue-500" />
            <Link to="/forgetpasword" className="link link-hover">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn text-white font-semibold w-full transition duration-200 hover:shadow-lg hover:scale-105 bg-gradient-to-r from-lime-400 via-lime-500 to-green-500 hover:from-lime-500 hover:to-green-600"
          >
            Login
          </button>
          <p>
            New to this website?
            <Link to="/register" className="btn text-lime-600 btn-link">
              Register
            </Link>
          </p>
        </form>
        <SocialLogin />
      </div>
    </div>
  );
};

export default Login;
