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
import { Link } from "react-router-dom";

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
    <section className="pt-14 w-full flex flex-col justify-center items-center">
      <h1 className="text-3xl">Hello, {auth.currentUser!.displayName}</h1>

      {auth.userDetails && !auth.userPref && (
        <div className="flex flex-col justify-center items-center w-full">
          <h2 className="text-2xl my-2">
            Your user preferences are not found. Please Fill Them
          </h2>
          <Link
            to={"/user-pref"}
            className="bg-bg-main rounded-full px-4 py-2 text-white"
          >
            Set User Preferences
          </Link>
        </div>
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
    </section>
  );
};

export default ConnectPage;
