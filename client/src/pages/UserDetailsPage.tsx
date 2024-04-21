import { useContext, useState } from "react";
import {
  BUserDetails,
  BUserRole,
  Gender,
  InitialValuesInterface,
} from "../types";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../contexts";
import { db } from "../firebase";
import { BForm } from "../components/Form";
import { userDetailsValidator } from "../validators/userDetails";
import { MessageContext } from "../contexts/MessageContext";
import { useNavigate } from "react-router-dom";

const UserDetailsPage = () => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showMessage } = useContext(MessageContext)!;
  const navigate = useNavigate();

  return (
    <section className="pt-14">
      <div className="w-[60%] h-screen justify-center items-center flex flex-col mx-auto">
        <h1 className="text-3xl text-center">User Details Form</h1>
        <BForm
          buttonText="Save Details"
          loading={isLoading}
          validationSchema={userDetailsValidator}
          initialValues={
            auth.userDetails
              ? ({ ...auth.userDetails } as unknown as InitialValuesInterface)
              : {
                  dob: "",
                  role: "",
                  gender: "",
                  nationality: "",
                  phoneNumber: "",
                }
          }
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
                { label: "Tourist", value: "tourist" },
                { label: "Host", value: "host" },
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
          onSubmit={async (values) => {
            console.log(values);
            setIsLoading(true);
            try {
              const userDetails: BUserDetails = {
                isVerified: false,
                name: auth.currentUser!.displayName!,
                email: auth.currentUser!.email!,
                gender: values.gender as Gender,
                dob: values.dob,
                role: values.role as BUserRole,
                nationality: values.nationality,
                phoneNumber: values.phoneNumber,
              };
              await setDoc(
                doc(db, "userDetails", auth.currentUser!.uid),
                userDetails,
              );
              auth.setUserDetails(userDetails);
              showMessage("User Details saved successfully!", "success");
              setTimeout(() => {
                navigate("/connect");
              }, 1000);
            } catch (error) {
              console.error(error);
            }
            setIsLoading(false);
          }}
        />
      </div>
    </section>
  );
};

export default UserDetailsPage;
