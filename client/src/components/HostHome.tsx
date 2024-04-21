import { Link } from "react-router-dom";
import { useAuth } from "../contexts";

const HostHome = () => {
  const auth = useAuth();

  return (
    <>
      {!auth.userDetails!.isVerified && !auth.verificationDetails && (
        <div className="text-3xl text-center">
          You are not verified! <br /> Please Verify to show your profile to
          others.
          <br />
          <Link to={"/verify"} className="text-blue-500">
            Verify
          </Link>
        </div>
      )}
      {auth.verificationDetails && !auth.userDetails!.isVerified && (
        <div className="text-3xl text-center">
          Please wait while we verify you!
          <br />
          <button
            disabled={auth.isLoading}
            className="bg-bg-main rounded-none text-lg px-4 py-2 text-white"
            onClick={() => auth.fetchUserDetails(auth.currentUser)}
          >
            Refresh Status
          </button>
        </div>
      )}
      {auth.userDetails!.isVerified && (
        <>
          <div className="text-3xl text-center">
            Congratulations, you're verified
          </div>
          <p className="text-lg text-center">
            Checkout the{" "}
            <Link className="text-blue-500" to={"/chats"}>
              Chat
            </Link>{" "}
            section to look out for opportunities.
          </p>
        </>
      )}
    </>
  );
};

export default HostHome;
