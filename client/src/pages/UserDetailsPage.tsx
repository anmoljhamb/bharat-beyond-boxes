import { FormEvent, useState } from "react";
import { BUserDetails } from "../types";
import { collection, doc, setDoc } from "firebase/firestore";
import { useAuth } from "../contexts";
import { db } from "../firebase";

const UserDetailsPage = () => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const dummyUserData: BUserDetails = {
        dob: "29/08/2002",
        role: "host",
        gender: "m",
        nationality: "india",
        phoneNumber: "+918700619766",
        isVerified: false,
      } satisfies BUserDetails;
      await setDoc(
        doc(db, "userDetails", auth.currentUser!.uid),
        dummyUserData,
      );
      auth.setUserDetails(dummyUserData);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div>UserDetailsPage</div>
      <form onSubmit={handleOnSubmit}>
        <button
          disabled={isLoading}
          className="bg-black text-white p-5 disabled:opacity-50"
          type="submit"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default UserDetailsPage;
