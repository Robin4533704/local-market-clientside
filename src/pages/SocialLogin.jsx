import React from 'react';
import UseAuth from '../hooks/UseAuth';
import UseAxios from '../hooks/UseAxios';
import { useNavigate } from 'react-router-dom';

const SocialLogin = () => {
  const axiosInstance = UseAxios()
  const navigate = useNavigate()
  const {signInGoogleUser} = UseAuth();
  const handleGoogleSignIn = ()=>{
    signInGoogleUser()
    .then(async (result) =>{
      const user = result.user;
      console.log(result.user);
       const userInfo = {
  email: user.email,
  role: 'user',
  created_at: new Date().toISOString(), // ✅ Corrected Date()
  last_log_in : new Date().toISOString()
};
const res = await axiosInstance.post('users', userInfo)
console.log('user update info',res.data);
navigate('/')

    })
    .catch(error =>{
      console.log(error.message);
    })
  }
    return (
        <div>
            <div className="text-center my-1 text-gray-500">OR</div>

        <button onClick={handleGoogleSignIn} className="btn w-full flex items-center gap-2 text-black border border-[#e5e5e5] 
                   bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500 
                   hover:from-sky-400 hover:to-sky-600 transition duration-200">
  <svg
    aria-label="Google logo"
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <g>
      <path d="m0 0H512V512H0" fill="#fff"></path>
      <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
      <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
      <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
      <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
    </g>
  </svg>
  Login with Google
</button> 
        </div>
    );
};

export default SocialLogin;