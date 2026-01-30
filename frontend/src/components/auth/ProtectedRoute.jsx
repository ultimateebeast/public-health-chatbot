import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  console.log("ProtectedRoute user:", user);
  console.log("ProtectedRoute loading:", loading);

  // Wait until Context finishes loading user from localStorage
  if (loading) {
    return <div style={{ color: "white", padding: 20 }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
