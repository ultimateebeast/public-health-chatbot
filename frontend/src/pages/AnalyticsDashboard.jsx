import { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/analytics/full-dashboard")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  if (!data) return <Typography>Loading...</Typography>;

  // ================= TRANSFORM DATA =================
  const diseaseData = Object.entries(data.disease_distribution || {}).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  const riskData = Object.entries(data.risk_distribution || {}).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  const sentimentData = Object.entries(data.sentiment_distribution || {}).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  // ================= UI =================
  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        📊 Analytics Dashboard
      </Typography>

      {/* STATS */}
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography>Total Queries</Typography>
              <Typography variant="h6">{data.total_queries}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography>Avg Confidence</Typography>
              <Typography variant="h6">
                {data.avg_confidence?.toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={3}>
          <Card>
            <CardContent>
              <Typography>Emergency Cases</Typography>
              <Typography variant="h6">{data.emergency_cases}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* CHARTS */}
      <Grid container spacing={3} mt={2}>
        {/* DISEASE PIE */}
        <Grid item xs={12} md={4}>
          <Typography>🦠 Disease Distribution</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={diseaseData} dataKey="value" outerRadius={80}>
                {diseaseData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Grid>

        {/* RISK BAR */}
        <Grid item xs={12} md={4}>
          <Typography>⚠️ Risk Levels</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={riskData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ff4d4f" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>

        {/* SENTIMENT PIE */}
        <Grid item xs={12} md={4}>
          <Typography>😊 Sentiment</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={sentimentData} dataKey="value" outerRadius={80}>
                {sentimentData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
