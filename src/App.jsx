import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import StudentDashboard from './pages/studentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EditCourse from './pages/EditCourse';
import CourseStats from './pages/CourseStats';
import ProtectedRoute from './components/ProtectedRoute';

const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role === 'Admin') return <AdminDashboard />;
  if (user.role === 'Faculty') return <FacultyDashboard />;
  return <StudentDashboard />;
};

const HomeRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  return <Navigate to="/courses" />;
};


const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 font-sans">

            <Navbar />

            <Routes>

              {/* ✅ FIXED ROOT */}
              <Route path="/" element={<HomeRedirect />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<CourseDetails />} />

              <Route path="/edit-course/:id" element={
                <ProtectedRoute roles={['Faculty', 'Admin']}>
                  <EditCourse />
                </ProtectedRoute>
              } />

              <Route path="/course-stats/:id" element={
                <ProtectedRoute roles={['Faculty', 'Admin']}>
                  <CourseStats />
                </ProtectedRoute>
              } />

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute roles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/faculty" element={
                <ProtectedRoute roles={['Faculty', 'Admin']}>
                  <FacultyDashboard />
                </ProtectedRoute>
              } />

              {/* ✅ OPTIONAL: fallback route */}
              <Route path="*" element={<Navigate to="/" />} />

            </Routes>

          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;