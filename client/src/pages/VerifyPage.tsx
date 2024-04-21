import { useContext, useState } from "react";
import { VerifyUserDetails } from "../types";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../contexts";
import { db } from "../firebase";
import { BForm } from "../components/Form";
import { MessageContext } from "../contexts/MessageContext";
import { useNavigate } from "react-router-dom";

const VerifyPage = () => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showMessage } = useContext(MessageContext)!;
  const navigate = useNavigate();

  return (
    <section className="pt-14">
      <div className="w-[60%] h-screen justify-center items-center flex flex-col mx-auto">
        <h1 className="text-3xl text-center">Verify User Details Form</h1>
        <BForm
          buttonText="Save Details"
          loading={isLoading}
          initialValues={
            auth.verificationDetails
              ? { ...auth.verificationDetails }
              : {
                  photoIdCard: "",
                  addressProof: "",
                }
          }
          formFields={[
            {
              name: "photoIdCard",
              type: "text",
              label:
                "Enter the link to one of your government issues photo id card",
            },
            {
              name: "addressProof",
              type: "text",
              label:
                "Enter the link to one of your government issues address proof",
            },
          ]}
          onSubmit={async (values) => {
            console.log(values);
            setIsLoading(true);
            try {
              const verificationDetails: VerifyUserDetails = {
                addressProof: values.addressProof,
                photoIdCard: values.photoIdCard,
              };
              await setDoc(
                doc(db, "verificationDetails", auth.currentUser!.uid),
                verificationDetails,
              );
              auth.setVerificationDetails(verificationDetails);
              showMessage(
                "User Verification Details saved successfully!",
                "success",
              );
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

export default VerifyPage;
