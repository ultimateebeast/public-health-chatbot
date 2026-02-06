import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";

// Glass Card Component (Apple Style)
function GlassCard({ title, value, subtitle }) {
  return (
    <Box
      sx={{
        padding: 3,
        minHeight: "150px",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 10px 35px rgba(0,0,0,0.12)",
        border: "1px solid rgba(255,255,255,0.45)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "transform 0.3s ease",
        cursor: "pointer",
        "&:hover": { transform: "translateY(-8px)" },
      }}>
      <Typography sx={{ fontSize: "0.9rem", color: "#222", opacity: 0.9 }}>
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: "2.4rem",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
        }}>
        {value}
      </Typography>

      <Typography sx={{ fontSize: "0.9rem", color: "#444", opacity: 0.9 }}>
        {subtitle}
      </Typography>
    </Box>
  );
}

export default function Dashboard() {
  const cardsRef = useRef([]);

  useEffect(() => {
    // Smooth Apple-like scrolling
    const lenis = new Lenis({
      duration: 1.3,
      smooth: true,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // GSAP entrance animation
    gsap.from(cardsRef.current, {
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 1.25,
      ease: "power3.out",
    });
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #c7d2e5, #eef3ff)", // darker + clean
        padding: "40px",
      }}>
      {/* Dashboard Header */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          marginBottom: 1,
          fontSize: "2.6rem",
          color: "#111",
          textShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}>
        Welcome Back 👋
      </Typography>

      <Typography
        sx={{
          fontSize: "1.3rem",
          opacity: 0.9,
          marginBottom: 4,
          color: "#222",
        }}>
        Your Health Dashboard
      </Typography>

      {/* Cards Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr 1fr",
          },
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
