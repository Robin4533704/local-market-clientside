import axios from 'axios';
import UseAuth from './UseAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
  baseURL: 'http://localhost:5000'
});

const UseAxiosSecure = () => {
  const { user,  logOut } = UseAuth();
  const navigate = useNavigate();
 
  axiosSecure.interceptors.request.use(config => { 
     
        config.headers.Authorization = `Bearer ${user.accessToken}`;
        return config;
      },
      error =>{
        return Promise.reject(error);
      }
    )
      
   axiosSecure.interceptors.response.use(
  res =>{
  return res;
  } , error =>{
    console.log('inside res interceptor',error.status);
    const status = error.status;
     if(status === 401){
    navigate('/forbidden')
    }
    else if (status === 401){
      logOut()
      .then(() =>{
navigate('/logOut')
      })
      .catch((error) =>{
        console.error('logout error', error)
      })
    }
    return Promise.reject(error);
   
  }

);

  return axiosSecure;
};

export default UseAxiosSecure;
