// AuthProvider.jsx
import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  signInWithPopup,sendEmailVerification,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  updateProfile,
 sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "../Firebase.config";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // create/register user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  
  };
const sendVerificationEmail = () => {
  if (auth.currentUser) {
    return sendEmailVerification(auth.currentUser)
      .then(() => console.log("Verification email sent!"))
      .catch(err => console.log("Email send error:", err));
  } else {
    console.log("No user logged in");
  }
};

const sendPassword = (email) =>{
  return sendPasswordResetEmail(auth, email)
  .then(() => {
    console.log("password reset email sent")
  })
}

  // sign in user (login)
  const signInUser = (email, password) => {
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
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // update user profiles
  const updateUserProfiles = (profileInfo) => {
    return updateProfile(auth.currentUser, profileInfo);
  };

  // password reset
  const passwordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // track user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      console.log("user in the auth state change", currentUser);

      if (currentUser) {
        const token = await currentUser.getIdToken(true);
        localStorage.setItem("fbToken", token);
        console.log("FB Token saved:", token);
      } else {
        localStorage.removeItem("fbToken");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    createUser,
    signInUser,
    passwordReset,
    logOut,
    signInGoogleUser,
    updateUserProfiles,
    user,
    loading,sendVerificationEmail,sendPassword 
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
