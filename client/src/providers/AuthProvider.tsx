import React, { useCallback, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { auth, db, provider } from "../firebase";
import { User, signInWithPopup } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { BUserDetails, VerifyUserDetails } from "../types";
import LoadingPage from "../pages/LoadingPage";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = (props: Props) => {
  const [firebaseLoading, setFirebaseLoading] = useState<boolean>(true);
  const [firestoreLoading, setFirestoreLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<BUserDetails | null>(null);
  const [verificationDetails, setVerificationDetails] =
    useState<VerifyUserDetails | null>(null);

  const loading = firebaseLoading || firestoreLoading;

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      console.log("userAuthChanged");
      setCurrentUser(user);
      setFirebaseLoading(false);
    });
    return unsub;
  }, []);

  const fetchVerificationDetails = useCallback(
    async (user: User | null) => {
      if (!user) {
        if (!firebaseLoading) setFirestoreLoading(false);
        return;
      }
      setIsLoading(true);
      const docRef = doc(db, "verificationDetails", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setVerificationDetails(docSnap.data() as VerifyUserDetails);
      } else {
        setVerificationDetails(null);
      }
      setIsLoading(false);
    },
    [firebaseLoading],
  );

  const fetchUserDetails = useCallback(
    async (user: User | null) => {
      if (!user) {
        if (!firebaseLoading) setFirestoreLoading(false);
        return;
      }
      setFirestoreLoading(true);
      const docRef = doc(db, "userDetails", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data() as BUserDetails);
      } else {
        setUserDetails(null);
      }
      setFirestoreLoading(false);
    },
    [firebaseLoading],
  );

  useEffect(() => {
    fetchUserDetails(currentUser);
    fetchVerificationDetails(currentUser);
  }, [currentUser, fetchUserDetails, fetchVerificationDetails]);

  async function signOut(): Promise<void> {
    setIsLoading(true);
    await auth.signOut();
    setIsLoading(false);
  }

  async function signIn(): Promise<void> {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      await fetchUserDetails(result.user);
      fetchVerificationDetails(result.user);
      setCurrentUser(result.user);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.code);
        console.log(error.message);
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function isSignedIn() {
    return currentUser !== null;
  }

  return (
    <>
      <AuthContext.Provider
        value={{
          isSignedIn,
          fetchUserDetails,
          verificationDetails,
          setVerificationDetails,
          userDetails,
          setUserDetails,
          signOut,
          signIn,
          isLoading,
          currentUser,
        }}
      >
        {loading ? <LoadingPage /> : props.children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
