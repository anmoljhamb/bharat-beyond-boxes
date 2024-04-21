import { Link } from "react-router-dom";

type Props = {
  heading: string;
  para: string;
  image: string;
  url: string;
};

function LandingCard(props: Props) {
  return (
    <div className="w-2/3 h-3/4 bg-grad1 p-12 relative">
      <div className="w-full h-full border-4 border-white rounded-md flex flex-col justify-between py-5 px-4">
        <h1 className="text-5xl font-bold text-white">{props.heading}</h1>
        <p className="text-3xl font-semibold text-white w-3/4">{props.para}</p>
        <Link
          to={props.url}
          className="text-3xl font-semibold text-white px-4 py-2 border-[3px] w-44 flex justify-center rounded-md cursor-pointer items-center border-bg-main"
        >
          Explore!
        </Link>
      </div>
      <img
        src={props.image}
        alt=""
        className="absolute w-64 object-contain h-[26rem] inset-auto bottom-0 translate-y-1/4 right-0"
      />
    </div>
  );
}

export default LandingCard;
