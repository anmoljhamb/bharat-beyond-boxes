import { useContext, useEffect } from "react";
import { useAuth } from "../contexts";
import { useNavigate } from "react-router-dom";
import HostHome from "../components/HostHome";
import TouristHome from "../components/TouristHome";
import GuideHome from "../components/GuideHome";
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

      {auth.userDetails && auth.userPref && (
        <div className="flex flex-col justify-center items-center w-full">
          <Link
            to={"/user-pref"}
            className="bg-bg-main my-2 rounded-full px-4 py-2 text-white"
          >
            Edit User Preferences
          </Link>
        </div>
      )}
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
        auth.userPref && <HostHome />}
      {auth.userDetails &&
        auth.userDetails.role === "guide" &&
        auth.userPref && <GuideHome />}
      {auth.userDetails &&
        auth.userDetails.role === "tourist" &&
        auth.userPref && <TouristHome />}
    </section>
  );
};

export default ConnectPage;
