import { initializeApp } from "firebase/app";
import {
  browserPopupRedirectResolver,
  browserSessionPersistence,
  initializeAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAg0pkNmTIALHZEDyZnkleLXO0JuhRr5B8",
  authDomain: "bharat-beyond-boxes.firebaseapp.com",
  projectId: "bharat-beyond-boxes",
  storageBucket: "bharat-beyond-boxes.appspot.com",
  messagingSenderId: "297403677260",
  appId: "1:297403677260:web:22484e88c15bf1790652e9",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: browserSessionPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
});
export const db = getFirestore(app);
export default app;
export const provider = new GoogleAuthProvider();
