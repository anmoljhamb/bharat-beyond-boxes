import { User } from "firebase/auth";
import * as Yup from "yup";

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
  name: string;
  email: string;
};

export type BAuthContext = {
  isSignedIn: () => boolean;
  signOut: () => Promise<void>;
  signIn: () => Promise<void>;
  isLoading: boolean;
  currentUser: User | null;
  userDetails: BUserDetails | null;
  setUserDetails: (arg0: BUserDetails | null) => void;
  verificationDetails: VerifyUserDetails | null;
  setVerificationDetails: (arg0: VerifyUserDetails | null) => void;
  fetchUserDetails: (user: User | null) => Promise<void>;
  userPref: BHostPref | BTouristPref | BGuidePref | null;
  setUserPref: (arg0: BHostPref | BGuidePref | null) => void;
};

export type VerifyUserDetails = {
  photoIdCard: string;
  addressProof: string;
};

export type Destination =
  | "Delhi"
  | "Rajasthan"
  | "Himachal Pradesh"
  | "Uttar Pradesh"
  | "Tamil Nadu";

export type Language = "English" | "Hindi" | "Tamil" | "French" | "Spanish";

export type Interest =
  | "adventure"
  | "arts-crafts"
  | "culture"
  | "entertainment"
  | "food-and-cuisine"
  | "heritage"
  | "luxury"
  | "nature"
  | "performing-arts"
  | "spiritual"
  | "wedding"
  | "yoga-wellness";

export type Accommodation = string;

export type BGuidePref = {
  destination: Destination;
  languages: string[];
  comfortableHosting: number;
  price: number;
  role: BUserRole;
  uid: string;
};

export type BHostPref = BGuidePref & {
  foodHabits: "veg" | "non-veg" | "vegan";
  familyMembers: number;
};

export type BTouristPref = {
  destination: Destination;
  languages: string[];
  familyMembers: number; // stands for the number of people that are coming
  comfortableHosting: number; // stands for the number that they'd feel comfortable with staying
  foodHabits: "veg" | "non-veg" | "vegan";
  price: number;
  role: BUserRole;
  uid: string;
};

export type Chats = {
  [hashed: string]: {
    uid: string;
  };
};

export type Message = {
  message: string;
  uid: string;
  createdAt: number;
};

export interface MessageContextInterface {
  showMessage(
    message: string,
    messageType?: "error" | "info" | "success" | "warning",
    messageDuration?: number,
  ): void;
}

export interface InitialValuesInterface {
  [key: string]: string;
}

export type FormField = {
  name: string;
  label: string;
} & (OtherFormField | OptionFormField);

interface OtherFormField {
  type: "text" | "password";
}

export interface AutoCompleteOption {
  label: string;
  value: string;
}

interface OptionFormField {
  type: "option";
  choices: AutoCompleteOption[];
  defaultValue?: AutoCompleteOption;
}

export type ValidationSchemaInterface = Yup.ObjectSchema<
  { [key: string]: string },
  Yup.AnyObject,
  { [key: string]: undefined },
  ""
>;
