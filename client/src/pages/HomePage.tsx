import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts";

const HomePage = () => {
  const authContext = useAuth();
  const navigator = useNavigate();

  return (
    <>
      <button
        className=""
        onClick={async () => {
          await authContext.signOut();
          navigator("/");
        }}
      >
        Sign Out
      </button>
    </>
  );
};

export default HomePage;
