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

const COLORS = ["#667eea", "#764ba2", "#0084FF", "#FF6B6B"];

import { useThemeContext } from "../hooks/useThemeContext";

export default function Analytics() {
  const { mode } = useThemeContext();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: { xs: 2, md: 4 },
        background:
          mode === "light"
            ? "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
            : "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)",
      }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: mode === "light" ? "#1a1a1a" : "#f5f5f5",
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
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              height: "350px",
            }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#1a1a1a",
                fontWeight: 600,
              }}>
              Queries per Day
            </Typography>

            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={dailyData}>
                <XAxis dataKey="day" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #e0e0e0",
                  }}
                  labelStyle={{ color: "#1a1a1a" }}
                />
                <Line
                  type="monotone"
                  dataKey="queries"
                  stroke="#667eea"
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
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              height: "350px",
            }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#1a1a1a",
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
                    background: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #e0e0e0",
                  }}
                  labelStyle={{ color: "#1a1a1a" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
}
