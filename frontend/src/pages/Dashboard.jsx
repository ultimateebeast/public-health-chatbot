import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  ButtonGroup,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link } from "react-router-dom";
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";
import { motion } from "framer-motion";
import { useThemeContext } from "../hooks/useThemeContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
  Legend,
} from "recharts";

import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7c7c",
  "#00c49f",
  "#a4de6c",
  "#d0ed57",
];

import MetricCard from "../components/ui/MetricCard";
import ChartCard from "../components/ui/ChartCard";

export default function Dashboard() {
  const cardsRef = useRef([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { mode } = useThemeContext();

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token"); // ✅ ADD THIS

      if (!token) {
        console.error("❌ No token found");
        return;
      }

      const res = await axios.get(
        "http://127.0.0.1:8000/analytics/full-dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ ADD THIS
          },
        },
      );

      setData(res.data);
    } catch (err) {
      console.error("Analytics error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000); // 10s refresh

    const handler = () => fetchAnalytics();
    window.addEventListener("analyticsUpdated", handler);

    // Smooth Scroll lenis
    const lenis = new Lenis({ smooth: true, duration: 1.4 });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Initial animation for metrics - fixed for React Strict Mode
    gsap.fromTo(
      cardsRef.current,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 1.1,
        ease: "power3.out",
      },
    );

    return () => {
      clearInterval(interval);
      window.removeEventListener("analyticsUpdated", handler);
      lenis.destroy();
    };
  }, []);

  const toChartData = (obj) =>
    Object.entries(obj || {}).map(([name, value]) => ({ name, value }));

  const diseaseData = toChartData(data?.disease_distribution);
  const sentimentData = toChartData(data?.sentiment_distribution);
  const riskData = toChartData(data?.risk_distribution);
  const dailyData = toChartData(data?.daily_usage);
  const recentActivities = data?.recent_activity || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            background:
              mode === "light"
                ? "rgba(255,255,255,0.95)"
                : "rgba(30,30,35,0.95)",
            backdropFilter: "blur(12px)",
            p: 2,
            borderRadius: "12px",
            border: `1px solid ${mode === "light" ? "rgba(102,126,234,0.2)" : "rgba(255,255,255,0.1)"}`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}>
          <Typography
            sx={{
              color: mode === "light" ? "#444" : "#ddd",
              fontWeight: 700,
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "1px",
              mb: 0.5,
            }}>
            {label || payload[0].name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background:
                  payload[0].payload.fill || payload[0].color || "#667eea",
              }}
            />
            <Typography
              sx={{
                color: mode === "light" ? "#1a1a1a" : "#fff",
                fontWeight: 800,
                fontSize: "1.2rem",
              }}>
              {payload[0].value}{" "}
              <Typography
                component="span"
                sx={{
                  fontSize: "0.85rem",
                  color: mode === "light" ? "#888" : "#888",
                }}>
                Entries
              </Typography>
            </Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        background: mode === "light" ? "#fbfbfe" : "#020202",
        color: mode === "light" ? "#111" : "#fff",
        overflowX: "hidden",
      }}>

      <style>{`
         @keyframes drift { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px, -30px) scale(1.05); } 100% { transform: translate(-20px, 20px) scale(0.95); } }
      `}</style>
      
      {/* FIXED DYNAMIC BACKGROUND */}
      <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {/* Subtle grid lines */}
        <Box sx={{ position: "absolute", inset: 0, opacity: mode==="light"? 0.04 : 0.015, backgroundSize: "60px 60px", backgroundImage: `linear-gradient(to right, ${mode==="light"?"#000":"#fff"} 1px, transparent 1px), linear-gradient(to bottom, ${mode==="light"?"#000":"#fff"} 1px, transparent 1px)` }} />
        
        {/* Ambient Orbs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} style={{ width: "100%", height: "100%", position: "absolute" }}>
           <Box sx={{ position: "absolute", top: "-10%", left: "10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(102,126,234,0.15) 0%, transparent 60%)", filter: "blur(80px)", animation: "drift 20s infinite alternate linear" }} />
           <Box sx={{ position: "absolute", bottom: "10%", right: "10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(255,106,136,0.1) 0%, transparent 60%)", filter: "blur(100px)", animation: "drift 25s infinite alternate-reverse linear" }} />
        </motion.div>
      </Box>

      {/* DASHBOARD CONTENT */}
      <Box sx={{ position: "relative", zIndex: 1, p: { xs: 3, md: 5 } }}>

      {/* Global Header & Action Bar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "flex-end" },
          mb: 5,
          gap: 3,
        }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "2.6rem" },
              color: mode === "light" ? "#1a1a1a" : "#fff",
              mb: 0.5,
            }}>
            Dashboard & Analytics
          </Typography>
          <Typography
            sx={{
              fontSize: "1.1rem",
              opacity: 0.8,
              color: mode === "light" ? "#666" : "#b0b0b0",
            }}>
            Real-time analytics and global intelligence.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            zIndex: 10,
          }}>
          <ButtonGroup
            variant="outlined"
            sx={{
              "& .MuiButton-root": {
                borderColor:
                  mode === "light"
                    ? "rgba(0,0,0,0.15)"
                    : "rgba(255,255,255,0.15)",
                color: mode === "light" ? "#555" : "#ccc",
                textTransform: "none",
                fontWeight: 600,
              },
            }}>
            <Button
              sx={{
                background:
                  mode === "light"
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.1)",
              }}>
              7D
            </Button>
            <Button>30D</Button>
            <Button>All</Button>
          </ButtonGroup>
          <Button
            variant="outlined"
            startIcon={<DownloadRoundedIcon />}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              borderColor:
                mode === "light"
                  ? "rgba(0,0,0,0.15)"
                  : "rgba(255,255,255,0.15)",
              color: mode === "light" ? "#333" : "#fff",
              fontWeight: 600,
            }}>
            Export
          </Button>
          <Button
            component={Link}
            to="/chat"
            variant="contained"
            startIcon={<AddRoundedIcon />}
            sx={{
              borderRadius: "8px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
            }}>
            New Analysis
          </Button>
        </Box>
      </Box>

      {/* TOP CARDS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 3,
        }}>
        {[
          {
            title: "Total Queries",
            value: data?.total_queries !== undefined ? data.total_queries : "-",
            subtitle: "Lifetime queries processed",
          },
          {
            title: "Avg Confidence",
            value: data?.avg_confidence
              ? `${data.avg_confidence.toFixed(1)}%`
              : "-",
            subtitle: "A.I Model Certainty",
          },
          {
            title: "Emergency Cases",
            value:
              data?.emergency_cases !== undefined ? data.emergency_cases : "-",
            subtitle: "Flagged critical situations",
          },
          { title: "Active Users", value: "8.2K", subtitle: "Global network" },
        ].map((card, index) => (
          <div key={index} ref={(el) => (cardsRef.current[index] = el)}>
            <MetricCard {...card} />
          </div>
        ))}
      </Box>

      {/* CHARTS GRID */}
      {loading ? (
        <Typography sx={{ mt: 6, color: mode === "light" ? "#666" : "#aaa" }}>
          Loading intelligent data streams...
        </Typography>
      ) : (
        <Box
          sx={{
            mt: 5,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
          }}>
          {/* ROW 1: Temporal Usage (Area Chart) */}
          <Box sx={{ gridColumn: { xs: "1", md: "1 / span 2" } }}>
            <ChartCard title="Temporal Query Velocity">
              {dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart
                    data={dailyData}
                    margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop
                          offset="5%"
                          stopColor="#667eea"
                          stopOpacity={0.6}
                        />
                        <stop
                          offset="95%"
                          stopColor="#667eea"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke={
                        mode === "light"
                          ? "rgba(0,0,0,0.05)"
                          : "rgba(255,255,255,0.05)"
                      }
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: mode === "light" ? "#888" : "#777",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                      dy={15}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: mode === "light" ? "#888" : "#777",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#667eea"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      activeDot={{
                        r: 8,
                        fill: "#fff",
                        stroke: "#667eea",
                        strokeWidth: 3,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Typography sx={{ color: "#888", fontStyle: "italic", mt: 3 }}>
                  No temporal baseline established.
                </Typography>
              )}
            </ChartCard>
          </Box>

          {/* ROW 2A: Risk Distribution */}
          <ChartCard title="Risk Topography">
            {riskData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={riskData}
                  margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient
                      id="colorRiskHigh"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">
                      <stop offset="0%" stopColor="#ff4d4f" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#ff4d4f"
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorRiskMed"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">
                      <stop offset="0%" stopColor="#ffa940" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#ffa940"
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorRiskLow"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">
                      <stop offset="0%" stopColor="#00c49f" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#00c49f"
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={
                      mode === "light"
                        ? "rgba(0,0,0,0.05)"
                        : "rgba(255,255,255,0.05)"
                    }
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: mode === "light" ? "#888" : "#777",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: mode === "light" ? "#888" : "#777",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      fill:
                        mode === "light"
                          ? "rgba(0,0,0,0.03)"
                          : "rgba(255,255,255,0.03)",
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {riskData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name.toLowerCase() === "high"
                            ? "url(#colorRiskHigh)"
                            : entry.name.toLowerCase() === "medium"
                              ? "url(#colorRiskMed)"
                              : "url(#colorRiskLow)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography sx={{ color: "#888", fontStyle: "italic", mt: 3 }}>
                Insufficient risk telemetry.
              </Typography>
            )}
          </ChartCard>

          {/* ROW 2B: Diagnosis Taxonomy */}
          <ChartCard title="Diagnosis Taxonomy">
            {diseaseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={diseaseData}
                    dataKey="value"
                    innerRadius={75}
                    outerRadius={105}
                    paddingAngle={6}
                    stroke="none"
                    cornerRadius={8}>
                    {diseaseData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "0.85rem",
                      color: mode === "light" ? "#555" : "#aaa",
                      fontWeight: 600,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography sx={{ color: "#888", fontStyle: "italic", mt: 3 }}>
                No diagnostic vectors mapped.
              </Typography>
            )}
          </ChartCard>

          {/* ROW 3: Sentiment Matrix */}
          <Box sx={{ gridColumn: { xs: "1", md: "1 / span 2" } }}>
            <ChartCard title="Global Sentiment Matrix">
              {sentimentData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    layout="vertical"
                    data={sentimentData}
                    margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                    <defs>
                      <linearGradient
                        id="sentimentNeutral"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0">
                        <stop
                          offset="0%"
                          stopColor="#764ba2"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor="#667eea"
                          stopOpacity={1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke={
                        mode === "light"
                          ? "rgba(0,0,0,0.05)"
                          : "rgba(255,255,255,0.05)"
                      }
                    />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: mode === "light" ? "#888" : "#777",
                        fontWeight: 600,
                      }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: mode === "light" ? "#555" : "#ccc",
                        fontWeight: 700,
                      }}
                      dx={-10}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{
                        fill:
                          mode === "light"
                            ? "rgba(0,0,0,0.03)"
                            : "rgba(255,255,255,0.03)",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#sentimentNeutral)"
                      radius={[0, 8, 8, 0]}
                      barSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography sx={{ color: "#888", fontStyle: "italic", mt: 3 }}>
                  Awaiting emotion sentiment processing.
                </Typography>
              )}
            </ChartCard>
          </Box>
        </Box>
      )}

      {/* RECENT ACTIVITY LOG */}
      <Box sx={{ mt: 5 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            mb: 3,
            color: mode === "light" ? "#1a1a1a" : "#fff",
          }}>
          Recent Activity
        </Typography>
        <Box
          sx={{
            background:
              mode === "light"
                ? "rgba(255,255,255,0.85)"
                : "rgba(30,30,30,0.6)",
            backdropFilter: "blur(12px)",
            borderRadius: "24px",
            border:
              mode === "light"
                ? "1px solid rgba(255,255,255,0.5)"
                : "1px solid rgba(255,255,255,0.05)",
            p: { xs: 2, md: 4 },
            overflowX: "auto",
          }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    borderBottom:
                      mode === "light" ? "1px solid #eee" : "1px solid #333",
                    color: mode === "light" ? "#888" : "#aaa",
                    fontWeight: 600,
                  }}>
                  Query ID
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom:
                      mode === "light" ? "1px solid #eee" : "1px solid #333",
                    color: mode === "light" ? "#888" : "#aaa",
                    fontWeight: 600,
                  }}>
                  Type
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom:
                      mode === "light" ? "1px solid #eee" : "1px solid #333",
                    color: mode === "light" ? "#888" : "#aaa",
                    fontWeight: 600,
                  }}>
                  Risk Level
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom:
                      mode === "light" ? "1px solid #eee" : "1px solid #333",
                    color: mode === "light" ? "#888" : "#aaa",
                    fontWeight: 600,
                  }}>
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom:
                      mode === "light" ? "1px solid #eee" : "1px solid #333",
                    color: mode === "light" ? "#888" : "#aaa",
                    fontWeight: 600,
                  }}
                  align="right">
                  Time
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentActivities.map((act, index) => (
                <TableRow
                  key={act.id + index}
                  sx={{
                    "&:last-child td": { border: 0 },
                    "&:hover": {
                      background:
                        mode === "light"
                          ? "rgba(0,0,0,0.02)"
                          : "rgba(255,255,255,0.02)",
                    },
                  }}>
                  <TableCell
                    sx={{
                      borderBottom:
                        mode === "light" ? "1px solid #eee" : "1px solid #333",
                      color: mode === "light" ? "#333" : "#ddd",
                      fontWeight: 600,
                    }}>
                    {act.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom:
                        mode === "light" ? "1px solid #eee" : "1px solid #333",
                      color: mode === "light" ? "#555" : "#ccc",
                      maxWidth: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {act.type}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-block",
                        background:
                          act.risk_level === "low"
                            ? "rgba(0, 196, 159, 0.15)"
                            : act.risk_level === "high"
                              ? "rgba(255, 124, 124, 0.15)"
                              : "rgba(255, 198, 88, 0.15)",
                        color:
                          act.risk_level === "low"
                            ? "#00a080"
                            : act.risk_level === "high"
                              ? "#ff4d4f"
                              : "#d49700",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}>
                      {act.risk_level}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom:
                        mode === "light" ? "1px solid #eee" : "1px solid #333",
                    }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: mode === "light" ? "#555" : "#ccc",
                      }}>
                      <Typography sx={{ fontSize: "0.9rem" }}>
                        {act.status}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom:
                        mode === "light" ? "1px solid #eee" : "1px solid #333",
                      color: mode === "light" ? "#888" : "#777",
                      whiteSpace: "nowrap",
                    }}
                    align="right">
                    {act.time}
                  </TableCell>
                </TableRow>
              ))}

              {recentActivities.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 4, color: mode === "light" ? "#888" : "#666" }}>
                    No recent diagnostic activity recorded on this device.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  </Box>
  );
}
