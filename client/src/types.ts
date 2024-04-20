export type BAuthContext =
  | { isSignedIn: true; signOut: () => Promise<void> }
  | { isSignedIn: false; signIn: () => Promise<void> };
