import { useEffect } from "react";
import { useAuth } from "../contexts";
import { showMessage } from "../utils";
import { useNavigate } from "react-router-dom";
import { BUserDetails } from "../types";

const HomePage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(auth.userDetails);
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
      {auth.userDetails && (
        <ul>
          {Object.keys(auth.userDetails!).map((key) => {
            return (
              <li key={key}>
                {key}: {`${auth.userDetails![key as keyof BUserDetails]}`}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default HomePage;
