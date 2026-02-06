import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";
import { useTheme } from "../context/ThemeContext";

// Apple-style Glass Card Component
function GlassCard({ title, value, subtitle }) {
  const { mode } = useTheme();

  return (
    <Box
      sx={{
        padding: 3,
        minHeight: "150px",
        borderRadius: "22px",
        background:
          mode === "light" ? "rgba(255,255,255,0.75)" : "rgba(40,40,40,0.55)",
        backdropFilter: "blur(20px)",
        border:
          mode === "light"
            ? "1px solid rgba(255,255,255,0.55)"
            : "1px solid rgba(255,255,255,0.15)",
        boxShadow:
          mode === "light"
            ? "0 12px 35px rgba(0,0,0,0.10)"
            : "0 12px 35px rgba(0,0,0,0.50)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-8px)",
        },
      }}>
      <Typography
        sx={{
          fontSize: "0.95rem",
          opacity: 0.9,
          color: mode === "light" ? "#222" : "#ddd",
          marginBottom: 0.5,
        }}>
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: "2.4rem",
          fontWeight: 700,
          color: mode === "light" ? "#000" : "#fff",
        }}>
        {value}
      </Typography>

      <Typography
        sx={{
          fontSize: "0.9rem",
          opacity: 0.8,
          color: mode === "light" ? "#444" : "#ccc",
        }}>
        {subtitle}
      </Typography>
    </Box>
  );
}

export default function Dashboard() {
  const cardsRef = useRef([]);
  const { mode } = useTheme();

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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: { xs: "20px", md: "40px" },
        background:
          mode === "light"
            ? "linear-gradient(135deg,#dce6f7,#eef4ff)"
            : "linear-gradient(135deg,#0f0f0f,#1a1a1a)",
      }}>
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "2rem", md: "2.6rem" },
          marginBottom: "10px",
          color: mode === "light" ? "#111" : "#f3f3f3",
          textShadow:
            mode === "light"
              ? "0 2px 5px rgba(0,0,0,0.15)"
              : "0 2px 5px rgba(0,0,0,0.65)",
        }}>
        Welcome Back 👋
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: "1rem", md: "1.3rem" },
          opacity: 0.85,
          marginBottom: "30px",
          color: mode === "light" ? "#333" : "#ccc",
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
