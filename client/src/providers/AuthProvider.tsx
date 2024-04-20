import React, { useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { auth, provider } from "../firebase";
import { User, signInWithPopup } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { BUserDetails } from "../types";
import LoadingPage from "../pages/LoadingPage";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = (props: Props) => {
  // const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [firebaseLoading, setFirebaseLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<BUserDetails | null>(null);

  const loading = firebaseLoading;

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      console.log("userAuthChanged");
      setCurrentUser(user);
      setFirebaseLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    // fetch the user details
    setUserDetails(null);
  }, [currentUser]);

  async function signOut(): Promise<void> {
    setIsLoading(true);
    await auth.signOut();
    setIsLoading(false);
  }

  async function signIn(): Promise<void> {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      setCurrentUser(result.user);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.code);
        console.log(error.message);
      }
      console.error(error);
    }
    setIsLoading(false);
  }

  function isSignedIn() {
    return currentUser !== null;
  }

  return (
    <>
      <AuthContext.Provider
        value={{
          isSignedIn,
          userDetails,
          signOut,
          signIn,
          isLoading,
          currentUser,
        }}
      >
        {loading ? <LoadingPage /> : props.children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
