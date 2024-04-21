import { Link, useLocation } from "react-router-dom";

type Props = {
  text: string;
  url: string;
};

const NavbarLink = (props: Props) => {
  const location = useLocation();
  const isActive = location.pathname === props.url;

  return (
    <Link
      className={
        isActive ? "font-bold text-white md:text-lg" : "text-white md:text-lg"
      }
      to={props.url}
    >
      {props.text}
    </Link>
  );
};

export default NavbarLink;
