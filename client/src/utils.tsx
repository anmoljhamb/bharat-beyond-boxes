import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const showMessage = (message: string) => {
  alert(message);
};

export const uploadImage = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

const hashUIDS = (str1: string, str2: string) => {
  if (str1 < str2) return str1 + str2;
  else return str2 + str1;
};

export const initateChatWithUser = async (
  currUser: string,
  targetUser: string,
) => {
  const hashed = hashUIDS(currUser, targetUser);
  const docRef = doc(db, "chats", hashed);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return;
  await setDoc(docRef, { messages: [] });
  await setDoc(doc(db, "userChats", currUser), {
    hashed: {
      uid: targetUser,
    },
  });
  await setDoc(doc(db, "userChats", targetUser), {
    hashed: {
      uid: currUser,
    },
  });
};
