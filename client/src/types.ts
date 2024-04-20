import { User } from "firebase/auth";

export type BAuthContext = {
  isSignedIn: boolean;
  signOut: () => Promise<void>;
  signIn: () => Promise<void>;
  isLoading: boolean;
  currentUser: User | null;
};
