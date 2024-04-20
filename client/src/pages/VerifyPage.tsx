import { FormEvent, useState } from "react";
import { showMessage, uploadImage } from "../utils";
import { useNavigate } from "react-router-dom";
import { VerifyUserDetails } from "../types";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts";

const VerifyPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const dummyData: VerifyUserDetails = {
      photoIdCard: "photoIdCard",
      addressProof: "addressProof",
    } satisfies VerifyUserDetails;
    try {
      const promises = [uploadImage(), uploadImage()];
      await Promise.all(promises);
      navigate("/");
      showMessage("Uploaded Data, Please wait for verifcation");
      await setDoc(
        doc(db, "verificationDetails", auth.currentUser!.uid),
        dummyData,
      );
      auth.setVerificationDetails(dummyData);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div>VerifyPage</div>
      <form onSubmit={handleOnSubmit}>
        <button
          disabled={isLoading}
          className="bg-black text-white p-5 disabled:opacity-50"
          type="submit"
        >
          Upload
        </button>
      </form>
    </>
  );
};

export default VerifyPage;
