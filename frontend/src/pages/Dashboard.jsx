import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";
import { useThemeContext } from "../hooks/useThemeContext";

// Apple-style Glass Card Component
function GlassCard({ title, value, subtitle }) {
  const { mode } = useThemeContext();

  return (
    <Box
      sx={{
        padding: 3,
        minHeight: "150px",
        borderRadius: "16px",
        background:
          mode === "light"
            ? "rgba(255, 255, 255, 0.95)"
            : "rgba(35, 35, 35, 0.85)",
        backdropFilter: "blur(10px)",
        border:
          mode === "light"
            ? "1px solid rgba(255, 255, 255, 0.2)"
            : "1px solid rgba(102, 126, 234, 0.2)",
        boxShadow:
          mode === "light"
            ? "0 8px 16px rgba(0, 0, 0, 0.1)"
            : "0 8px 16px rgba(102, 126, 234, 0.15)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow:
            mode === "light"
              ? "0 12px 24px rgba(102, 126, 234, 0.2)"
              : "0 12px 24px rgba(102, 126, 234, 0.3)",
          background:
            mode === "light"
              ? "rgba(255, 255, 255, 0.98)"
              : "rgba(45, 45, 45, 0.95)",
        },
      }}>
      <Typography
        sx={{
          fontSize: "0.95rem",
          opacity: 0.7,
          color: mode === "light" ? "#666" : "#a0a0a0",
          marginBottom: 0.5,
          fontWeight: 500,
        }}>
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: "2.4rem",
          fontWeight: 700,
          color: "#667eea",
          marginBottom: 0.5,
        }}>
        {value}
      </Typography>

      <Typography
        sx={{
          fontSize: "0.9rem",
          opacity: 0.7,
          color: mode === "light" ? "#999" : "#909090",
        }}>
        {subtitle}
      </Typography>
    </Box>
  );
}

export default function Dashboard() {
  const cardsRef = useRef([]);

  useEffect(() => {
    // Smooth Scroll
    const lenis = new Lenis({
      smooth: true,
      duration: 1.4,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // GSAP Fade-Up animation
    gsap.from(cardsRef.current, {
      opacity: 0,
      y: 40,
      stagger: 0.12,
      duration: 1.1,
      ease: "power3.out",
    });
  }, []);

  const { mode } = useThemeContext();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: { xs: "20px", md: "40px" },
        background:
          mode === "light"
            ? "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
            : "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)",
      }}>
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "2rem", md: "2.6rem" },
          marginBottom: "10px",
          color: mode === "light" ? "#1a1a1a" : "#f5f5f5",
          textShadow: mode === "light" ? "0 2px 5px rgba(0,0,0,0.05)" : "none",
        }}>
        Welcome Back 👋
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: "1rem", md: "1.3rem" },
          opacity: 0.8,
          marginBottom: "30px",
          color: mode === "light" ? "#666" : "#b0b0b0",
        }}>
        Your Health Dashboard
      </Typography>

      {/* Responsively Auto-Fitting Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 3,
          marginTop: 3,
        }}>
        {[
          { title: "Total Queries", value: "132", subtitle: "This month" },
          { title: "AI Accuracy", value: "98%", subtitle: "Gemini Verified" },
          { title: "Health Reports", value: "27", subtitle: "Generated" },
          { title: "Active Users", value: "8.2K", subtitle: "Worldwide" },
        ].map((card, index) => (
          <div key={index} ref={(el) => (cardsRef.current[index] = el)}>
            <GlassCard {...card} />
          </div>
        ))}
      </Box>
    </Box>
  );
}
