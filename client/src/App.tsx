import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound.tsx";
import HomePage from "./pages/HomePage.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import Navbar from "./components/Navbar.tsx";
import UserDetailsPage from "./pages/UserDetailsPage.tsx";
import ProtectedElement from "./components/ProtectedRoute.tsx";
import VerifyPage from "./pages/VerifyPage.tsx";
import ChatsPage from "./pages/ChatsPage.tsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedElement
              protectedElement={<HomePage />}
              unprotectedElement={<LandingPage />}
            />
          }
        />
        <Route
          path="/signin"
          element={
            <ProtectedElement
              protectedElement={<HomePage />}
              unprotectedElement={<SignInPage />}
            />
          }
        />
        <Route
          path="/verify"
          element={
            <ProtectedElement
              protectedElement={<VerifyPage />}
              unprotectedElement={<Navigate to={"/"} />}
            />
          }
        />
        <Route
          path="/chats"
          element={
            <ProtectedElement
              protectedElement={<ChatsPage />}
              unprotectedElement={<Navigate to={"/"} />}
            />
          }
        />
        <Route
          path="/user-details"
          element={
            <ProtectedElement
              protectedElement={<UserDetailsPage />}
              unprotectedElement={<Navigate to={"/"} />}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
