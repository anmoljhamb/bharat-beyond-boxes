import React from "react";
import { AuthContext } from "../contexts/AuthContext";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = (props: Props) => {
  return (
    <>
      <AuthContext.Provider value={null}>{props.children}</AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
