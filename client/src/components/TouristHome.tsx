import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts";
import { BGuidePref, BHostPref, BTouristPref } from "../types";
import { hashUIDS, initateChatWithUser } from "../utils";
import { useNavigate } from "react-router-dom";

const TouristHome = () => {
  const [lookingFor, setLookingFor] = useState<"guide" | "host">("host");
  const [results, setResults] = useState<BGuidePref[] | BHostPref[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const auth = useAuth();
  const navigate = useNavigate();

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
      <div className="flex justify-center items-center my-4">
        <button
          className="capitalize bg-bg-main text-white p-5 opacity-45 disabled:opacity-100"
          disabled={lookingFor === "guide"}
          onClick={() => setLookingFor("guide")}
        >
          guide
        </button>
        <button
          className="capitalize bg-bg-main text-white opacity-45 p-5 disabled:opacity-100"
          disabled={lookingFor === "host"}
          onClick={() => setLookingFor("host")}
        >
          host
        </button>
      </div>
      {results.length === 0 && <p>What you are looking for was not found.</p>}

      {results.length > 0 && (
        <ul className="">
          {results.map((userPref, index) => {
            if (lookingFor === "host") {
              userPref = userPref as BHostPref;
            }
            return (
              <li
                key={index}
                className="flex flex-col justify-center items-center my-2"
              >
                <div>
                  <table className="border border-black">
                    <tbody>
                      <tr className="border border-black">
                        <th>Languages they speak</th>
                        <td>{userPref.languages.join(", ")}</td>
                      </tr>
                      <tr className="border border-black">
                        <th>How Many people are they comfortable hosting?</th>
                        <td>{userPref.comfortableHosting}</td>
                      </tr>
                      <tr className="border border-black">
                        <th>
                          Price{" "}
                          {lookingFor === "host" ? " Per Day" : " Per Hour"}
                        </th>
                        <td>{userPref.price}</td>
                      </tr>
                      {lookingFor === "host" && (
                        <tr className="border border-black">
                          <th>Food Habits</th>
                          <td>{(userPref as BHostPref).foodHabits}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <button
                  className="bg-bg-main my-2 rounded-full px-4 py-2 text-white disabled:opacity-50"
                  disabled={isLoading}
                  onClick={async () => {
                    setIsLoading(true);
                    await initateChatWithUser(
                      auth.currentUser!.uid,
                      userPref.uid,
                    );
                    navigate(
                      `/chats?selectedChat=${hashUIDS(auth.currentUser!.uid, userPref.uid)}`,
                    );
                    setIsLoading(false);
                  }}
                >
                  Chat With Them
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default TouristHome;
