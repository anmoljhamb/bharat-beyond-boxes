import { useEffect } from "react";
import { useAuth } from "../contexts";
import { showMessage } from "../utils";
import { useNavigate } from "react-router-dom";
import { BUserDetails } from "../types";
import HostHome from "../components/HostHome";
import TouristHome from "../components/TouristHome";
import GuideHome from "../components/GuideHome";
import TouristPref from "../components/TouristPref";
import HostPref from "../components/HostPref";
import GuidePref from "../components/GuidePref";

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

  useEffect(() => {
    console.log(auth.verificationDetails);
  }, [auth.verificationDetails]);

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
      {auth.userDetails && auth.userDetails.role === "host" && <HostHome />}
      {auth.userDetails && auth.userDetails.role === "guide" && <GuideHome />}
      {auth.userDetails && auth.userDetails.role === "tourist" && (
        <TouristHome />
      )}
      {auth.userDetails && auth.userDetails.role === "host" && <HostPref />}
      {auth.userDetails && auth.userDetails.role === "guide" && <GuidePref />}
      {auth.userDetails && auth.userDetails.role === "tourist" && (
        <TouristPref />
      )}
    </>
  );
};

export default HomePage;
