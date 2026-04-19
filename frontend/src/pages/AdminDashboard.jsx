import React, { useEffect, useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Paper,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const API_BASE = "http://127.0.0.1:8000/admin";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const exportCSV = () => {
    if (!logs.length) return;

    const headers = [
      "Query",
      "Disease",
      "Risk",
      "Confidence",
      "Emergency",
      "Timestamp",
    ];

    const rows = logs.map((log) => [
      log.query || "",
      log.disease || "",
      log.risk_level || "",
      log.confidence || "",
      log.emergency ? "Yes" : "No",
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

  useEffect(() => {
    fetch(`${API_BASE}/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data));

    fetch(`${API_BASE}/logs`)
      .then((res) => res.json())
      .then((data) => setLogs(data.reverse())); // latest first
  }, []);

  const getColor = (risk) => {
    if (risk === "high") return "error";
    if (risk === "medium") return "warning";
    return "success";
  };

  // 🔍 FILTER + SEARCH
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.query
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = filter === "all" || log.risk_level === filter;

    return matchesSearch && matchesFilter;
  });

  // 📊 CHART DATA
  const riskData = [
    { name: "High", value: stats.high_risk || 0 },
    { name: "Medium", value: stats.medium_risk || 0 },
    { name: "Low", value: stats.low_risk || 0 },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "#fff",
      }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Admin Dashboard
        </Typography>

        <Button
          startIcon={<DownloadIcon />}
          variant="contained"
          onClick={exportCSV}
          sx={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
          }}>
          Export CSV
        </Button>
      </Box>

      {/* ================= STATS ================= */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="body2" color="gray">
                Total Queries
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {stats.total_queries || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="body2" color="gray">
                High Risk Cases 🚨
              </Typography>
              <Typography variant="h4" fontWeight={600} color="error.main">
                {stats.high_risk || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ================= CHART ================= */}
      <Box mb={4}>
        <Typography variant="h6" mb={2}>
          Risk Distribution
        </Typography>

        <Box sx={chartBoxStyle}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* ================= ALERT ================= */}
      {logs.some((l) => l.risk_level === "high") && (
        <Box sx={alertStyle}>🚨 High Risk Cases Detected!</Box>
      )}

      {/* ================= FILTERS ================= */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search Query"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={inputStyle}
        />

        <TextField
          select
          label="Filter Risk"
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={inputStyle}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="high">High</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="low">Low</MenuItem>
        </TextField>
      </Box>

      {/* ================= TABLE ================= */}
      <Paper sx={tableStyle}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={th}>Query</TableCell>
              <TableCell sx={th}>Disease</TableCell>
              <TableCell sx={th}>Risk</TableCell>
              <TableCell sx={th}>Confidence</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredLogs.map((log, index) => (
              <TableRow key={index} sx={rowHover}>
                <TableCell sx={tdWhite}>{log.query}</TableCell>

                <TableCell sx={tdGray}>{log.disease || "N/A"}</TableCell>

                <TableCell>
                  <Chip
                    label={log.risk_level?.toUpperCase()}
                    color={getColor(log.risk_level)}
                    size="small"
                  />
                </TableCell>

                <TableCell sx={tdGray}>{log.confidence || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

/* ================= STYLES ================= */

const cardStyle = {
  borderRadius: 3,
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(10px)",
  color: "#fff",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
};

const chartBoxStyle = {
  background: "rgba(255,255,255,0.05)",
  p: 2,
  borderRadius: 3,
  height: 300,
};

const alertStyle = {
  mb: 3,
  p: 2,
  background: "rgba(255,0,0,0.1)",
  border: "1px solid rgba(255,0,0,0.3)",
  borderRadius: 2,
};

const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  borderRadius: 2,
};

const tableStyle = {
  borderRadius: 3,
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(10px)",
  overflow: "hidden",
};

const th = { color: "#aaa" };
const tdWhite = { color: "#fff" };
const tdGray = { color: "#ccc" };

const rowHover = {
  "&:hover": {
    background: "rgba(255,255,255,0.05)",
  },
};
