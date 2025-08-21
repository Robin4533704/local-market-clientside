import React from 'react';
import UseAuth from "./UseAuth";
import UseAxiosSecure from "./UseAxiosSecure";
import { useQuery } from "@tanstack/react-query";


const useUserRole = () => {
  const { user, loading: authLoading } = UseAuth();
  const axiosSecure = UseAxiosSecure();

  const {
    data: role = 'user',
    isLoading: roleLoading,
    refetch,
  } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !authLoading && !! user?.email,
    queryFn: async () =>{
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data.role;
    }
  })
  return{ role, loading: authLoading || roleLoading,refetch}
};

export default useUserRole;
