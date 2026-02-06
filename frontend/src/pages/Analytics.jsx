import { Box, Paper, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import PageWrapper from "../components/animations/PageWrapper";

// Line chart data
const data = [
  { day: "Mon", queries: 20 },
  { day: "Tue", queries: 35 },
  { day: "Wed", queries: 50 },
  { day: "Thu", queries: 40 },
  { day: "Fri", queries: 60 },
];

// Pie chart data
const pieData = [
  { name: "Symptoms", value: 40 },
  { name: "Medicines", value: 25 },
  { name: "Diseases", value: 20 },
  { name: "Emergency", value: 15 },
];

// Custom Colors
const COLORS = ["#007AFF", "#23D5AB", "#6B73FF", "#000DFF"];

export default function Analytics() {
  return (
    <PageWrapper>
      <Box
        sx={{
          padding: 4,
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e6efff, #ffffff)",
        }}>
        {/* TITLE */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 4,
            color: "#111",
            fontSize: "2.3rem",
          }}>
          📊 Analytics Overview
        </Typography>

        {/* LINE CHART CARD */}
        <Paper
          sx={{
            padding: 4,
            borderRadius: "25px",
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
            mb: 4,
          }}>
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: 600, color: "#222" }}>
            📈 Queries per Day
          </Typography>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <XAxis dataKey="day" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="queries"
                stroke="#007AFF"
                strokeWidth={4}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* PIE CHART CARD */}
        <Paper
          sx={{
            padding: 4,
            borderRadius: "25px",
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
          }}>
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: 600, color: "#222" }}>
            🥧 Query Categories
          </Typography>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label>
                {pieData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </PageWrapper>
  );
}
