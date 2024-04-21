import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts";
import { SignInPageImg } from "../assets";

const SignInPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <section className="w-full flex h-screen">
      <div className="w-3/5 h-screen relative">
        <img
          src={SignInPageImg}
          className="w-full -z-10 h-full absolute object-cover"
        />
        <div className="bg-bg-secondary w-full h-full absolute z-0 opacity-65"></div>
        <div className="pt-32 md:pt-14 h-screen flex flex-col justify-end items-center w-full overflow-hidden">
          <h1 className="text-5xl w-5/6 text-center text-white z-10 my-5 font-bold">
            Unlock your personalised India Tourism Experience
          </h1>
        </div>
      </div>
      <div className="pt-32 md:pt-14 h-screen flex flex-col justify-center items-center bg-bg-light w-2/5 overflow-hidden">
        <h1 className="text-5xl text-bg-main my-5 font-bold">Namaste!</h1>
        <button
          disabled={auth.isLoading}
          onClick={async () => {
            await auth.signIn();
            navigate("/");
          }}
          className="bg-white text-bg-main rounded-full text-2xl font-semibold p-4 disabled:opacity-50"
        >
          Sign In With Google
        </button>
      </div>
    </section>
  );
};

export default SignInPage;
