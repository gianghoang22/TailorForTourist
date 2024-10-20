import React, { useState } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  UsersIcon,
  CalendarIcon,
  RepeatIcon,
  TrendingUpIcon,
  DollarSignIcon,
  PercentIcon,
} from "lucide-react";
import "./ProfitCalculation.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const ProfitCalculation = () => {
  const [activeTab, setActiveTab] = useState("revenue");

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const venueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Profit",
        data: [5000, 8000, 6000, 11000, 9000, 14000],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const profitTrendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Profit Trend",
        data: [5000, 8000, 6000, 11000, 9000, 14000],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const customerSatisfactionData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Customer Satisfaction",
        data: [4.2, 4.3, 4.1, 4.4, 4.5, 4.6],
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const eventTypeData = {
    labels: ["Weddings", "Corporate", "Birthdays", "Concerts", "Other"],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  const renderActiveChart = () => {
    switch (activeTab) {
      case "revenue":
        return <Bar data={venueData} options={chartOptions} />;
      case "profit":
        return <Line data={profitTrendData} options={chartOptions} />;
      case "satisfaction":
        return <Line data={customerSatisfactionData} options={chartOptions} />;
      case "events":
        return <Doughnut data={eventTypeData} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <div className="profit-calculation">
      <h1>Venue and Profit Statistics</h1>

      <div className="stat-cards">
        <StatCard
          title="Total Revenue"
          value="$123,000"
          change="+15%"
          icon={<DollarSignIcon />}
          positive
          className="revenue"
        />
        <StatCard
          title="Total Profit"
          value="$53,000"
          change="+8%"
          icon={<TrendingUpIcon />}
          positive
          className="profit"
        />
        <StatCard
          title="Profit Margin"
          value="43.1%"
          change="-2%"
          icon={<PercentIcon />}
          className="margin"
        />
      </div>

      <div className="chart-navigation">
        <TabButton
          active={activeTab === "revenue"}
          onClick={() => setActiveTab("revenue")}
        >
          Revenue & Profit
        </TabButton>
        <TabButton
          active={activeTab === "profit"}
          onClick={() => setActiveTab("profit")}
        >
          Profit Trend
        </TabButton>
        <TabButton
          active={activeTab === "satisfaction"}
          onClick={() => setActiveTab("satisfaction")}
        >
          Customer Satisfaction
        </TabButton>
        <TabButton
          active={activeTab === "events"}
          onClick={() => setActiveTab("events")}
        >
          Event Types
        </TabButton>
      </div>

      <div className="chart-container">
        <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Chart</h2>
        <div className="chart-wrapper">{renderActiveChart()}</div>
      </div>

      <div className="stat-cards">
        <StatCard
          title="Average Event Size"
          value="150"
          subtext="guests per event"
          icon={<UsersIcon />}
        />
        <StatCard
          title="Booking Rate"
          value="85%"
          change="+5%"
          icon={<CalendarIcon />}
          positive
        />
        <StatCard
          title="Repeat Customers"
          value="32%"
          subtext="of total bookings"
          icon={<RepeatIcon />}
        />
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  change,
  subtext,
  icon,
  positive,
  className,
}) => (
  <div className={`stat-card ${className} ${positive ? "positive" : ""}`}>
    <div className="stat-card-header">
      <h3>{title}</h3>
      {icon}
    </div>
    <div className="stat-card-content">
      <p className="value">{value}</p>
      {change && (
        <p className={`change ${positive ? "positive" : "negative"}`}>
          {change} {positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </p>
      )}
      {subtext && <p className="subtext">{subtext}</p>}
    </div>
  </div>
);

const TabButton = ({ children, active, onClick }) => (
  <button className={`tab-button ${active ? "active" : ""}`} onClick={onClick}>
    {children}
  </button>
);

export default ProfitCalculation;
