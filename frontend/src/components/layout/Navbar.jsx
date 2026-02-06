import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Avatar,
  Button,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Chat", path: "/chat" },
    { label: "Analytics", path: "/analytics" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.3)",
      }}>
      <Toolbar sx={{ display: "flex", alignItems: "center", px: 4 }}>
        {/* LOGO */}
        <Typography
          component={Link}
          to="/"
          sx={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#0A84FF",
            textDecoration: "none",
            flexGrow: 1,
          }}>
          Public Health AI
        </Typography>

        {/* NAV LINKS */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {navItems.map((item) => (
            <Typography
              key={item.path}
              component={Link}
              to={item.path}
              sx={{
                fontSize: "1rem",
                color: location.pathname === item.path ? "#0A84FF" : "#111",
                fontWeight: location.pathname === item.path ? 700 : 500,
                textDecoration: "none",
                paddingBottom: "3px",
                borderBottom:
                  location.pathname === item.path
                    ? "2px solid #0A84FF"
                    : "2px solid transparent",
                transition: "0.25s ease",
                "&:hover": {
                  color: "#0A84FF",
                },
              }}>
              {item.label}
            </Typography>
          ))}

          {/* PROFILE AVATAR */}
          <Avatar
            component={Link}
            to="/profile"
            src="https://img.icons8.com/color/96/user-male-circle--v1.png"
            sx={{
              width: 40,
              height: 40,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          />

          {/* LOGOUT BUTTON */}
          {user && (
            <Button
              onClick={logout}
              sx={{
                ml: 2,
                textTransform: "none",
                fontSize: "0.9rem",
                color: "#FF3B30",
                fontWeight: 600,
              }}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
