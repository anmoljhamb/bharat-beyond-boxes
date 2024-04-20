import { useEffect } from "react";
import { useAuth } from "../contexts";
import { showMessage } from "../utils";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.userDetails) {
      return;
    }
    showMessage("User Details do not exist");
    navigate("/user-details");
  }, [auth.userDetails, navigate]);

  return (
    <>
      <h1>HomePage</h1>
      <p>Hello, {auth.currentUser!.displayName}</p>
      <p>{auth.currentUser!.email}</p>
    </>
  );
};

export default HomePage;
