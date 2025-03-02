import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles/AnalyticsChart.css"; // Import CSS

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsChart = ({ analytics }) => {
  const data = {
    labels: ["Total Events", "Total Tickets", "Total Revenue"],
    datasets: [
      {
        label: "Analytics Data",
        data: [analytics.totalEvents, analytics.totalTickets, analytics.totalRevenue],
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"],
        borderColor: ["#388E3C", "#F57C00", "#1976D2"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow it to expand dynamically
    plugins: {
      legend: { display: false },
      title: { 
        display: true, 
        text: "Event Analytics", 
        color: "#ffffff",
        font: { size: 22 }
      },
    },
    scales: {
      x: {
        ticks: { color: "#ffffff", font: { size: 14 } },
        grid: { color: "rgba(255, 255, 255, 0.2)" },
      },
      y: {
        ticks: { color: "#ffffff", font: { size: 14 } },
        grid: { color: "rgba(255, 255, 255, 0.2)" },
      },
    },
  };
  
  
  

  return (
    <div className="analytics-chart-container">
  <h2>Event Analytics</h2>
  <div className="chart-wrapper">
    <Bar data={data} options={options} />
  </div>
</div>

  );
};

export default AnalyticsChart;
