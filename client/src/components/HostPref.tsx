import { FormEvent, useState } from "react";
import { useAuth } from "../contexts";
import { BGuidePref, BHostPref, BTouristPref } from "../types";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const HostPref = () => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const dummyData: BHostPref = {
        languages: ["Hindi", "English"],
        interests: ["luxury", "nature"],
        foodHabits: "non-veg",
        destination: "Delhi",
        accommodation: "Guest House",
        familyMembers: 5,
        comfortableHosting: 2,
        price: 3000,
        role: "host",
        uid: auth.currentUser!.uid,
      } satisfies BHostPref;
      await setDoc(doc(db, "userPref", auth.currentUser!.uid), dummyData);
      auth.setUserPref(dummyData);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div>HostPref</div>
      {auth.userPref && (
        <ul>
          {Object.keys(auth.userPref!).map((key) => {
            return (
              <li key={key}>
                {key}:{" "}
                {`${auth.userPref![key as keyof BHostPref | keyof BGuidePref | keyof BTouristPref]}`}
              </li>
            );
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

export default HostPref;
