import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound.tsx";
import ConnectPage from "./pages/ConnectPage.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import Navbar from "./components/Navbar.tsx";
import UserDetailsPage from "./pages/UserDetailsPage.tsx";
import ProtectedElement from "./components/ProtectedRoute.tsx";
import VerifyPage from "./pages/VerifyPage.tsx";
import ChatsPage from "./pages/ChatsPage.tsx";
import VirtualBuddyPage from "./pages/VirtualBuddyPage.tsx";
import GeneratePdfPage from "./pages/GeneratePdfPage.tsx";
import HomePage from "./pages/HomePage.tsx";

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
          path="/connect"
          element={
            <ProtectedElement
              protectedElement={<ConnectPage />}
              unprotectedElement={<Navigate to={"/signin"} />}
            />
          }
        />
        <Route
          path="/signin"
          element={
            <ProtectedElement
              protectedElement={<ConnectPage />}
              unprotectedElement={<SignInPage />}
            />
          }
        />
        <Route path="/virtual-buddy" element={<VirtualBuddyPage />} />
        <Route
          path="/generate-pdf"
          element={
            <ProtectedElement
              protectedElement={<GeneratePdfPage />}
              unprotectedElement={<Navigate to={"/signin"} />}
            />
          }
        />
        <Route
          path="/verify"
          element={
            <ProtectedElement
              protectedElement={<VerifyPage />}
              unprotectedElement={<Navigate to={"/signin"} />}
            />
          }
        />
        <Route
          path="/chats"
          element={
            <ProtectedElement
              protectedElement={<ChatsPage />}
              unprotectedElement={<Navigate to={"/signin"} />}
            />
          }
        />
        <Route
          path="/user-details"
          element={
            <ProtectedElement
              protectedElement={<UserDetailsPage />}
              unprotectedElement={<Navigate to={"/signin"} />}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
