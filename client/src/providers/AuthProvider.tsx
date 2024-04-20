import React, { useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = (props: Props) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  function signOut(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsSignedIn(false);
        resolve();
      }, 1500);
    });
  }

  function signIn(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsSignedIn(true);
        resolve();
      }, 1500);
    });
  }

  return (
    <>
      <AuthContext.Provider value={{ isSignedIn, signOut, signIn }}>
        {props.children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
