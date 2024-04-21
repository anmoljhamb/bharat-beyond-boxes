import { useContext, useEffect } from "react";
import { useAuth } from "../contexts";
import { useNavigate } from "react-router-dom";
import { BUserDetails } from "../types";
import HostHome from "../components/HostHome";
import TouristHome from "../components/TouristHome";
import GuideHome from "../components/GuideHome";
import TouristPref from "../components/TouristPref";
import HostPref from "../components/HostPref";
import GuidePref from "../components/GuidePref";
import { MessageContext } from "../contexts/MessageContext";

const ConnectPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { showMessage } = useContext(MessageContext)!;

  useEffect(() => {
    console.log(auth.userDetails);
    if (auth.userDetails) {
      return;
    }
    showMessage("User Details do not exist", "error");
    navigate("/user-details");
  }, [auth.userDetails, navigate, showMessage]);

  useEffect(() => {
    console.log(`Verification Details: ${auth.verificationDetails}`);
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
      {auth.userDetails &&
        auth.userDetails.role === "host" &&
        (auth.userPref ? <HostHome /> : "Please Add your pref")}
      {auth.userDetails &&
        auth.userDetails.role === "guide" &&
        (auth.userPref ? <GuideHome /> : "Please Add your pref")}
      {auth.userDetails &&
        auth.userDetails.role === "tourist" &&
        (auth.userPref ? <TouristHome /> : "Please Add your pref")}

      {auth.userDetails && auth.userDetails.role === "host" && <HostPref />}
      {auth.userDetails && auth.userDetails.role === "guide" && <GuidePref />}
      {auth.userDetails && auth.userDetails.role === "tourist" && (
        <TouristPref />
      )}
    </>
  );
};

export default ConnectPage;