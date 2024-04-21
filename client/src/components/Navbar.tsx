import NavbarLink from "./NavbarLink";
import { useAuth } from "../contexts";
import { Logo } from "../assets";
import { Link } from "react-router-dom";

const Navbar = () => {
  const auth = useAuth();

  return (
    <>
      <nav className="flex flex-col py-2 md:flex-row justify-between h-18 md:h-14 items-center px-4 bg-bg-main">
        <Link
          to={"/"}
          className="h-10 rounded-full w-32 bg-white flex justify-center items-center"
        >
          <img src={Logo} alt="" className="w-6 h-8" />
          B-Cube
        </Link>
        <ul className="w-full justify-end gap-4 flex flex-row items-center">
          <NavbarLink text="Home" url="/" />
          <NavbarLink text="Virtual Buddy" url="/virtual-buddy" />
          <NavbarLink text="Generate PDF" url="/generate-pdf" />
          <NavbarLink text="Connect" url="/connect" />
          {auth.isSignedIn() && <NavbarLink text="Chats" url="/chats" />}
          {!auth.isSignedIn() && (
            <Link
              className="text-white text-lg bg-bg-light px-4 py-1 rounded-full"
              to="/signin"
            >
              Sign In
            </Link>
          )}
          {auth.isSignedIn() && (
            <button
              onClick={auth.signOut}
              className="text-white text-lg bg-bg-light px-4 py-1 rounded-full"
            >
              Sign Out
            </button>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
