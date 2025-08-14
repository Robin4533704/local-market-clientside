import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { auth } from '../Firebase.config';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // create/register user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // sign in user (login)
  const singInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // sign out user
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // sign in with Google
  const signInGoogleUser = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider(); // ✅ instantiate it properly
    return signInWithPopup(auth, provider);
  };

  // update user profiles
  const updateUserProfiles = profileInfo =>{
    return updateProfile(auth.currentUser, profileInfo);

  }



  // track user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log('user in the auth state change', currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo = {
    createUser,
    singInUser,
    logOut,
    signInGoogleUser,
    user,
    loading,updateUserProfiles,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
