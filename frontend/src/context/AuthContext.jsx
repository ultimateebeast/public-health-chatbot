import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { AuthContext } from "./index";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth) {
      console.error("Firebase not initialized");
      return;
    }

    try {
      const unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      });

      return () => unsub();
    } catch (err) {
      console.error("Auth state change error:", err);
      setTimeout(() => setLoading(false), 0);
    }
  }, []);

  const getErrorMessage = (error) => {
    const errorCode = error.code;
    const errorMap = {
      "auth/invalid-credential": "Invalid email or password",
      "auth/user-not-found": "User not found. Please sign up first",
      "auth/wrong-password": "Incorrect password",
      "auth/email-already-in-use": "Email already registered",
      "auth/weak-password": "Password should be at least 6 characters",
      "auth/invalid-email": "Invalid email address",
      "auth/user-disabled": "This account has been disabled",
      "auth/too-many-requests": "Too many login attempts. Try again later",
      "auth/network-request-failed": "Network error. Check your connection",
    };
    return errorMap[errorCode] || error.message || "Authentication error";
  };

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setError(null);
      return result;
    } catch (err) {
      const friendlyError = getErrorMessage(err);
      setError(friendlyError);
      const errorToThrow = new Error(friendlyError);
      errorToThrow.code = err.code;
      throw errorToThrow;
    }
  };

  const signup = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      setError(null);
      return result;
    } catch (err) {
      const friendlyError = getErrorMessage(err);
      setError(friendlyError);
      const errorToThrow = new Error(friendlyError);
      errorToThrow.code = err.code;
      throw errorToThrow;
    }
  };

  const logout = async () => {
    try {
      return await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
