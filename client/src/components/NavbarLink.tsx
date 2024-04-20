import { Link } from "react-router-dom";

type Props = {
  text: string;
  url: string;
};

const NavbarLink = (props: Props) => {
  return (
    <Link className="text-blue-500" to={props.url}>
      {props.text}
    </Link>
  );
};

export default NavbarLink;
