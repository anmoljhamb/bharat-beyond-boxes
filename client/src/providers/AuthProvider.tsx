import React, { useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { auth, provider } from "../firebase";
import { User, signInWithPopup } from "firebase/auth";
import { FirebaseError } from "firebase/app";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = (props: Props) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user === null) {
        setIsSignedIn(false);
      } else {
        setIsSignedIn(true);
      }
      setCurrentUser(user);
    });
    return unsub;
  }, []);

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
    // setIsLoading(true);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     setIsLoading(false);
    //     setIsSignedIn(true);
    //     resolve();
    //   }, 1500);
    // });
  }

  return (
    <>
      <AuthContext.Provider
        value={{ isSignedIn, signOut, signIn, isLoading, currentUser }}
      >
        {props.children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
