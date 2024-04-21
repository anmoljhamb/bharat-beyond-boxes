import { FormEvent, useState } from "react";
import { BUserDetails } from "../types";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../contexts";
import { db } from "../firebase";
import { BForm } from "../components/Form";

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
        name: auth.currentUser!.displayName!,
        email: auth.currentUser!.email!,
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
    <section className="pt-14">
      <div className="w-[60%] flex flex-col mx-auto">
        <h1 className="text-3xl text-center">User Details Form</h1>
        <BForm
          buttonText="Save Details"
          loading={isLoading}
          initialValues={{
            dob: "",
            role: "",
            gender: "",
            nationality: "",
            phoneNumber: "",
          }}
          formFields={[
            {
              name: "dob",
              type: "text",
              label: "Date of Birth",
            },
            {
              name: "role",
              type: "option",
              label: "Role",
              choices: [
                { label: "Guide", value: "guide" },
                { label: "Tourist", value: "Tourist" },
                { label: "Host", value: "Host" },
              ],
            },
            {
              name: "gender",
              type: "option",
              label: "Gender",
              choices: [
                { label: "Male", value: "m" },
                { label: "Female", value: "f" },
                { label: "Non-Binary", value: "o" },
              ],
            },
            {
              name: "nationality",
              type: "text",
              label: "Nationality",
            },
            {
              name: "phoneNumber",
              type: "text",
              label: "Phone Number",
            },
          ]}
          onSubmit={(values) => {
            console.log(values);
          }}
        />
      </div>
      <form onSubmit={handleOnSubmit}>
        <button
          disabled={isLoading}
          className="bg-black text-white p-5 disabled:opacity-50"
          type="submit"
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default UserDetailsPage;
