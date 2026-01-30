import { useEffect, useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";

export default function Landing() {
  const heroRef = useRef(null);
  const imgRef = useRef(null);
  const textRef = useRef(null);

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

    // Apple-style fade-in animations
    gsap.from(textRef.current, {
      opacity: 0,
      y: 30,
      duration: 1.2,
      ease: "power3.out",
    });

    gsap.from(imgRef.current, {
      opacity: 0,
      y: 80,
      duration: 1.5,
      ease: "power3.out",
      delay: 0.3,
    });
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg, #fdfdfd, #e8eef7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingX: "5%",
      }}
      ref={heroRef}>
      <Box sx={{ maxWidth: "600px" }}>
        <Typography
          ref={textRef}
          variant="h2"
          sx={{
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 2,
            color: "#111",
            fontSize: { xs: "2.2rem", md: "3.5rem" },
          }}>
          Your Health.
          <br />
          <span style={{ color: "#0A84FF" }}>Powered by Intelligence.</span>
        </Typography>

        <Typography
          sx={{
            opacity: 0.7,
            fontSize: "1.2rem",
            marginBottom: 4,
            maxWidth: "500px",
          }}>
          Designed with precision. Built by advanced AI. Experience healthcare
          assistance with an Apple-style touch.
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              paddingX: 5,
              paddingY: 1.5,
              fontSize: "1.1rem",
              borderRadius: "12px",
              textTransform: "none",
              background: "#0A84FF",
              boxShadow: "0 10px 30px rgba(0, 153, 255, 0.3)",
            }}
            href="/chat">
            Try Assistant
          </Button>

          <Button
            variant="outlined"
            size="large"
            sx={{
              paddingX: 5,
              paddingY: 1.5,
              fontSize: "1.1rem",
              borderRadius: "12px",
              textTransform: "none",
              borderColor: "#0A84FF",
              color: "#0A84FF",
              backdropFilter: "blur(10px)",
            }}
            href="/login">
            Login
          </Button>
        </Box>
      </Box>

      {/* Right side animated avatar */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <img
          ref={imgRef}
          src="https://img.icons8.com/fluency/240/artificial-intelligence.png"
          alt="AI"
          style={{
            width: "350px",
            filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
            transform: "translateY(0px)",
            animation: "float 4s ease-in-out infinite",
          }}
        />
      </Box>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </Box>
  );
}
