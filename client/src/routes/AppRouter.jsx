import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
// Public Pages
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";

// Admin Pages
import AdminDashboard from "../admin/pages/AdminDashboard";
import RegisterStudent from "../admin/pages/RegisterStudent";
import RegisterTeacher from "../admin/pages/RegisterTeacher";
import CreateClass from "../admin/pages/CreateClass";
import CreateBatch from "../admin/pages/CreateBatch";
import CreateSubject from "../admin/pages/CreateSubject";
import TeacherAllocation from "../admin/pages/TeacherAllocation";
import Timetable from "../admin/pages/Timetable";

// Teacher Pages (to be created)
import TeacherDashboard from "../teacher/pages/TeacherDashboard";
import TeacherProfile from "../teacher/pages/TeacherProfile";
import TeacherAttendance from "../teacher/pages/TeacherAttendance";
import TeacherReports from "../teacher/pages/TeacherReports";
import TeacherClasses from "../teacher/pages/TeacherClasses";
import TeacherRegisterStudent from "../teacher/pages/TeacherRegisterStudent";

// Student Pages (to be created)
import StudentDashboard from "../student/pages/StudentDashboard";
import StudentProfile from "../student/pages/StudentProfile";
import StudentAttendance from "../student/pages/StudentAttendance";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/register-student"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <RegisterStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/register-teacher"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <RegisterTeacher />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/create-class"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateClass />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/create-batch"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateBatch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/create-subject"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateSubject />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/teacher-allocation"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <TeacherAllocation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/timetable"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Timetable />
          </ProtectedRoute>
        }
      />

      {/* Teacher Routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/profile"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/attendance"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/reports"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/classes"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherClasses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/register-student"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherRegisterStudent />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
