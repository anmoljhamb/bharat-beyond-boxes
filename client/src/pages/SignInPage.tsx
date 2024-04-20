import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts";

const SignInPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div>SignInPage</div>
      <button
        disabled={auth.isLoading}
        onClick={async () => {
          await auth.signIn();
          navigate("/");
        }}
        className="bg-black text-white p-4 disabled:opacity-50"
      >
        Sign In{" "}
      </button>
    </>
  );
};

export default SignInPage;
