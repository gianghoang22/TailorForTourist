import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
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
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const [ordersResponse, bookingsResponse] = await Promise.all([
        fetch("https://localhost:7194/api/Orders", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://localhost:7194/api/Booking", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!ordersResponse.ok || !bookingsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const ordersData = await ordersResponse.json();
      const bookingsData = await bookingsResponse.json();

      console.log("Fetched bookings data:", bookingsData);

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyRevenue = new Array(12).fill(0);
    const monthlyProfit = new Array(12).fill(0);
    const monthlyBookings = new Array(12).fill(0);

    // Process orders
    orders.forEach((order) => {
      const date = new Date(order.orderDate);
      const month = date.getMonth();
      monthlyRevenue[month] += order.totalPrice || 0;
      monthlyProfit[month] += (order.totalPrice || 0) * 0.4;
    });

    console.log("Processing bookings:", bookings);

    // Process bookings with explicit logging
    if (bookings && bookings.length > 0) {
      bookings.forEach((booking) => {
        try {
          // Extract month from booking date (format: "YYYY-MM-DD")
          const month = parseInt(booking.bookingDate.split("-")[1]) - 1; // Convert to 0-based month
          console.log(
            `Processing booking for month: ${month + 1}, date: ${booking.bookingDate}`
          );
          monthlyBookings[month] = (monthlyBookings[month] || 0) + 1;
        } catch (error) {
          console.error(`Error processing booking:`, booking, error);
        }
      });
    }

    console.log("Monthly bookings data:", monthlyBookings);

    // Calculate total bookings for current year
    const currentYear = new Date().getFullYear();
    const totalBookings = bookings.filter((booking) => {
      const bookingYear = booking.bookingDate.split("-")[0];
      return parseInt(bookingYear) === currentYear;
    }).length;

    return {
      labels: months,
      revenue: monthlyRevenue,
      profit: monthlyProfit,
      bookings: monthlyBookings,
      totalBookings,
    };
  };

  const monthlyData = processMonthlyData();

  // Calculate totals
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );
  const totalProfit = totalRevenue * 0.4; // Assuming 40% profit margin
  const profitMargin =
    totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const venueData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: "Revenue",
        data: monthlyData.revenue,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Profit",
        data: monthlyData.profit,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const profitTrendData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: "Profit Trend",
        data: monthlyData.profit,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const bookingData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: "Number of Bookings",
        data: monthlyData.bookings,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderWidth: 1,
        barThickness: 30,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Chart",
      },
    },
  };

  const bookingChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Booking Statistics for ${new Date().getFullYear()}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        title: {
          display: true,
          text: "Number of Bookings",
        },
      },
    },
  };

  const renderActiveChart = () => {
    switch (activeTab) {
      case "revenue":
        return <Bar data={venueData} options={chartOptions} />;
      case "profit":
        return <Line data={profitTrendData} options={chartOptions} />;
      case "bookings":
        console.log("Rendering booking chart with data:", bookingData);
        return (
          <div style={{ height: "400px" }}>
            <Bar
              key={JSON.stringify(bookingData)}
              data={bookingData}
              options={bookingChartOptions}
            />
          </div>
        );
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
          value={`$${totalRevenue.toFixed(2)}`}
          change="+15%"
          icon={<DollarSignIcon />}
          positive
          className="revenue"
        />
        <StatCard
          title="Total Profit"
          value={`$${totalProfit.toFixed(2)}`}
          change="+8%"
          icon={<TrendingUpIcon />}
          positive
          className="profit"
        />
        <StatCard
          title="Profit Margin"
          value={`${profitMargin.toFixed(1)}%`}
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
          active={activeTab === "bookings"}
          onClick={() => setActiveTab("bookings")}
        >
          Bookings
        </TabButton>
      </div>

      <div className="chart-container">
        <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Chart</h2>
        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className="chart-wrapper">{renderActiveChart()}</div>
        )}
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

      <div className="stat-cards">
        <StatCard
          title="Total Bookings"
          value={monthlyData.totalBookings.toString()}
          subtext={`for ${new Date().getFullYear()}`}
          icon={<CalendarIcon />}
        />
        <StatCard
          title="Average Monthly Bookings"
          value={(monthlyData.totalBookings / 12).toFixed(1)}
          subtext="per month"
          icon={<CalendarIcon />}
          positive
        />
        <StatCard
          title="Peak Booking Month"
          value={
            monthlyData.labels[
              monthlyData.bookings.indexOf(Math.max(...monthlyData.bookings))
            ]
          }
          subtext={`${Math.max(...monthlyData.bookings)} bookings`}
          icon={<TrendingUpIcon />}
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
