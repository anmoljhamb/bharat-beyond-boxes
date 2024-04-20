import { Link } from "react-router-dom";
import { useAuth } from "../contexts";

const HostHome = () => {
  const auth = useAuth();

  return (
    <>
      <div>HostHome</div>
      {!auth.userDetails!.isVerified && (
        <div>
          You are not verified! Please Verify to show your profile to others.
          <Link to={"/verify"} className="text-blue-500">
            Verify
          </Link>
        </div>
      )}
    </>
  );
};

export default HostHome;
