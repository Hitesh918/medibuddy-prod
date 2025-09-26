import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// --- Route Protection Components ---
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthenticatedRedirect } from "./components/AuthenticatedRedirect";

// --- Layout Component ---
import SharedLayout from "./components/layout/SharedLayout";

// --- Page Components ---
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SymptomChecker from "./pages/SymptomChecker";
import TreatmentSearch from "./pages/TreatmentSearch";
import HospitalFinder from "./pages/HospitalFinder";
import ReportAnalysis from "./pages/ReportAnalysis";
import TreatmentJourney from "./pages/TreatmentJourney";
import BookConsultation from "./pages/BookConsultation";
import LoginWithOtp from "./pages/OTPLogin";
import PrescriptionManager from "./pages/PrescriptionManager";
import UserProfilePage from "./pages/UserProfile";

// A simple component for handling 404 Not Found pages
const NotFoundPage: React.FC = () => <h1>404: Page Not Found</h1>;

function App() {
  return (
    <Router>
      <Routes>
        {/*
          --- Public Routes ---
          These routes are for users who are NOT logged in.
          If a logged-in user tries to access them, they will be
          redirected to the dashboard.
        */}
        <Route
          path="/"
          element={
            <AuthenticatedRedirect>
              <Home />
            </AuthenticatedRedirect>
          }
        />
        <Route
          path="/login"
          element={
            <AuthenticatedRedirect>
              <Login />
            </AuthenticatedRedirect>
          }
        />
        <Route
          path="/otp-login"
          element={
            <AuthenticatedRedirect>
              <LoginWithOtp />
            </AuthenticatedRedirect>
          }
        />
        <Route
          path="/register"
          element={
            <AuthenticatedRedirect>
              <Register />
            </AuthenticatedRedirect>
          }
        />

        {/*
          --- Protected Routes ---
          These routes require the user to be logged in.
          They are nested within the SharedLayout, so they will
          all share the common Navbar and Footer.
        */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="symptom-checker" element={<SymptomChecker />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="treatments" element={<TreatmentSearch />} />
          <Route path="treatment-journey" element={<TreatmentJourney />} />
          <Route path="book-consultation" element={<BookConsultation />} />
          <Route path="prescriptions" element={<PrescriptionManager />} />
          <Route path="hospitals" element={<HospitalFinder />} />
          <Route path="report-analysis" element={<ReportAnalysis />} />
        </Route>

        {/* --- Catch-all 404 Route --- */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
