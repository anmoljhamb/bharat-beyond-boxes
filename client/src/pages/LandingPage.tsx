import {
  LandingCard1,
  LandingCard2,
  LandingCard3,
  LandingCard4,
  LandingHero,
} from "../assets";
import LandingCard from "../components/LandingCard";

const LandingPage = () => {
  return (
    <>
      <section className="h-screen relative overflow-hidden">
        <img
          src={LandingHero}
          className="w-full -z-10 h-full absolute object-cover"
        />
        <div className="bg-bg-secondary w-full h-full absolute z-0 opacity-65"></div>
        <div className="pt-32 md:pt-14 flex flex-col w-screen h-full justify-center items-center gap-4">
          <h1 className="text-4xl z-0 text-white text-center font-bold  md:text-7xl">
            Embrace India’s Infinite Spots
          </h1>
          <p className="z-0 text-white text-lg mx-10 md:mx-52 text-center md:text-3xl">
            Welcome to our one-stop travel companion for India! Discover, plan,
            and immerse yourself in the rich culture and beauty of India with
            ease and confidence
          </p>
        </div>
      </section>
      <section className="flex flex-col gap-12 bg-bg-light">
        <div className="h-screen w-full flex flex-col justify-center items-center">
          <LandingCard
            url="/generate-pdf"
            heading="Generate PDF"
            para="Plan. Print. Explore. Effortlessly create your personalized itinerary PDF. From trip specifics to local insights, emergency contacts to fare guides, we've got you covered. Everything you need for your journey – at your fingertips.
Start your adventure now!"
            image={LandingCard1}
          />
        </div>
        <div className="h-screen w-full flex flex-col justify-center items-center">
          <LandingCard
            url="/virtual-buddy"
            heading="Virtual Buddy"
            para="Got Queries? Say Hello to our Virtual Buddy: India's Insider Guide! Instant answers to all your travel queries, local tips, and must-see attractions. Navigate India like a pro with our chatbot companion. 
Start chatting now and unlock the
secrets of incredible India!"
            image={LandingCard2}
          />
        </div>
        <div className="h-screen capitalize w-full flex flex-col justify-center items-center">
          <LandingCard
            url="/connect"
            heading="Host A Tourist"
            para="Be the Host with the Most! Roll out the welcome mat for international guests and make memories together. Cook up cultural feasts and embark on sightseeing adventures.
Dive into global friendships that'll have you exchanging tales and travel tips 'round the clock!
"
            image={LandingCard3}
          />
        </div>
        <div className="h-screen w-full flex flex-col justify-center items-center">
          <LandingCard
            url="/connect"
            heading="Cultural Exchanges"
            para="Meet Your Match! Swipe through verified local host families eager to share their culture and make a new friend. Plan the Fun: Team up to craft activities that'll have you swapping stories and traditions 'til dawn. From shared dinners to dance-offs, build bonds that last a lifetime and cross borders."
            image={LandingCard4}
          />
        </div>
      </section>
    </>
  );
};

export default LandingPage;
