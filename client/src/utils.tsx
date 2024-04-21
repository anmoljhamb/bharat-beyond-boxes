import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
  let docRef = doc(db, "chats", hashed);
  let docSnap = await getDoc(docRef);
  if (docSnap.exists()) return;
  await setDoc(docRef, { messages: [] });
  docRef = doc(db, "userChats", currUser);
  docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    await setDoc(docRef, {
      [hashed]: {
        uid: targetUser,
      },
    });
  } else {
    await setDoc(docRef, {
      ...docSnap.data(),
      [hashed]: {
        uid: targetUser,
      },
    });
  }
  docRef = doc(db, "userChats", targetUser);
  docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    await setDoc(docRef, {
      [hashed]: {
        uid: currUser,
      },
    });
  } else {
    await setDoc(docRef, {
      ...docSnap.data(),
      [hashed]: {
        uid: currUser,
      },
    });
  }
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const objectLength = <T extends Record<PropertyKey, unknown>>(
  obj: T,
) => {
  return Object.keys(obj).length;
};
