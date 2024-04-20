import { useAuth } from "../contexts";

const HomePage = () => {
  const auth = useAuth();

  return (
    <>
      <h1>HomePage</h1>
      <p>Hello, {auth.currentUser!.displayName}</p>
      <p>{auth.currentUser!.email}</p>
    </>
  );
};

export default HomePage;
