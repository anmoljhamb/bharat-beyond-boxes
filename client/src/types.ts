export type BAuthContext = {
  isSignedIn: boolean;
  signOut: () => Promise<void>;
  signIn: () => Promise<void>;
  isLoading: boolean;
};
