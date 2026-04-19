import { Box, Button, Typography, Container, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useThemeContext } from "../hooks/useThemeContext";

import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import GlassCard from "../components/ui/GlassCard";

export default function Landing() {
  const { mode } = useThemeContext();
  const { user } = useAuth();

  return (
    <Box
      sx={{
        background:
          mode === "light"
            ? "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
            : "linear-gradient(135deg, #0d0d0d 0%, #17181c 100%)",
        overflowX: "hidden",
      }}>
      
      {/* 1. HERO SECTION */}
      <Box
        sx={{
          minHeight: "100vh",
          padding: { xs: "40px 20px", md: "80px 60px" },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
        }}>
        {/* LEFT SECTION & EXISTING ORB LOGIC */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          style={{ maxWidth: "600px", zIndex: 2 }}>
          {/* TITLE */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              fontSize: { xs: "2.5rem", md: "4.5rem" },
              color: mode === "light" ? "#1a1a1a" : "#fff",
              mb: 2,
            }}>
            Smarter Health.
            <br />
            Powered by <span style={{ background: "linear-gradient(135deg, #667eea, #b066ea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Intelligence.</span>
          </Typography>

          {/* DESCRIPTION */}
          <Typography
            sx={{
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              lineHeight: 1.6,
              color: mode === "light" ? "#555" : "#b0b0b0",
              opacity: 0.9,
              maxWidth: "540px",
              mb: 5,
            }}>
            AI-driven health assistance crafted with precision. Get insights,
            reports, and answers instantly — anywhere, anytime. 100% Free during Beta.
          </Typography>

          {/* BUTTONS */}
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", zIndex: 10 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                component={Link}
                to="/chat"
                variant="contained"
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  px: 4.5,
                  py: 1.8,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: "14px",
                  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
                  color: "white",
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)",
                    boxShadow: "0 15px 35px rgba(102, 126, 234, 0.5)",
                  },
                }}>
                Try Assistant
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                component={Link}
                to={user ? "/dashboard" : "/login"}
                sx={{
                  px: 4.5,
                  py: 1.8,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: "14px",
                  border: "1px solid rgba(102, 126, 234, 0.3)",
                  color: mode === "light" ? "#1a1a1a" : "#fff",
                  textTransform: "none",
                  background: mode === "light" ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(12px)",
                  "&:hover": {
                    background: mode === "light" ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(102, 126, 234, 0.6)",
                  },
                }}>
                {user ? "Dashboard" : "Login"}
              </Button>
            </motion.div>
          </Box>
        </motion.div>

        {/* RIGHT FLOATING AI ORB (MESH GRADIENT) */}
        <Box
          sx={{
            position: "absolute",
            right: { xs: "50%", md: "5%" },
            top: { xs: "10%", md: "15%" },
            transform: { xs: "translateX(50%)", md: "none" },
            zIndex: 0,
            width: { xs: 350, md: 600 },
            height: { xs: 350, md: 600 },
            pointerEvents: "none",
            opacity: mode === "light" ? 0.7 : 0.4,
          }}>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 90, 0],
              x: [0, 40, 0],
              y: [0, -40, 0],
            }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: "60%",
              height: "60%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              filter: "blur(80px)",
              top: "10%",
              left: "10%",
            }}
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              rotate: [0, -90, 0],
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: "50%",
              height: "50%",
              background: "linear-gradient(135deg, #ff6a88 0%, #ff99ac 100%)",
              borderRadius: "50%",
              filter: "blur(90px)",
              bottom: "10%",
              right: "10%",
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, 30, 0],
            }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: "40%",
              height: "40%",
              background: "linear-gradient(135deg, #0ea5a4 0%, #087f7e 100%)",
              borderRadius: "50%",
              filter: "blur(70px)",
              bottom: "30%",
              left: "20%",
              opacity: 0.6,
            }}
          />
        </Box>
      </Box>

      {/* 2. CORE CAPABILITIES (FEATURES) */}
      <Box sx={{ py: { xs: 10, md: 15 }, px: 3, position: "relative", zIndex: 2 }}>
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <Typography variant="h2" sx={{ textAlign: "center", fontWeight: 800, mb: 2, color: mode === "light" ? "#1a1a1a" : "#fff" }}>
              Engineered for the Future
            </Typography>
            <Typography sx={{ textAlign: "center", fontSize: "1.2rem", color: mode === "light" ? "#666" : "#aaa", mb: 8, maxWidth: "600px", mx: "auto" }}>
              Our platform combines state-of-the-art LLMs with verifiable medical data to deliver unprecedented accuracy.
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {[
              {
                icon: <SpeedRoundedIcon sx={{ fontSize: 40, color: "#667eea" }} />,
                title: "Instant Intelligence",
                desc: "Get real-time symptom analysis and personalized health reports within seconds, available 24/7."
              },
              {
                icon: <ShieldRoundedIcon sx={{ fontSize: 40, color: "#0ea5a4" }} />,
                title: "Absolute Privacy",
                desc: "Your data never leaves your device unencrypted. We utilize enterprise-grade architecture."
              },
              {
                icon: <AutoAwesomeRoundedIcon sx={{ fontSize: 40, color: "#ff6a88" }} />,
                title: "Precision Accuracy",
                desc: "Cross-referenced against millions of medical journals, ensuring the highest grade of reliability."
              }
            ].map((feat, i) => (
              <Grid item xs={12} md={4} key={i}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.2 }} style={{ height: "100%" }}>
                  <GlassCard>
                    <Box sx={{ p: 2, background: mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.05)", borderRadius: "16px", width: "fit-content", mb: 3 }}>
                      {feat.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: mode === "light" ? "#1a1a1a" : "#fff" }}>
                      {feat.title}
                    </Typography>
                    <Typography sx={{ color: mode === "light" ? "#555" : "#aaa", lineHeight: 1.6 }}>
                      {feat.desc}
                    </Typography>
                  </GlassCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 3. HOW IT WORKS TIMELINE */}
      <Box sx={{ py: { xs: 10, md: 15 }, background: mode === "light" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)", position: "relative", zIndex: 2 }}>
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ textAlign: "center", fontWeight: 800, mb: 8, color: mode === "light" ? "#1a1a1a" : "#fff" }}>
            How It Works
          </Typography>
          
          <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { num: "01", title: "Describe your symptoms", desc: "Open the secure chat interface and describe what you are feeling in plain English." },
              { num: "02", title: "AI Deep Analysis", desc: "Our models process your input against vast medical datasets, mapping patterns instantly." },
              { num: "03", title: "Receive your Report", desc: "Get a comprehensive breakdown of potential causes, confidence scores, and next steps." }
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: i * 0.2 }}>
                <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
                  <Typography sx={{ fontSize: "3rem", fontWeight: 800, color: "transparent", WebkitTextStroke: mode === "light" ? "1px #667eea" : "1px rgba(102,126,234,0.6)", opacity: 0.5 }}>
                    {step.num}
                  </Typography>
                  <Box sx={{ pt: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: mode === "light" ? "#1a1a1a" : "#fff" }}>
                      {step.title}
                    </Typography>
                    <Typography sx={{ fontSize: "1.1rem", color: mode === "light" ? "#555" : "#aaa" }}>
                      {step.desc}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* 4. FOOTER */}
      <Box sx={{ borderTop: `1px solid ${mode === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}`, py: 8, position: "relative", zIndex: 2, background: mode === "light" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.2)" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: "#667eea" }}>💊 Health AI</Typography>
              <Typography sx={{ color: mode === "light" ? "#666" : "#aaa", maxWidth: "250px" }}>
                Empowering individuals with instant, actionable health intelligence. 100% Free during Beta.
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography sx={{ fontWeight: 700, mb: 2, color: mode === "light" ? "#1a1a1a" : "#fff" }}>Product</Typography>
              <Box sx={{ display:"flex", flexDirection:"column", gap: 1 }}>
                {["Features", "API", "Changelog", "Support"].map(l => <span key={l} style={{ color: mode === "light" ? "#666" : "#ccc", cursor: "pointer" }}>{l}</span>)}
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography sx={{ fontWeight: 700, mb: 2, color: mode === "light" ? "#1a1a1a" : "#fff" }}>Company</Typography>
              <Box sx={{ display:"flex", flexDirection:"column", gap: 1 }}>
                {["About", "Blog", "Careers", "Contact"].map(l => <span key={l} style={{ color: mode === "light" ? "#666" : "#ccc", cursor: "pointer" }}>{l}</span>)}
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography sx={{ fontWeight: 700, mb: 2, color: mode === "light" ? "#1a1a1a" : "#fff" }}>Legal</Typography>
              <Box sx={{ display:"flex", flexDirection:"column", gap: 1 }}>
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => <span key={l} style={{ color: mode === "light" ? "#666" : "#ccc", cursor: "pointer" }}>{l}</span>)}
              </Box>
            </Grid>
          </Grid>
          <Typography sx={{ textAlign: "center", color: mode === "light" ? "#999" : "#666", mt: 8, fontSize: "0.9rem" }}>
            © {new Date().getFullYear()} Health AI Inc. All rights reserved. Not actual medical advice.
          </Typography>
        </Container>
      </Box>

    </Box>
  );
}
