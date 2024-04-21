import { LandingHero } from "../assets";

const LandingPage = () => {
  return (
    <section className="h-screen relative overflow-hidden">
      <img
        src={LandingHero}
        className="w-full -z-10 h-full absolute object-cover"
      />
      <div className="bg-bg-secondary w-full h-full absolute z-0 opacity-40"></div>
      <div className="pt-32 md:pt-14 flex flex-col w-screen h-full justify-center items-center gap-4">
        <h1 className="text-4xl z-0 text-white text-center font-bold  md:text-7xl">
          Embrace India’s Infinite Spots
        </h1>
        <p className="z-0 text-white text-lg mx-10 md:mx-52 text-center md:text-3xl">
          Welcome to our one-stop travel companion for India! Discover, plan,
          and immerse yourself in the rich culture and beauty of India with ease
          and confidence
        </p>
      </div>
    </section>
  );
};

export default LandingPage;
