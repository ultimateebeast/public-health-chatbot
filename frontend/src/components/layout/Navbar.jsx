import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Box,
  Avatar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import AnalyticsIcon from "@mui/icons-material/QueryStats";
import PersonIcon from "@mui/icons-material/Person";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // ⭐ Correct theme hook
  const { mode, toggleTheme } = useTheme();

  const navItems = [
    { name: "Home", path: "/", icon: <HomeIcon /> },
    { name: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { name: "Chat", path: "/chat", icon: <ChatIcon /> },
    { name: "Analytics", path: "/analytics", icon: <AnalyticsIcon /> },
    { name: "Profile", path: "/profile", icon: <PersonIcon /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        width: "100%",
        backdropFilter: "blur(20px)",
        background:
          mode === "light" ? "rgba(255,255,255,0.55)" : "rgba(20,20,20,0.65)",
        borderBottom:
          mode === "light"
            ? "1px solid rgba(255,255,255,0.4)"
            : "1px solid rgba(255,255,255,0.15)",
        padding: { xs: "12px 20px", md: "12px 40px" },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
      {/* LOGO */}
      <Box
        component={Link}
        to="/"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "1.2rem", md: "1.4rem" },
          textDecoration: "none",
          color: mode === "light" ? "#0A84FF" : "#4AB1FF",
        }}>
        Public Health AI
      </Box>

      {/* DESKTOP NAVIGATION */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          gap: 2,
          background:
            mode === "light" ? "rgba(255,255,255,0.65)" : "rgba(40,40,40,0.7)",
          padding: "8px 15px",
          borderRadius: "40px",
          boxShadow:
            mode === "light"
              ? "0 6px 20px rgba(0,0,0,0.08)"
              : "0 6px 20px rgba(0,0,0,0.4)",
        }}>
        {navItems.map((item) => (
          <motion.div key={item.path} whileTap={{ scale: 0.97 }}>
            <Button
              component={Link}
              to={item.path}
              sx={{
                textTransform: "none",
                borderRadius: "50px",
                padding: "10px 18px",
                gap: 1,
                fontWeight: 600,
                background: isActive(item.path)
                  ? "linear-gradient(135deg,#0A84FF,#2E9BFF)"
                  : mode === "light"
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(60,60,60,0.8)",
                color: isActive(item.path)
                  ? "#fff"
                  : mode === "light"
                    ? "#222"
                    : "#eee",
                boxShadow: isActive(item.path)
                  ? "0 6px 18px rgba(10,132,255,0.4)"
                  : "none",
              }}>
              {item.icon}
              {item.name}
            </Button>
          </motion.div>
        ))}
      </Box>

      {/* DARK MODE BUTTON (DESKTOP) */}
      <IconButton
        onClick={toggleTheme}
        sx={{
          ml: 2,
          display: { xs: "none", md: "flex" },
          color: mode === "light" ? "#222" : "#fff",
        }}>
        {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>

      {/* MOBILE MENU BUTTON */}
      <IconButton
        sx={{ display: { xs: "flex", md: "none" } }}
        onClick={() => setOpen(true)}>
        <MenuIcon fontSize="large" />
      </IconButton>

      {/* AVATAR (DESKTOP) */}
      <Avatar
        src="https://img.icons8.com/color/96/user-male-circle--v1.png"
        sx={{
          width: 42,
          height: 42,
          cursor: "pointer",
          ml: 2,
          display: { xs: "none", md: "block" },
        }}
        component={Link}
        to="/profile"
      />

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: "260px",
            backdropFilter: "blur(20px)",
            background:
              mode === "light"
                ? "rgba(255,255,255,0.7)"
                : "rgba(25,25,25,0.85)",
          },
        }}>
        <Box
          sx={{
            padding: "20px 10px",
            display: "flex",
            justifyContent: "space-between",
          }}>
          <IconButton onClick={toggleTheme}>
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>

          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              onClick={() => setOpen(false)}
              component={Link}
              to={item.path}
              sx={{
                borderRadius: "12px",
                margin: "6px 12px",
                background: isActive(item.path)
                  ? "linear-gradient(135deg,#0A84FF,#2E9BFF)"
                  : mode === "light"
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(55,55,55,0.7)",
                color: isActive(item.path)
                  ? "#fff"
                  : mode === "light"
                    ? "#222"
                    : "#eee",
              }}>
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? "#fff" : "inherit",
                }}>
                {item.icon}
              </ListItemIcon>

              <ListItemText primary={item.name} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
