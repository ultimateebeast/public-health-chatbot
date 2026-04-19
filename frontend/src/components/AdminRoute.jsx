import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context";

const ADMIN_EMAIL = "pratyushjain1000@gmail.com";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  // 🟡 WAIT until auth loads
  if (loading) {
    return <div style={{ color: "white", padding: "20px" }}>Loading...</div>;
  }

  // 🔴 Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 🔴 Not admin
  if (user.email !== ADMIN_EMAIL) {
    return <div style={{ color: "white", padding: "20px" }}>Access Denied</div>;
  }

  // ✅ Admin access
  return children;
}
