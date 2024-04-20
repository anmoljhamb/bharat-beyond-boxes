import React from "react";
import { AuthContext } from "../contexts/AuthContext";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = (props: Props) => {
  const isSignedIn = false;

  return (
    <>
      <AuthContext.Provider value={{ isSignedIn }}>
        {props.children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
