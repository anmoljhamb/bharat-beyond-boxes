import React from "react";
import { useAuth } from "../contexts";

type Props = {
  protectedElement: React.ReactNode;
  unprotectedElement: React.ReactNode;
};

const ProtectedElement = (props: Props) => {
  const auth = useAuth();
  if (auth.isSignedIn()) return <>{props.protectedElement}</>;
  return <>{props.unprotectedElement}</>;
};

export default ProtectedElement;
