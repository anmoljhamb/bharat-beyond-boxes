import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound.tsx";
import HomePage from "./pages/HomePage.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import Navbar from "./components/Navbar.tsx";
import { useAuth } from "./contexts/index.ts";
import SignOutPage from "./pages/SignOutPage.tsx";

export default function App() {
  const authContext = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authContext.isSignedIn ? <HomePage /> : <LandingPage />}
        />
        <Route
          path="/signin"
          element={!authContext.isSignedIn ? <SignInPage /> : <HomePage />}
        />
        <Route
          path="/signout"
          element={authContext.isSignedIn ? <SignOutPage /> : <HomePage />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
