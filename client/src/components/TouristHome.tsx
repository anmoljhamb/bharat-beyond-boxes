import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts";
import { BGuidePref, BHostPref, BTouristPref } from "../types";

const TouristHome = () => {
  const [lookingFor, setLookingFor] = useState<"guide" | "host">("host");
  const [results, setResults] = useState<BGuidePref[] | BHostPref[]>([]);
  const auth = useAuth();

  useEffect(() => {
    const fetch = async () => {
      const q = query(
        collection(db, "userPref"),
        where("role", "==", lookingFor),
        where("destination", "==", auth.userPref!.destination),
      );
      const querySnapshot = await getDocs(q);
      setResults(
        querySnapshot.docs.map((doc) => doc.data()) as
          | BGuidePref[]
          | BTouristPref[],
      );
    };

    fetch();
  }, [lookingFor, auth.userPref]);

  return (
    <>
      <h1>What are you looking for? </h1>
      <button
        className="capitalize bg-black text-white p-5 disabled:opacity-45"
        disabled={lookingFor === "guide"}
        onClick={() => setLookingFor("guide")}
      >
        guide
      </button>
      <button
        className="capitalize bg-black text-white p-5 disabled:opacity-45"
        disabled={lookingFor === "host"}
        onClick={() => setLookingFor("host")}
      >
        host
      </button>
      {results.length === 0 && <p>What you are looking for was not found.</p>}

      {results.length > 0 && (
        <ul>
          {results.map((userPref, index) => {
            return <li key={index}>{`${JSON.stringify(userPref)}`}</li>;
          })}
        </ul>
      )}
    </>
  );
};

export default TouristHome;
