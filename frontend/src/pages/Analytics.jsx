import { useEffect, useState } from "react";
import axios from "axios";
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
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#00c49f"];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/analytics/full-dashboard",
      );
      setData(res.data);
    } catch (err) {
      console.error("Analytics error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= EFFECT =================
  useEffect(() => {
    fetchAnalytics();

    // 🔥 AUTO REFRESH (fallback)
    const interval = setInterval(fetchAnalytics, 5000);

    // 🔥 LIVE EVENT (from Chat)
    const handler = () => fetchAnalytics();
    window.addEventListener("analyticsUpdated", handler);

    return () => {
      clearInterval(interval);
      window.removeEventListener("analyticsUpdated", handler);
    };
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        📊 Loading analytics...
      </div>
    );
  }

  // ================= SAFE DATA =================
  const diseaseDist = data?.disease_distribution || {};
  const sentimentDist = data?.sentiment_distribution || {};
  const riskDist = data?.risk_distribution || {};
  const dailyUsage = data?.daily_usage || {};

  const toChartData = (obj) =>
    Object.entries(obj).map(([name, value]) => ({ name, value }));

  const diseaseData = toChartData(diseaseDist);
  const sentimentData = toChartData(sentimentDist);
  const riskData = toChartData(riskDist);
  const dailyData = toChartData(dailyUsage);

  // ================= EMPTY STATE =================
  const noData =
    diseaseData.length === 0 &&
    sentimentData.length === 0 &&
    riskData.length === 0;

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>📊 Analytics Dashboard</h2>

      {/* ===== SUMMARY CARDS ===== */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}>
        <div style={cardStyle}>
          <h4>Total Queries</h4>
          <p>{data?.total_queries || 0}</p>
        </div>

        <div style={cardStyle}>
          <h4>Avg Confidence</h4>
          <p>{data?.avg_confidence?.toFixed(2) || 0}%</p>
        </div>

        <div style={cardStyle}>
          <h4>Emergency Cases</h4>
          <p>{data?.emergency_cases || 0}</p>
        </div>
      </div>

      {noData && (
        <p style={{ color: "#aaa" }}>
          ⚠️ No analytics data yet. Send some chat messages first.
        </p>
      )}

      {/* ===== DISEASE ===== */}
      <h3>🦠 Disease Distribution</h3>
      {diseaseData.length === 0 ? (
        <p>No data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={diseaseData} dataKey="value" outerRadius={100} label>
              {diseaseData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}

      {/* ===== RISK ===== */}
      <h3>⚠️ Risk Distribution</h3>
      {riskData.length === 0 ? (
        <p>No data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={riskData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#ff4d4f" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* ===== SENTIMENT ===== */}
      <h3>😊 Sentiment</h3>
      {sentimentData.length === 0 ? (
        <p>No data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={sentimentData} dataKey="value" outerRadius={100} label>
              {sentimentData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}

      {/* ===== DAILY ===== */}
      <h3>📅 Daily Usage</h3>
      {dailyData.length === 0 ? (
        <p>No data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ================= CARD STYLE =================
const cardStyle = {
  background: "#1f1f2e",
  padding: "15px",
  borderRadius: "10px",
  minWidth: "150px",
};
