import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ChatbotPage from "./pages/Chatbot";
import Profile from "./pages/Profile";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navbar from "./components/layout/Navbar";

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 800 },
    h2: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 800 },
    h3: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Poppins", "Inter", sans-serif', fontWeight: 600 },
    button: { fontFamily: '"Inter", sans-serif', textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatbotPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar />
        <AnimatedRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
