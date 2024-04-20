import { User } from "firebase/auth";

export type Country = string;
export type Gender = "m" | "f" | "o";
export type BUserRole = "tourist" | "guide" | "host";

export type BUserDetails = {
  phoneNumber: string;
  dob: string;
  nationality: Country;
  gender: Gender;
  role: BUserRole;
  isVerified: boolean;
};

export type BAuthContext = {
  isSignedIn: () => boolean;
  signOut: () => Promise<void>;
  signIn: () => Promise<void>;
  isLoading: boolean;
  currentUser: User | null;
  userDetails: BUserDetails | null;
  setUserDetails: (arg0: BUserDetails | null) => void;
};

export type VerifyUserDetails = {
  photoIdCard: string;
  addressProof: string;
};
