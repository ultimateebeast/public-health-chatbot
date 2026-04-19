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
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

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
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

import { useThemeContext } from "../hooks/useThemeContext";
import PageWrapper from "../components/ui/PageWrapper";
import MetricCard from "../components/ui/MetricCard";
import ChartCard from "../components/ui/ChartCard";
import DataTable from "../components/ui/DataTable";

const API_BASE = "http://127.0.0.1:8000/admin";
const COLORS = ["#667eea", "#00c49f", "#ffa940", "#ff4d4f", "#764ba2", "#2da4ff", "#ff7a45"];

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

  const openUserDrawer = async (userId, userObj) => {
    if (!userId) return;
    setDrawerOpen(true);
    setLoadingUser(true);
    // Preserving base user data immediately for fast UI feedback
    setSelectedUser({ user_name: userObj.user_name, ...userObj });
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(`${API_BASE}/user/${userId}/analysis`, { headers });
      if (res.ok) {
        const data = await res.json();
        setSelectedUser((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUser(false);
    }
  };

  const exportCSV = () => {
    if (!logs.length) return;
    const headers = ["User", "Query", "Disease", "Risk", "Confidence", "Timestamp"];
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

  // 🧠 ENHANCED GROUPING LOGIC - patient centric!
  const patientsObj = {};
  logs.forEach(log => {
      // Basic fallback ID if user_id missing
      const uid = log.user_id || `anon-${log.user_name}`; 
      if (!patientsObj[uid]) {
          patientsObj[uid] = {
              user_id: log.user_id,
              user_name: log.user_name || "Anonymous Patient",
              total_queries: 0,
              highest_risk: "low",
              diseases: new Set(),
              last_active: log.timestamp
          };
      }
      
      const p = patientsObj[uid];
      p.total_queries += 1;
      if (log.disease && log.disease.toLowerCase() !== "unknown") {
          p.diseases.add(log.disease);
      }
      
      if (log.risk_level === "high") p.highest_risk = "high";
      else if (log.risk_level === "medium" && p.highest_risk !== "high") p.highest_risk = "medium";
      
      if (new Date(log.timestamp) > new Date(p.last_active)) p.last_active = log.timestamp;
  });

  const groupedPatients = Object.values(patientsObj).map(p => ({
      ...p,
      disease_list: Array.from(p.diseases),
      timeString: new Date(p.last_active).toLocaleString()
  })).sort((a,b) => new Date(b.last_active) - new Date(a.last_active));

  const filteredPatients = groupedPatients.filter((p) => {
    const matchesSearch = p.user_name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.highest_risk === filter;
    return matchesSearch && matchesFilter;
  });

  // 📊 MAIN CHARTS 
  const riskData = [
    { name: "High", value: stats.high_risk || 0 },
    { name: "Medium", value: stats.medium_risk || 0 },
    { name: "Low", value: stats.low_risk || 0 },
  ];

  const diseaseData = Object.entries(stats.disease_distribution || {}).map(([name, value]) => ({ name, value }));

  const glassSx = {
    background: mode === "light" ? "rgba(255, 255, 255, 0.75)" : "rgba(30, 30, 35, 0.6)",
    backdropFilter: "blur(20px)",
    border: `1px solid ${mode === "light" ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.05)"}`,
    boxShadow: mode === "light" ? "0 8px 32px rgba(0,0,0,0.05)" : "0 8px 32px rgba(0,0,0,0.2)",
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ ...glassSx, p: 2, borderRadius: "16px", zIndex: 9999 }}>
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

  const tableHeaders = ["Patient Name", "Total Consults", "Primary Conditions", "Peak Risk", "Last Active"];
  const renderTableRow = (p, index, currentMode) => {
    const isLight = currentMode === "light";
    return (
      <TableRow 
        key={index} 
        onClick={() => openUserDrawer(p.user_id, p)}
        sx={{
          cursor: "pointer",
          transition: "0.2s ease",
          "&:hover": { background: isLight ? "rgba(102,126,234,0.05)" : "rgba(102,126,234,0.1)" },
        }}>
        <TableCell sx={{ color: isLight ? "#1a1a1a" : "#fff", borderBottom: isLight ? "1px solid #eee" : "1px solid #222", fontWeight: 700 }}>
             <Box display={"flex"} alignItems={"center"} gap={1.5}>
                 <Box sx={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #667eea, #764ba2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                    <PersonIcon sx={{ fontSize: 20 }}/>
                 </Box>
                 {p.user_name}
             </Box>
        </TableCell>
        <TableCell sx={{ color: isLight ? "#555" : "#ccc", borderBottom: isLight ? "1px solid #eee" : "1px solid #222", fontWeight: 600 }}>{p.total_queries}</TableCell>
        <TableCell sx={{ borderBottom: isLight ? "1px solid #eee" : "1px solid #222" }}>
            <Box display="flex" gap={1} flexWrap={"wrap"}>
                {p.disease_list.slice(0, 2).map((d, i) => (
                   <Chip key={i} label={d} size="small" sx={{ background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)", fontWeight: 600, color: isLight ? "#444" : "#ccc" }} />
                ))}
                {p.disease_list.length > 2 && <Chip label={`+${p.disease_list.length - 2}`} size="small" />}
                {p.disease_list.length === 0 && <span style={{ opacity: 0.5 }}>None detected</span>}
            </Box>
        </TableCell>
        <TableCell sx={{ borderBottom: isLight ? "1px solid #eee" : "1px solid #222" }}>
          <Chip label={p.highest_risk.toUpperCase()} color={getColor(p.highest_risk)} size="small" sx={{ fontWeight: 800 }} />
        </TableCell>
        <TableCell sx={{ color: isLight ? "#555" : "#ccc", borderBottom: isLight ? "1px solid #eee" : "1px solid #222", fontSize: "0.9rem" }}>{p.timeString}</TableCell>
      </TableRow>
    );
  };

  // Calculate drawer charts
  const drawerRiskTimeline = (selectedUser?.recent_logs || []).slice().reverse().map(log => ({
      name: new Date(log.timestamp).toLocaleDateString(undefined, {month:'short', day:'numeric'}),
      score: log.risk_level === 'high' ? 3 : log.risk_level === 'medium' ? 2 : 1,
      disease: log.disease,
      risk: log.risk_level
  }));

  const mostFrequentDiseaseEntry = selectedUser?.disease_distribution 
      ? Object.entries(selectedUser.disease_distribution).sort((a,b)=>b[1]-a[1])[0] 
      : null;

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
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: "2rem", md: "2.6rem" }, letterSpacing: "-1px" }}>
            Admin Command Center
          </Typography>
          <Typography sx={{ fontSize: "1.1rem", opacity: 0.8, color: mode === "light" ? "#666" : "#b0b0b0" }}>
            Platform-wide real-time telemetry and compliance tracking.
          </Typography>
        </Box>

        <Button
          startIcon={<DownloadIcon />}
          variant="contained"
          onClick={exportCSV}
          sx={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "100px",
            boxShadow: "0 10px 20px rgba(102, 126, 234, 0.3)",
            px: 3,
            py: 1.5,
            "&:hover": { background: "linear-gradient(135deg, #5568d3, #6a3f91)", transform: "translateY(-2px)" },
            transition: "0.2s"
          }}>
          Export Telemetry CSV
        </Button>
      </Box>

      {/* ================= STATS ================= */}
      <Grid container spacing={4} mb={6} className="gsap-animate-up">
        <Grid item xs={12} md={6}>
          <MetricCard 
            title="Total Platform Consultations"
            value={stats.total_queries || 0}
            subtitle="Global diagnostic sessions processed"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <MetricCard 
            title="High Risk Anomalies 🚨"
            value={stats.high_risk || 0}
            subtitle="Elevated triage incidents requesting immediate review"
          />
        </Grid>
      </Grid>


      {/* ================= CHART & FILTERS GRID ================= */}
      <Grid container spacing={4} mb={6} className="gsap-animate-up">
        <Grid item xs={12} md={4}>
          <ChartCard title="System Risk Trajectory">
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
          <ChartCard title="Global Condition Taxonomies">
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={diseaseData}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={6}
                    stroke="none"
                    cornerRadius={12}>
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
                 ...glassSx,
                 borderRadius: "28px",
                 p: { xs: 3, md: 4 },
             }}>
             <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Filter Engine</Typography>
             <Typography sx={{ fontSize: "0.9rem", color: "#888", mb: 3 }}>Isolate cohorts by threshold</Typography>
             
             <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  label="Search Patient Namespace..."
                  variant="outlined"
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                       borderRadius: "16px",
                       background: mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)",
                       "& fieldset": { borderColor: mode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" },
                    },
                    "& .MuiInputLabel-root": { color: mode === "light" ? "#666" : "#aaa" }
                  }}
                />

                <TextField
                  select
                  label="Risk Severity Threshold"
                  fullWidth
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                       borderRadius: "16px",
                       background: mode === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)",
                       "& fieldset": { borderColor: mode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" },
                    },
                    "& .MuiInputLabel-root": { color: mode === "light" ? "#666" : "#aaa" },
                    "& .MuiSelect-icon": { color: mode === "light" ? "#666" : "#aaa" }
                  }}>
                  <MenuItem value="all">All Profiles</MenuItem>
                  <MenuItem value="high">Critical Risk Only</MenuItem>
                  <MenuItem value="medium">Medium Risk</MenuItem>
                  <MenuItem value="low">Low Risk</MenuItem>
                </TextField>
             </Box>
          </Box>
        </Grid>
      </Grid>

      {/* ================= DATA TABLE ================= */}
      <Box className="gsap-animate-up">
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: "-1px" }}>
            Patient Master Directory
          </Typography>
          <Typography sx={{ color: mode === "light" ? "#666" : "#aaa", mb: 4, fontSize: "1rem" }}>
            Click on any cohort profile to access their full temporal medical dossier.
          </Typography>
          <DataTable 
            headers={tableHeaders}
            rows={filteredPatients}
            renderRow={renderTableRow}
          />
      </Box>

      {/* ================= PATIENT MEDICAL DOSSIER DRAWER ================= */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", md: "65vw", lg: "55vw", xl: "1000px" },
            background: mode === "light" ? "#fbfbfe" : "#0d0e12",
            color: mode === "light" ? "#1a1a1a" : "#fff",
            p: 0,
            overflowX: "hidden"
          }
        }}
      >
        {selectedUser && (
          <Box sx={{ width: "100%", position: "relative", minHeight: "100vh", pb: 8 }}>
            
            {/* Header Art Frame */}
            <Box sx={{ width: "100%", h: "20vh", pt: 6, pb: 10, px: 5, background: "linear-gradient(135deg, #667eea, #764ba2)", position: "relative", borderRadius: "0 0 40px 40px", overflow: "hidden" }}>
                <Box sx={{ position: "absolute", top: "-50%", left: "-10%", width: "50%", height: "200%", background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)", filter: "blur(20px)" }} />
                
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" position="relative" zIndex={2}>
                    <Box display="flex" alignItems="center" gap={3}>
                        <Box sx={{ width: 80, height: 80, borderRadius: "24px", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", border: "1px solid rgba(255,255,255,0.4)" }}>
                            <PersonIcon sx={{ fontSize: 40, color: "#fff" }} />
                        </Box>
                        <Box color="#fff">
                            <Typography sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", opacity: 0.8, fontSize: "0.85rem", mb: 0.5 }}>Patient Medical Dossier</Typography>
                            <Typography variant="h3" fontWeight={900} letterSpacing="-1px">{selectedUser.user_name}</Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={() => setDrawerOpen(false)} sx={{ background: "rgba(255,255,255,0.1)", "&:hover":{background: "rgba(255,255,255,0.2)"} }}>
                        <CloseIcon sx={{ color: "#fff" }} />
                    </IconButton>
                </Box>
            </Box>

            {loadingUser && (
                 <Box sx={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)" }}>
                     <CircularProgress sx={{ color: "#667eea" }} />
                 </Box>
            )}

            {!loadingUser && (
            <Box px={5} mt={-5} position="relative" zIndex={10}>
                
                {/* HUD STATS */}
                <Grid container spacing={3} mb={6}>
                   <Grid item xs={12} md={4}>
                       <Box sx={{ ...glassSx, p: 3, borderRadius: "24px", display: "flex", alignItems: "center", gap: 2 }}>
                           <Box sx={{ p: 1.5, borderRadius: "16px", background: "rgba(102,126,234,0.1)", color: "#667eea" }}><FormatListBulletedRoundedIcon /></Box>
                           <Box>
                               <Typography variant="h5" fontWeight={900}>{selectedUser.total_valid_queries}</Typography>
                               <Typography variant="body2" color={mode==="light"?"#666":"#aaa"} fontWeight={600} textTransform="uppercase" fontSize="0.75rem" letterSpacing="1px">Total Consults</Typography>
                           </Box>
                       </Box>
                   </Grid>
                   <Grid item xs={12} md={4}>
                       <Box sx={{ ...glassSx, p: 3, borderRadius: "24px", display: "flex", alignItems: "center", gap: 2 }}>
                           <Box sx={{ p: 1.5, borderRadius: "16px", background: "rgba(255,77,79,0.1)", color: "#ff4d4f" }}><ShieldRoundedIcon /></Box>
                           <Box>
                               <Typography variant="h5" fontWeight={900} color="error.main">{selectedUser.high_risk_cases}</Typography>
                               <Typography variant="body2" color={mode==="light"?"#666":"#aaa"} fontWeight={600} textTransform="uppercase" fontSize="0.75rem" letterSpacing="1px">High Risk Incidents</Typography>
                           </Box>
                       </Box>
                   </Grid>
                   <Grid item xs={12} md={4}>
                       <Box sx={{ ...glassSx, p: 3, borderRadius: "24px", display: "flex", alignItems: "center", gap: 2 }}>
                           <Box sx={{ p: 1.5, borderRadius: "16px", background: "rgba(0,196,159,0.1)", color: "#00c49f" }}><TrendingUpRoundedIcon /></Box>
                           <Box>
                               <Typography variant="h6" fontWeight={900} lineHeight={1.2} color="primary.main">{mostFrequentDiseaseEntry ? mostFrequentDiseaseEntry[0] : "Healthy"}</Typography>
                               <Typography variant="body2" color={mode==="light"?"#666":"#aaa"} fontWeight={600} textTransform="uppercase" fontSize="0.75rem" letterSpacing="1px">Primary Contender</Typography>
                           </Box>
                       </Box>
                   </Grid>
                </Grid>

                <Grid container spacing={4} mb={6}>
                   {/* TEMPORAL CHART */}
                   <Grid item xs={12} md={8}>
                       <Box sx={{ ...glassSx, p: 4, borderRadius: "28px", height: "100%" }}>
                          <Typography variant="h6" fontWeight={800} mb={1}>Chronological Risk Horizon</Typography>
                          <Typography sx={{ fontSize: "0.9rem", color: "#888", mb: 4 }}>Temporal mapping of algorithmic risk scores (1=Low, 3=High)</Typography>
                          <ResponsiveContainer width="100%" height={260}>
                              <AreaChart data={drawerRiskTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                 <defs>
                                     <linearGradient id="colorRiskLine" x1="0" y1="0" x2="0" y2="1">
                                         <stop offset="5%" stopColor="#667eea" stopOpacity={0.4}/>
                                         <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                                     </linearGradient>
                                 </defs>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={mode === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"} />
                                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: mode === "light" ? "#888" : "#ccc", fontSize: 12 }} dy={10} />
                                 <YAxis domain={[0, 4]} ticks={[1,2,3]} axisLine={false} tickLine={false} tick={{ fill: mode === "light" ? "#888" : "#ccc" }} />
                                 <Tooltip content={({ active, payload }) => {
                                      if (active && payload && payload.length) {
                                         const p = payload[0].payload;
                                         return (
                                            <Box sx={{ ...glassSx, p: 2, borderRadius: "12px", border: `1px solid ${p.risk === 'high' ? '#ff4d4f' : p.risk==='medium' ? '#ffa940' : '#00c49f'}` }}>
                                               <Typography fontWeight={800} fontSize="0.8rem" textTransform="uppercase" color="#888" mb={0.5}>{p.name}</Typography>
                                               <Typography fontWeight={900} fontSize="1.1rem">{p.disease}</Typography>
                                               <Chip size="small" label={p.risk.toUpperCase()} sx={{ background: p.risk === 'high' ? 'rgba(255,77,79,0.2)' : p.risk==='medium' ? 'rgba(255,169,64,0.2)' : 'rgba(0,196,159,0.2)', color: p.risk === 'high' ? '#ff4d4f' : p.risk==='medium' ? '#ffa940' : '#00c49f', mt: 1, fontWeight: 800 }}/>
                                            </Box>
                                         );
                                      }
                                      return null;
                                 }} />
                                 <Area type="monotone" dataKey="score" stroke="#667eea" strokeWidth={4} fillOpacity={1} fill="url(#colorRiskLine)" />
                              </AreaChart>
                          </ResponsiveContainer>
                       </Box>
                   </Grid>

                   {/* DISEASE DISTRIBUTION COMPACT PIE */}
                   <Grid item xs={12} md={4}>
                       <Box sx={{ ...glassSx, p: 4, borderRadius: "28px", height: "100%" }}>
                           <Typography variant="h6" fontWeight={800} mb={1}>Diagnosis Spread</Typography>
                           <ResponsiveContainer width="100%" height={260}>
                              <PieChart>
                                <Pie
                                  data={Object.entries(selectedUser.disease_distribution || {}).map(([name, value]) => ({ name, value }))}
                                  dataKey="value"
                                  innerRadius={50}
                                  outerRadius={75}
                                  paddingAngle={8}
                                  stroke="none"
                                  cornerRadius={8}>
                                  {Object.entries(selectedUser.disease_distribution || {}).map((_, i) => (
                                    <Cell key={i} fill={COLORS[(i+2) % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                              </PieChart>
                          </ResponsiveContainer>
                       </Box>
                   </Grid>
                </Grid>

                {/* HISTORICAL TIMELINE */}
                <Typography variant="h5" fontWeight={900} mb={3} letterSpacing="-0.5px">Historical Log Matrix</Typography>
                <Box position="relative" sx={{ pl: {xs: 4, md: 5} }}>
                    {/* Vertical Connecting Line */}
                    <Box sx={{ position: "absolute", left: {xs: 18, md: 22}, top: 20, bottom: 20, width: 2, background: mode==="light"?"#e0e0e0":"#2a2a35" }} />

                    {selectedUser.recent_logs?.map((log, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}>
                           <Box position="relative" mb={4}>
                              {/* Dot Point */}
                              <Box sx={{ position: "absolute", left: {xs:-30, md: -34}, top: 12, width: 14, height: 14, borderRadius: "50%", background: mode==="light"?"#fff":"#1a1b20", border: `3px solid ${getColor(log.risk_level) === 'error' ? '#ff4d4f' : getColor(log.risk_level) === 'warning' ? '#ffa940' : '#00c49f'}`, zIndex: 2 }} />

                              <Box sx={{ ...glassSx, p: 3, borderRadius: "20px", display: "flex", flexDirection: "column", gap: 1 }}>
                                  <Box display="flex" justifyContent="space-between" alignItems="center">
                                      <Typography variant="body2" fontWeight={800} color="#888" sx={{ letterSpacing: "1px", textTransform: "uppercase" }}>{new Date(log.timestamp).toLocaleString(undefined, {dateStyle: 'medium', timeStyle: 'short'})}</Typography>
                                      <Chip label={log.risk_level?.toUpperCase()} size="small" sx={{ background: log.risk_level === 'high' ? 'rgba(255,77,79,0.1)' : log.risk_level==='medium' ? 'rgba(255,169,64,0.1)' : 'rgba(0,196,159,0.1)', color: log.risk_level === 'high' ? '#ff4d4f' : log.risk_level==='medium' ? '#ffa940' : '#00c49f', fontWeight: 800, border: `1px solid ${log.risk_level === 'high' ? 'rgba(255,77,79,0.3)' : log.risk_level==='medium' ? 'rgba(255,169,64,0.3)' : 'rgba(0,196,159,0.3)'}` }} />
                                  </Box>
                                  <Typography variant="body1" fontWeight={500} sx={{ opacity: 0.9, fontStyle: "italic", mt: 1 }}>"{log.query}"</Typography>
                                  <Box display="flex" alignItems="center" gap={1.5} mt={1}>
                                       <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#667eea" }} />
                                      <Typography variant="h6" color={mode==="light"?"#1a1a1a":"#fff"} fontWeight={800}>{log.disease}</Typography>
                                      <Typography variant="body2" color="#888" fontWeight={700}>({log.confidence}% Match)</Typography>
                                  </Box>
                              </Box>
                           </Box>
                        </motion.div>
                    ))}
                    {(!selectedUser.recent_logs || selectedUser.recent_logs.length === 0) && (
                        <Typography variant="body1" sx={{ opacity: 0.5, fontStyle: "italic" }}>No temporal data recorded for this patient.</Typography>
                    )}
                </Box>

            </Box>
            )}
          </Box>
        )}
      </Drawer>
    </PageWrapper>
  );
}
