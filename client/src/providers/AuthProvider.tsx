import React, { useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = (props: Props) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function signOut(): Promise<void> {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        setIsSignedIn(false);
        resolve();
      }, 1500);
    });
  }

  function signIn(): Promise<void> {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        setIsSignedIn(true);
        resolve();
      }, 1500);
    });
  }

  return (
    <>
      <AuthContext.Provider value={{ isSignedIn, signOut, signIn, isLoading }}>
        {props.children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
