import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";
import HealthChart from "../components/dashboard/HealthChart";

// Apple-Glass Card Component
function GlassCard({ title, value, subtitle }) {
  return (
    <Box
      className="glass-card"
      sx={{
        padding: 3,
        minHeight: "150px",
        borderRadius: "22px",
        background: "rgba(255, 255, 255, 0.35)",
        backdropFilter: "blur(18px)",
        border: "1px solid rgba(255, 255, 255, 0.55)",
        boxShadow: "0 25px 45px rgba(0,0,0,0.07)",
        transition: "transform .4s cubic-bezier(.25,.1,.25,1)",
        cursor: "pointer",
        "&:hover": { transform: "translateY(-10px)" },
      }}>
      <Typography sx={{ opacity: 0.7, fontSize: "0.9rem" }}>{title}</Typography>
      <Typography sx={{ fontSize: "2.2rem", fontWeight: 700 }}>
        {value}
      </Typography>
      <Typography sx={{ opacity: 0.6, fontSize: "0.85rem" }}>
        {subtitle}
      </Typography>
    </Box>
  );
}

export default function Dashboard() {
  const cardsRef = useRef([]);

  useEffect(() => {
    // Smooth Apple-like scroll
    const lenis = new Lenis({
      duration: 1.4,
      smooth: true,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // GSAP stagger animation for cards
    gsap.from(cardsRef.current, {
      opacity: 0,
      y: 60,
      duration: 1.4,
      ease: "power4.out",
      stagger: 0.18,
    });
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #dfe8ff 0%, #f7faff 40%, #ddeffd 100%)",
        padding: "40px",
      }}>
      {/* Dashboard Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          marginBottom: 4,
          fontSize: "2.5rem",
          color: "#0a0a0a",
        }}>
        Welcome Back 👋
        <br />
        <span style={{ fontSize: "1.3rem", opacity: 0.6 }}>
          Your Health Dashboard
        </span>
      </Typography>

      {/* Stats Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr 1fr",
          },
          gap: 3,
          marginBottom: 6,
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

      {/* APPLE-STYLE HEALTH CHART */}
      <HealthChart />
    </Box>
  );
}
