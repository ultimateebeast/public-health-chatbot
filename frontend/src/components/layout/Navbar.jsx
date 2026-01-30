import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ColorModeContext } from "../../context/ThemeContext";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from "@mui/material/styles";

export default function Navbar() {
  const { user, logout } = useAuth();
  const theme = useTheme(); // ⭐ CURRENT THEME (light/dark)
  const colorMode = React.useContext(ColorModeContext); // ⭐ TOGGLE FUNCTION

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background:
          theme.palette.mode === "light"
            ? "rgba(255,255,255,0.25)"
            : "rgba(0,0,0,0.35)",
        backdropFilter: "blur(12px)",
        borderBottom:
          theme.palette.mode === "light"
            ? "1px solid rgba(255,255,255,0.2)"
            : "1px solid rgba(255,255,255,0.1)",
      }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            letterSpacing: 0.5,
            color: theme.palette.mode === "light" ? "#0A84FF" : "#76a9ff",
          }}>
          Public Health AI
        </Typography>

        {/* Right side links + Toggle */}
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          {/* ⭐ Dark/Light Mode Button */}
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <WbSunnyIcon sx={{ color: "#ffeb3b" }} />
            ) : (
              <DarkModeIcon sx={{ color: "#000" }} />
            )}
          </IconButton>

          {/* Navigation Buttons */}
          <Button
            component={Link}
            to="/"
            sx={{ color: "#000", fontWeight: 600 }}>
            Home
          </Button>

          {user && (
            <>
              <Button component={Link} to="/dashboard" sx={{ color: "#000" }}>
                Dashboard
              </Button>
              <Button component={Link} to="/chat" sx={{ color: "#000" }}>
                Chat
              </Button>
              <Button component={Link} to="/analytics" sx={{ color: "#000" }}>
                Analytics
              </Button>

              <Button onClick={logout} sx={{ color: "red" }}>
                Logout
              </Button>
            </>
          )}

          {!user && (
            <Button component={Link} to="/login" sx={{ color: "#000" }}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
