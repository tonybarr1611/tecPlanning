import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Curriculum from "./pages/Curriculum";
import Schedule from "./pages/Schedule";
import Catalog from "./pages/Catalog";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <p className="text-gray-600 text-sm">Cargando aplicación...</p>
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route
        path="/welcome"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LandingPage />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/malla-curricular"
        element={
          <ProtectedRoute>
            <Layout>
              <Curriculum />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/horarios"
        element={
          <ProtectedRoute>
            <Layout>
              <Schedule />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/catalogo"
        element={
          <ProtectedRoute>
            <Layout>
              <Catalog />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
