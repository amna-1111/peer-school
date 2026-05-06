import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./components/protectedRoutes";

// Pages (we'll build these next)
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BrowseSkills from "./pages/BrowseSkills";
import InstructorProfile from "./pages/InstructorProfile";
import BookSession from "./pages/BookSession";
import MySessions from "./pages/MySessions";
import MyProfile from "./pages/MyProfile";
import Review from "./pages/Review";
import SkillDetail from "./pages/SkillDetails";
import FAQ from "./pages/FAQ";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function AppContent() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";
  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/skills" element={<BrowseSkills />} />
        <Route path="/skill/:skillId" element={<SkillDetail />} />

        <Route path="/instructor/:id" element={<InstructorProfile />} />
        <Route path="/faqs" element={<FAQ />} />
        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:skillId"
          element={
            <ProtectedRoute>
              <BookSession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions"
          element={
            <ProtectedRoute>
              <MySessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/review/:sessionId"
          element={
            <ProtectedRoute>
              <Review />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
