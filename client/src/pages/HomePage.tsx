import {
  LandingCard1,
  LandingCard2,
  LandingCard3,
  LandingCard4,
} from "../assets";
import HomeCard from "../components/HomeCard";
import { useAuth } from "../contexts";

const HomePage = () => {
  const auth = useAuth();

  return (
    <>
      <section className="pt-32 md:pt-14">
        <div className="px-4 pt-8 pb-16 justify-center items-center content-center w-full gap-10 gap-y-20 mx-auto bg-bg-light grid grid-rows-2 grid-cols-2 overflow-hidden">
          <HomeCard
            url="/generate-pdf"
            heading="Generate PDF"
            para="Plan. Print. Explore. Effortlessly create your personalized itinerary PDF. From trip specifics to local insights, emergency contacts to fare guides, we've got you covered. Everything you need for your journey – at your fingertips.
Start your adventure now!"
            image={LandingCard1}
          />
          <HomeCard
            url="/virtual-buddy"
            heading="Virtual Buddy"
            para="Got Queries? Say Hello to our Virtual Buddy: India's Insider Guide! Instant answers to all your travel queries, local tips, and must-see attractions. Navigate India like a pro with our chatbot companion. 
Start chatting now and unlock the
secrets of incredible India!"
            image={LandingCard2}
          />
          {auth.userDetails && (
            <>
              {auth.userDetails!.role === "host" && (
                <HomeCard
                  url="/connect"
                  heading="Host"
                  para="Be the Host with the Most! Roll out the welcome mat for international guests and make memories together. Cook up cultural feasts and embark on sightseeing adventures.
Dive into global friendships that'll have you exchanging tales and travel tips 'round the clock!
"
                  image={LandingCard3}
                />
              )}
              {auth.userDetails!.role === "guide" && (
                <HomeCard
                  url="/connect"
                  heading="Guide a Tourist"
                  para="Be the Host with the Most! Roll out the welcome mat for international guests and make memories together. Cook up cultural feasts and embark on sightseeing adventures.
Dive into global friendships that'll have you exchanging tales and travel tips 'round the clock!
"
                  image={LandingCard3}
                />
              )}
              {auth.userDetails!.role === "tourist" && (
                <HomeCard
                  url="/connect"
                  heading="Cultural Exchanges"
                  para="Meet Your Match! Swipe through verified local host families eager to share their culture and make a new friend. Plan the Fun: Team up to craft activities that'll have you swapping stories and traditions 'til dawn. From shared dinners to dance-offs, build bonds that last a lifetime and cross borders."
                  image={LandingCard4}
                />
              )}
            </>
          )}
          {!auth.userDetails && (
            <>
              <HomeCard
                url="/connect"
                heading="Cultural Exchanges"
                para="Meet Your Match! Swipe through verified local host families eager to share their culture and make a new friend. Plan the Fun: Team up to craft activities that'll have you swapping stories and traditions 'til dawn. From shared dinners to dance-offs, build bonds that last a lifetime and cross borders."
                image={LandingCard4}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;
