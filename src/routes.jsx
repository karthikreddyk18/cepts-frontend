import { Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Route */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;