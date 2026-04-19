import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  TextField,
  MenuItem,
  Button,
  TableRow,
  TableCell,
  Drawer,
  IconButton,
  Divider,
  CircularProgress
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Legend
} from "recharts";

import { useThemeContext } from "../hooks/useThemeContext";
import PageWrapper from "../components/ui/PageWrapper";
import MetricCard from "../components/ui/MetricCard";
import ChartCard from "../components/ui/ChartCard";
import DataTable from "../components/ui/DataTable";

const API_BASE = "http://127.0.0.1:8000/admin";
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#00c49f", "#a4de6c", "#d0ed57"];

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const { mode } = useThemeContext();

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      const statsRes = await fetch(`${API_BASE}/stats`, { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      const logsRes = await fetch(`${API_BASE}/logs`, { headers });
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(Array.isArray(logsData) ? logsData.reverse() : []);
      }
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const openUserDrawer = async (userId) => {
    if (!userId) return;
    setDrawerOpen(true);
    setLoadingUser(true);
    setSelectedUser(null);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(`${API_BASE}/user/${userId}/analysis`, { headers });
      if (res.ok) {
        const data = await res.json();
        setSelectedUser(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUser(false);
    }
  };

  const exportCSV = () => {
    if (!logs.length) return;

    const headers = [
      "User",
      "Query",
      "Disease",
      "Risk",
      "Confidence",
      "Timestamp",
    ];

    const rows = logs.map((log) => [
      log.user_name || "Anonymous",
      log.query || "",
      log.disease || "",
      log.risk_level || "",
      log.confidence || "",
      log.timestamp || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((val) => `"${val}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "health_ai_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getColor = (risk) => {
    if (risk === "high") return "error";
    if (risk === "medium") return "warning";
    return "success";
  };

  // 🔍 FILTER + SEARCH
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.query?.toLowerCase().includes(search.toLowerCase()) ||
                          log.user_name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || log.risk_level === filter;
    return matchesSearch && matchesFilter;
  });

  // 📊 CHART DATA
  const riskData = [
    { name: "High", value: stats.high_risk || 0 },
    { name: "Medium", value: stats.medium_risk || 0 },
    { name: "Low", value: stats.low_risk || 0 },
  ];

  const diseaseData = Object.entries(stats.disease_distribution || {}).map(([name, value]) => ({ name, value }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            background: mode === "light" ? "rgba(255,255,255,0.95)" : "rgba(30,30,35,0.95)",
            backdropFilter: "blur(12px)",
            p: 2,
            borderRadius: "12px",
            border: `1px solid ${mode === "light" ? "rgba(102,126,234,0.2)" : "rgba(255,255,255,0.1)"}`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}>
          <Typography sx={{ color: mode === "light" ? "#444" : "#ddd", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" }}>
            {label || payload[0].name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: payload[0].color || payload[0].payload.fill || "#667eea" }} />
            <Typography sx={{ color: mode === "light" ? "#1a1a1a" : "#fff", fontWeight: 800, fontSize: "1.2rem" }}>
              {payload[0].value}
            </Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };

  const tableHeaders = ["User", "Query", "Disease", "Risk", "Confidence"];
  const renderTableRow = (log, index, currentMode) => {
    const isLight = currentMode === "light";
    return (
      <TableRow 
        key={index} 
        onClick={() => openUserDrawer(log.user_id)}
        sx={{
          cursor: "pointer",
          "&:hover": { background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)" },
        }}>
        <TableCell sx={{ color: isLight ? "#1a1a1a" : "#fff", borderBottom: isLight ? "1px solid #eee" : "1px solid #333", fontWeight: 600 }}>
            {log.user_name || "Unknown"}
        </TableCell>
        <TableCell sx={{ color: isLight ? "#555" : "#ccc", borderBottom: isLight ? "1px solid #eee" : "1px solid #333" }}>{log.query}</TableCell>
        <TableCell sx={{ color: isLight ? "#555" : "#ccc", borderBottom: isLight ? "1px solid #eee" : "1px solid #333" }}>{log.disease || "N/A"}</TableCell>
        <TableCell sx={{ borderBottom: isLight ? "1px solid #eee" : "1px solid #333" }}>
          <Chip label={log.risk_level?.toUpperCase()} color={getColor(log.risk_level)} size="small" />
        </TableCell>
        <TableCell sx={{ color: isLight ? "#555" : "#ccc", borderBottom: isLight ? "1px solid #eee" : "1px solid #333" }}>{log.confidence || "N/A"}</TableCell>
      </TableRow>
    );
  };

  return (
    <PageWrapper>
      {/* HEADER SECTION */}
      <Box
        className="gsap-animate-up"
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        mb={5}
        gap={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: "2rem", md: "2.6rem" } }}>
            Admin Command Center
          </Typography>
          <Typography sx={{ fontSize: "1.1rem", opacity: 0.8, color: mode === "light" ? "#666" : "#b0b0b0" }}>
            Platform-wide real-time telemetry and compliance.
          </Typography>
        </Box>

        <Button
          startIcon={<DownloadIcon />}
          variant="contained"
          onClick={exportCSV}
          sx={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "12px",
            boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
            px: 3,
            py: 1,
            "&:hover": { background: "linear-gradient(135deg, #5568d3, #6a3f91)" },
          }}>
          Export CSV
        </Button>
      </Box>

      {/* ================= STATS ================= */}
      <Grid container spacing={4} mb={6} className="gsap-animate-up">
        <Grid item xs={12} md={6}>
          <MetricCard 
            title="Total Platform Queries"
            value={stats.total_queries || 0}
            subtitle="All user interactions"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <MetricCard 
            title="High Risk Anomalies 🚨"
            value={stats.high_risk || 0}
            subtitle="Requires review"
          />
        </Grid>
      </Grid>

      {/* ================= ALERTS ================= */}
      {logs.some((l) => l.risk_level === "high") && (
        <Box 
          className="gsap-animate-up"
          sx={{ 
            mb: 4, 
            p: 2, 
            background: mode === "light" ? "rgba(255, 77, 79, 0.1)" : "rgba(255, 77, 79, 0.1)", 
            border: `1px solid ${mode === "light" ? "rgba(255, 77, 79, 0.5)" : "rgba(255, 77, 79, 0.3)"}`, 
            borderRadius: "16px",
            color: mode === "light" ? "#c92a2a" : "#ff4d4f",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1
          }}>
          🚨 High Risk Cases Detected Last 24H!
        </Box>
      )}

      {/* ================= CHART & FILTERS GRID ================= */}
      <Grid container spacing={4} mb={6} className="gsap-animate-up">
        <Grid item xs={12} md={4}>
          <ChartCard title="System Risk Distribution">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={riskData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <defs>
                   <linearGradient id="colorRiskHigh" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#ff4d4f" stopOpacity={0.9} />
                     <stop offset="100%" stopColor="#ff4d4f" stopOpacity={0.2} />
                   </linearGradient>
                   <linearGradient id="colorRiskMed" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#ffa940" stopOpacity={0.9} />
                     <stop offset="100%" stopColor="#ffa940" stopOpacity={0.2} />
                   </linearGradient>
                   <linearGradient id="colorRiskLow" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#00c49f" stopOpacity={0.9} />
                     <stop offset="100%" stopColor="#00c49f" stopOpacity={0.2} />
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={mode === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: mode === "light" ? "#888" : "#ccc", fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: mode === "light" ? "#888" : "#ccc" }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
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
          </ChartCard>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <ChartCard title="Global Disease Taxonomy">
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={diseaseData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={6}
                    stroke="none"
                    cornerRadius={8}>
                    {diseaseData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box 
            sx={{ 
                height: "100%", 
                background: mode === "light" ? "rgba(255,255,255,0.85)" : "rgba(30,30,30,0.6)",
                backdropFilter: "blur(12px)",
                borderRadius: "24px",
                border: mode === "light" ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(255,255,255,0.05)",
                p: { xs: 2, md: 4 },
                boxShadow: mode === "light" ? "0 10px 30px rgba(0,0,0,0.02)" : "0 8px 32px rgba(0,0,0,0.2)",
            }}>
             <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
               Telemetry Filters
             </Typography>
             
             <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  label="Search Query or User..."
                  variant="outlined"
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                       borderRadius: "12px",
                       background: mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)",
                       "& fieldset": { borderColor: mode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" },
                    },
                    "& .MuiInputLabel-root": { color: mode === "light" ? "#666" : "#aaa" }
                  }}
                />

                <TextField
                  select
                  label="Filter by Risk Threshold"
                  fullWidth
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                       borderRadius: "12px",
                       background: mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)",
                       "& fieldset": { borderColor: mode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" },
                    },
                    "& .MuiInputLabel-root": { color: mode === "light" ? "#666" : "#aaa" },
                    "& .MuiSelect-icon": { color: mode === "light" ? "#666" : "#aaa" }
                  }}>
                  <MenuItem value="all">All Thresholds</MenuItem>
                  <MenuItem value="high">High Risk</MenuItem>
                  <MenuItem value="medium">Medium Risk</MenuItem>
                  <MenuItem value="low">Low Risk</MenuItem>
                </TextField>
             </Box>
          </Box>
        </Grid>
      </Grid>

      {/* ================= DATA TABLE ================= */}
      <Box className="gsap-animate-up">
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            System Audit Logs
          </Typography>
          <Typography sx={{ color: mode === "light" ? "#666" : "#aaa", mb: 3, fontSize: "0.9rem" }}>
            Click on any row to view detailed user analysis
          </Typography>
          <DataTable 
            headers={tableHeaders}
            rows={filteredLogs}
            renderRow={renderTableRow}
          />
      </Box>

      {/* ================= USER DETAILS SIDE DRAWER ================= */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", md: "500px" },
            background: mode === "light" ? "#f5f7fa" : "#17181c",
            color: mode === "light" ? "#1a1a1a" : "#fff",
            p: 4,
          }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ background: "linear-gradient(135deg, #667eea, #764ba2)", p: 1.5, borderRadius: "12px", display: "flex" }}>
                <PersonIcon sx={{ color: "#fff" }} />
              </Box>
              <Box>
                  <Typography variant="h5" fontWeight={800}>{selectedUser?.user_name || "Loading..."}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>{selectedUser?.user_email || "..."}</Typography>
              </Box>
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon sx={{ color: mode === "light" ? "#1a1a1a" : "#fff" }} />
          </IconButton>
        </Box>

        {loadingUser ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50%">
            <CircularProgress sx={{ color: "#667eea" }} />
          </Box>
        ) : selectedUser ? (
          <Box>
            {/* Quick Stats */}
            <Grid container spacing={2} mb={4}>
              <Grid item xs={6}>
                 <Box sx={{ p: 2, background: mode === "light" ? "#fff" : "rgba(255,255,255,0.05)", borderRadius: "16px", border: `1px solid ${mode === "light" ? "#eee" : "#333"}` }}>
                    <Typography variant="h4" fontWeight={800} color="#667eea">{selectedUser.total_valid_queries}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>Total Queries</Typography>
                 </Box>
              </Grid>
              <Grid item xs={6}>
                 <Box sx={{ p: 2, background: mode === "light" ? "#fff" : "rgba(255,255,255,0.05)", borderRadius: "16px", border: `1px solid ${mode === "light" ? "#eee" : "#333"}` }}>
                    <Typography variant="h4" fontWeight={800} color="error.main">{selectedUser.high_risk_cases}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>High Risk Cases</Typography>
                 </Box>
              </Grid>
            </Grid>

            {/* Disease Breakdown */}
            <Typography variant="h6" fontWeight={700} mb={2}>Disease Clustering</Typography>
            <Box mb={4} sx={{ p: 2, background: mode === "light" ? "#fff" : "rgba(255,255,255,0.05)", borderRadius: "16px", border: `1px solid ${mode === "light" ? "#eee" : "#333"}`, display: "flex", flexWrap: "wrap", gap: 1 }}>
               {Object.entries(selectedUser.disease_distribution || {}).map(([disease, count]) => (
                 <Chip key={disease} label={`${disease}: ${count}`} sx={{ background: "rgba(102,126,234,0.1)", color: "#667eea", fontWeight: 600 }} />
               ))}
               {Object.keys(selectedUser.disease_distribution || {}).length === 0 && (
                 <Typography variant="body2" sx={{ opacity: 0.5 }}>No recorded diseases.</Typography>
               )}
            </Box>

            <Divider sx={{ my: 4, borderColor: mode === "light" ? "#eee" : "#333" }} />

            {/* Logs Drill-down */}
            <Typography variant="h6" fontWeight={700} mb={2}>Historical Diagnostic Logs</Typography>
            <Box display="flex" flexDirection="column" gap={2}>
               {selectedUser.recent_logs?.map((log, i) => (
                 <Box key={i} sx={{ p: 2, background: mode === "light" ? "#fff" : "rgba(255,255,255,0.05)", borderRadius: "12px", border: `1px solid ${mode === "light" ? "#eee" : "#333"}` }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                       <Typography variant="body2" fontWeight={700} sx={{ opacity: 0.6 }}>{new Date(log.timestamp).toLocaleDateString()}</Typography>
                       <Chip label={log.risk_level?.toUpperCase()} size="small" color={getColor(log.risk_level)} />
                    </Box>
                    <Typography variant="body1" fontWeight={600} mb={0.5}>"{log.query}"</Typography>
                    <Typography variant="body2" color="#667eea">→ Detected: {log.disease}</Typography>
                 </Box>
               ))}
               {(!selectedUser.recent_logs || selectedUser.recent_logs.length === 0) && (
                 <Typography variant="body2" sx={{ opacity: 0.5 }}>No historical queries found.</Typography>
               )}
            </Box>
          </Box>
        ) : (
          <Typography>Error loading user info.</Typography>
        )}
      </Drawer>
    </PageWrapper>
  );
}
