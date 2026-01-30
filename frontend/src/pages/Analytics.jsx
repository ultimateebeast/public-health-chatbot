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
} from "recharts";

const data = [
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

export default function Analytics() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Analytics
      </Typography>

      <Paper sx={{ padding: 3, borderRadius: "20px" }}>
        <Typography variant="h6">Queries per Day</Typography>
        <LineChart width={600} height={300} data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="queries"
            stroke="#0A84FF"
            strokeWidth={3}
          />
        </LineChart>
      </Paper>

      <Paper sx={{ padding: 3, borderRadius: "20px", mt: 4 }}>
        <Typography variant="h6">Query Categories</Typography>
        <PieChart width={600} height={300}>
          <Pie
            data={pieData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={100}>
            {pieData.map((_, i) => (
              <Cell
                key={i}
                fill={["#0A84FF", "#23D5AB", "#6B73FF", "#000DFF"][i]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </Paper>
    </Box>
  );
}
