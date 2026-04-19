import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useThemeContext } from "../../hooks/useThemeContext";
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";

export default function PageWrapper({ children, sx = {} }) {
  const { mode } = useThemeContext();
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Smooth Scroll setup
    const lenis = new Lenis({ smooth: true, duration: 1.4 });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Initial page load staggered animations
    if (wrapperRef.current) {
      const elements = wrapperRef.current.querySelectorAll(".gsap-animate-up");
      if (elements.length > 0) {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 1.1,
            ease: "power3.out",
          }
        );
      }
    }

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Box
      ref={wrapperRef}
      sx={{
        minHeight: "100vh",
        padding: { xs: "20px", md: "40px" },
        background:
          mode === "light"
            ? "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
            : "linear-gradient(135deg, #0d0d0d 0%, #17181c 100%)",
        color: mode === "light" ? "#1a1a1a" : "#fff",
        overflowX: "hidden",
        ...sx,
      }}>
      {children}
    </Box>
  );
}
