import React, { useEffect, useState } from 'react';
import UseAuth from '../hooks/UseAuth';
import UseAxios from '../hooks/UseAxios';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRedirectResult } from 'firebase/auth';
import { auth } from '../Firebase.config';
import Swal from 'sweetalert2';
import { FaGoogle, FaGithub, FaArrowRight } from 'react-icons/fa';

const SocialLogin = () => {
  const axiosInstance = UseAxios();
  const navigate = useNavigate();
  const location = useLocation();
  const { signInGoogleUser, githubSignIn } = UseAuth();
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState(null);
  const from = location.state?.from?.pathname || '/';

  // ✅ Handle redirect login result (mobile)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        setLoading(true);
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const user = result.user;
          console.log('Redirect Login User:', user);

          const userInfo = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid,
            role: 'user',
            provider: result.providerId,
            created_at: new Date().toISOString(),
            last_log_in: new Date().toISOString(),
          };

          await saveUserToDatabase(userInfo);
          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: `Welcome, ${user.displayName || user.email}!`,
            timer: 2000,
            showConfirmButton: false,
          });
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error('Redirect login error:', error);
        showErrorAlert(error);
      } finally {
        setLoading(false);
      }
    };
    handleRedirectResult();
  }, [navigate, from]);

  // ✅ Save user info to your backend
  const saveUserToDatabase = async (userInfo) => {
    try {
      await axiosInstance.post('/users', userInfo);
      console.log('User info saved:', userInfo.email);
    } catch (err) {
      if (err.response?.status === 409) {
        console.log('User already exists, updating login info...');
        await axiosInstance.patch(`/users/${userInfo.email}`, {
          last_log_in: new Date().toISOString(),
          photoURL: userInfo.photoURL,
          displayName: userInfo.displayName,
        });
      } else {
        throw err;
      }
    }
  };

  // ✅ Error alert handler
  const showErrorAlert = (error) => {
    let errorMessage = 'Social login failed! Please try again.';

    if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with this email. Please use a different login method.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Login popup was closed. Please try again.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Login popup was blocked. Please check your browser settings.';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'Login from this domain is not authorized.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection.';
    }

    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: errorMessage,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'OK',
    });
  };

  // ✅ Universal Social Sign In handler
  const handleSocialSignIn = async (providerFunction, providerName) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    try {
      setProviderLoading(providerName);
      const result = await providerFunction(isMobile);

      // Mobile redirect handled in useEffect
      if (!result && isMobile) return;

      if (result?.user) {
        const user = result.user;
        console.log(`${providerName} Login User:`, user);

        const userInfo = {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
          role: 'user',
          provider: providerName.toLowerCase(),
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        await saveUserToDatabase(userInfo);

        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: `Welcome, ${user.displayName || user.email}!`,
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error(`${providerName} login error:`, error);
      showErrorAlert(error);
    } finally {
      setProviderLoading(null);
    }
  };

  // ✅ Google & GitHub Login Functions
  const handleGoogleSignIn = () => handleSocialSignIn(signInGoogleUser, 'google');
  const handleGithubSignIn = () => handleSocialSignIn(githubSignIn, 'github');

  // ✅ Reusable Social Button
  const SocialButton = ({
    onClick,
    loading,
    providerLoading,
    providerName,
    icon: Icon,
    text,
    colorClass,
    iconColor,
  }) => (
    <button
      onClick={onClick}
      disabled={loading || providerLoading}
      className={`w-full flex items-center justify-center gap-3 font-medium py-3 px-4 rounded-lg transition-all duration-200 border 
        ${colorClass} 
        ${loading || providerLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:scale-105'}`}
    >
      {providerLoading === providerName ? (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
      ) : (
        <Icon size={20} className={iconColor} />
      )}
      {providerLoading === providerName ? 'Signing in...' : text}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Google Button */}
        <SocialButton
          onClick={handleGoogleSignIn}
          loading={loading}
          providerLoading={providerLoading}
          providerName="google"
          icon={FaGoogle}
          text="Continue with Google"
          colorClass="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          iconColor="text-red-500"
        />

        {/* GitHub Button */}
        <SocialButton
          onClick={handleGithubSignIn}
          loading={loading}
          providerLoading={providerLoading}
          providerName="github"
          icon={FaGithub}
          text="Continue with GitHub"
          colorClass="bg-gray-800 text-white border-gray-800 hover:bg-gray-900 hover:border-gray-900"
          iconColor="text-white"
        />
      </div>

      {/* Privacy Notice */}
      <div className="text-center">
        <p className="text-xs text-gray-500 mt-4">
          By signing in, you agree to our{' '}
          <button className="text-blue-500 hover:text-blue-600 underline transition-colors">
            Terms of Service
          </button>{' '}
          and{' '}
          <button className="text-blue-500 hover:text-blue-600 underline transition-colors">
            Privacy Policy
          </button>
        </p>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
            <FaArrowRight className="text-white text-xs" />
          </div>
          <div>
            <p className="text-sm text-blue-800 font-medium">Quick Sign In</p>
            <p className="text-xs text-blue-600 mt-1">
              Use your Google or GitHub account for faster, password-free access to your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLogin;