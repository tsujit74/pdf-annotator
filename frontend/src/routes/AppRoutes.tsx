import React, { type JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import Dashboard from "../pages/Dashboard";
import Viewer from "../pages/Viewer";
import { isLoggedIn } from "../../utils/auth";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/auth" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/viewer/:uuid"
        element={
          <ProtectedRoute>
            <Viewer />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={isLoggedIn() ? "/dashboard" : "/auth"} />} />
    </Routes>
  );
};

export default AppRoutes;
