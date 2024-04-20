import { Link } from "react-router-dom";
import { useAuth } from "../contexts";

const HostHome = () => {
  const auth = useAuth();

  return (
    <>
      <div>HostHome</div>
      {!auth.userDetails!.isVerified && !auth.verificationDetails && (
        <div>
          You are not verified! Please Verify to show your profile to others.
          <Link to={"/verify"} className="text-blue-500">
            Verify
          </Link>
        </div>
      )}
      {auth.verificationDetails && !auth.userDetails!.isVerified && (
        <div>
          Please wait while we verify you!
          <button
            disabled={auth.isLoading}
            className="bg-black text-white p-5 disabled:opacity-50"
            onClick={() => auth.fetchUserDetails(auth.currentUser)}
          >
            Refresh Status
          </button>
        </div>
      )}
      {auth.userDetails!.isVerified && (
        <div>Congratulations, you're verified</div>
      )}
    </>
  );
};

export default HostHome;
