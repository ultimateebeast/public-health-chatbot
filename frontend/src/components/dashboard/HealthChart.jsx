import React, { useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import gsap from "gsap";

export default function HealthChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    gsap.from(chartRef.current, {
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: "power3.out",
    });
  }, []);

  const chartData = {
    series: [
      {
        name: "Health Score",
        data: [72, 76, 78, 82, 85, 87, 90, 93],
      },
    ],
    options: {
      chart: {
        type: "area",
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 900,
        },
      },
      colors: ["#0A84FF"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.5,
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 100],
          colorStops: [
            { offset: 0, color: "#0A84FF", opacity: 0.3 },
            { offset: 100, color: "#0A84FF", opacity: 0 },
          ],
        },
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: "smooth",
        width: 4,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        labels: {
          style: { colors: "#666" },
        },
      },
      yaxis: {
        labels: {
          style: { colors: "#666" },
        },
      },
      grid: {
        borderColor: "rgba(0,0,0,0.08)",
        strokeDashArray: 5,
      },
      tooltip: {
        theme: "light",
        x: { show: true },
      },
    },
  };

  return (
    <div
      ref={chartRef}
      style={{
        background: "rgba(255,255,255,0.3)",
        backdropFilter: "blur(20px)",
        borderRadius: "25px",
        padding: "25px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        border: "1px solid rgba(255,255,255,0.4)",
      }}>
      <h2 style={{ marginBottom: "20px", fontWeight: 700, color: "#222" }}>
        Health Score Trend
      </h2>

      <Chart
        options={chartData.options}
        series={chartData.series}
        type="area"
        height={320}
      />
    </div>
  );
}
