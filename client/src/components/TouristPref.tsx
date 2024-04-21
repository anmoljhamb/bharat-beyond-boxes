import { FormEvent, useState } from "react";
import { useAuth } from "../contexts";
import { BTouristPref } from "../types";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const TouristPref = () => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const dummyData: BTouristPref = {
        languages: ["English"],
        foodHabits: "non-veg",
        destination: "Delhi",
        familyMembers: 1,
        comfortableHosting: 3,
        price: 5000,
        role: "tourist",
        uid: auth.currentUser!.uid,
      } satisfies BTouristPref;
      await setDoc(doc(db, "userPref", auth.currentUser!.uid), dummyData);
      auth.setUserPref(dummyData);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div>TouristPref</div>
      {auth.userPref && (
        <ul>
          {Object.keys(auth.userPref!).map((key) => {
            return <li key={key}>{key}: </li>;
          })}
        </ul>
      )}
      <form onSubmit={handleOnSubmit}>
        <button
          disabled={isLoading}
          className="bg-black text-white p-5 disabled:opacity-50"
        >
          Set Preferences
        </button>
      </form>
    </>
  );
};

export default TouristPref;
