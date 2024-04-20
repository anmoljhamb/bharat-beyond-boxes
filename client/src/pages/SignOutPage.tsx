import { useEffect } from "react";
import { useAuth } from "../contexts";
import { useNavigate } from "react-router-dom";

const SignOutPage = () => {
  const auth = useAuth();
  const navigator = useNavigate();

  useEffect(() => {
    async function main() {
      await auth.signOut();
      navigator("/");
    }
    main();
  }, [auth, navigator]);

  return <div>Loging Out...</div>;
};

export default SignOutPage;
