import { Box, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
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
import { useTheme } from "../context/ThemeContext";

const dailyData = [
  { day: "Mon", queries: 20 },
  { day: "Tue", queries: 35 },
  { day: "Wed", queries: 50 },
  { day: "Thu", queries: 40 },
  { day: "Fri", queries: 60 },
];

const pieData = [
  { name: "Symptoms", value: 40 },
  { name: "Medicines", value: 25 },
  { name: "Diseases", value: 20 },
  { name: "Emergency", value: 15 },
];

const COLORS = ["#0A84FF", "#23D5AB", "#6B73FF", "#FF7B7B"];

export default function Analytics() {
  const { mode } = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: { xs: 2, md: 4 },
        background:
          mode === "light"
            ? "linear-gradient(135deg,#dce6f7,#eef4ff)"
            : "linear-gradient(135deg,#0d0d0d,#1a1a1a)",
      }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: mode === "light" ? "#111" : "#eee",
          textAlign: "center",
        }}>
        Analytics Dashboard 📊
      </Typography>

      {/* GRID CONTAINER */}
      <Box
        sx={{
          display: "grid",
          gap: 4,
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        }}>
        {/* LINE CHART CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}>
          <Paper
            sx={{
              padding: 3,
              borderRadius: "22px",
              background:
                mode === "light"
                  ? "rgba(255,255,255,0.7)"
                  : "rgba(40,40,40,0.7)",
              backdropFilter: "blur(18px)",
              border:
                mode === "light"
                  ? "1px solid rgba(255,255,255,0.3)"
                  : "1px solid rgba(255,255,255,0.1)",
              height: "350px",
            }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: mode === "light" ? "#111" : "#eee",
                fontWeight: 600,
              }}>
              Queries per Day
            </Typography>

            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={dailyData}>
                <XAxis
                  dataKey="day"
                  stroke={mode === "light" ? "#222" : "#ddd"}
                />
                <YAxis stroke={mode === "light" ? "#222" : "#ddd"} />
                <Tooltip
                  contentStyle={{
                    background: mode === "light" ? "#fff" : "#222",
                    borderRadius: "10px",
                  }}
                  labelStyle={{ color: mode === "light" ? "#000" : "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="queries"
                  stroke="#0A84FF"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </motion.div>

        {/* PIE CHART CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}>
          <Paper
            sx={{
              padding: 3,
              borderRadius: "22px",
              background:
                mode === "light"
                  ? "rgba(255,255,255,0.7)"
                  : "rgba(40,40,40,0.7)",
              backdropFilter: "blur(18px)",
              border:
                mode === "light"
                  ? "1px solid rgba(255,255,255,0.3)"
                  : "1px solid rgba(255,255,255,0.1)",
              height: "350px",
            }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: mode === "light" ? "#111" : "#eee",
                fontWeight: 600,
              }}>
              Query Categories
            </Typography>

            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: mode === "light" ? "#fff" : "#222",
                    borderRadius: "10px",
                  }}
                  labelStyle={{ color: mode === "light" ? "#000" : "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
}
