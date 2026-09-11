import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { BusinessPage } from "./pages/BusinessPage";
import { OpportunityMapPage } from "./pages/OpportunityMapPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/business"
        element={
          <ProtectedRoute>
            <BusinessPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/opportunity-map"
        element={
          <ProtectedRoute>
            <OpportunityMapPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
