import NavbarLink from "./NavbarLink";
import { useAuth } from "../contexts";

const Navbar = () => {
  const authContext = useAuth();

  return (
    <>
      <nav>
        {!authContext.isSignedIn && <NavbarLink text="Sign In" url="/signin" />}
        {authContext.isSignedIn && <NavbarLink text="Sign In" url="/signout" />}
      </nav>
    </>
  );
};

export default Navbar;
