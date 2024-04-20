import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound.tsx";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext.tsx";
import HomePage from "./pages/HomePage.tsx";

export default function App() {
  const authContext = useContext(AuthContext)!;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={authContext.isSignedIn ? <HomePage /> : <LandingPage />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
