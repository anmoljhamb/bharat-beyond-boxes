import NavbarLink from "./NavbarLink";
import { useAuth } from "../contexts";

const Navbar = () => {
  const auth = useAuth();

  return (
    <>
      <nav>
        {!auth.isSignedIn() && <NavbarLink text="Sign In" url="/signin" />}
        {auth.isSignedIn() && <button onClick={auth.signOut}>Sign Out</button>}
      </nav>
    </>
  );
};

export default Navbar;
