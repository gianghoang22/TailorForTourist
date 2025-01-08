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
import html2pdf from "html2pdf.js";
import { calculateStoreRevenue } from "../../utils/revenueCalculator";

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
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userID");

    try {
      const [bookingsResponse, storeResponse] = await Promise.all([
        fetch("https://vesttour.xyz/api/Booking", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`https://vesttour.xyz/api/Store/userId/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!bookingsResponse.ok || !storeResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const bookingsData = await bookingsResponse.json();
      const storeData = await storeResponse.json();
      const storeId = storeData.storeId;

      console.log("Fetched bookings data:", bookingsData);
      console.log("Fetched store data:", storeData);

      const ordersResponse = await fetch(
        `https://vesttour.xyz/api/Orders/store/${storeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!ordersResponse.ok) {
        throw new Error("Failed to fetch orders");
      }

      const ordersData = await ordersResponse.json();

      // Fetch details for each order
      const ordersWithDetails = await Promise.all(
        ordersData.map(async (order) => {
          const revenueData = await calculateStoreRevenue(order.orderId);

          return {
            ...order,
            calculatedRevenue: revenueData.storeRevenue,
            revenueShare: revenueData.suitTotal * 0.3,
            suitTotal: revenueData.suitTotal,
          };
        })
      );

      setOrders(ordersWithDetails);
      setBookings(Array.isArray(bookingsData.data) ? bookingsData.data : []);
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

    const filterByMonthAndYear = (date) => {
      const orderDate = new Date(date);
      const orderYear = orderDate.getFullYear();

      if (selectedMonth === "all") {
        return orderYear === selectedYear;
      }
      return (
        orderYear === selectedYear &&
        orderDate.getMonth() === parseInt(selectedMonth)
      );
    };

    // Process orders with year filter
    orders.forEach((order) => {
      if (
        order.shipStatus === "Finished" &&
        filterByMonthAndYear(order.orderDate)
      ) {
        const date = new Date(order.orderDate);
        const month = date.getMonth();
        monthlyRevenue[month] += order.calculatedRevenue || 0;
        monthlyProfit[month] += order.revenueShare || 0;
      }
    });

    // Process bookings for current year only
    if (bookings && bookings.length > 0) {
      bookings.forEach((booking) => {
        const bookingYear = booking.bookingDate.split("-")[0];
        if (
          parseInt(bookingYear) === selectedYear &&
          filterByMonthAndYear(booking.bookingDate)
        ) {
          const month = parseInt(booking.bookingDate.split("-")[1]) - 1;
          monthlyBookings[month] = (monthlyBookings[month] || 0) + 1;
        }
      });
    }

    // Calculate total bookings for current year only
    const totalBookings = bookings.filter((booking) => {
      const bookingYear = booking.bookingDate.split("-")[0];
      return parseInt(bookingYear) === selectedYear;
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

  // Calculate totals for selected year
  const calculateTotals = () => {
    return orders
      .filter((order) => {
        const orderYear = new Date(order.orderDate).getFullYear();
        return order.shipStatus === "Finished" && orderYear === selectedYear;
      })
      .reduce(
        (totals, order) => ({
          revenue: totals.revenue + (order.calculatedRevenue || 0),
          profit: totals.profit + (order.revenueShare || 0),
        }),
        { revenue: 0, profit: 0 }
      );
  };

  const totals = calculateTotals();
  const totalRevenue = totals.revenue;
  const totalProfit = totals.profit;
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
        label: "Revenue Share",
        data: monthlyData.profit,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const profitTrendData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: "Revenue Share Trend",
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
        suggestedMax: 10,
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
        return (
          <div className="chart-wrapper">
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

  // Remove hardcoded changes/values from StatCards
  const statCardsData = {
    topRow: [
      {
        title: "Total Revenue",
        value: `$${totalRevenue.toFixed(2)}`,
        subtext: `for ${selectedYear}`,
        icon: <DollarSignIcon />,
        className: "revenue",
      },
      {
        title: "Average Monthly Revenue",
        value: `$${(totalRevenue / 12).toFixed(2)}`,
        subtext: "per month",
        icon: <DollarSignIcon />,
        className: "revenue",
      },
      {
        title: "Peak Revenue Month",
        value:
          monthlyData.labels[
            monthlyData.revenue.indexOf(Math.max(...monthlyData.revenue))
          ],
        subtext: `$${Math.max(...monthlyData.revenue).toFixed(2)}`,
        icon: <TrendingUpIcon />,
        className: "revenue",
      },
    ],
    middleRow: [
      {
        title: "Revenue Share",
        value: `$${totalProfit.toFixed(2)}`,
        subtext: `for ${selectedYear}`,
        icon: <DollarSignIcon />,
        className: "profit",
      },
      {
        title: "Average Monthly Revenue Share",
        value: `$${(totalProfit / 12).toFixed(2)}`,
        subtext: "per month",
        icon: <DollarSignIcon />,
        className: "profit",
      },
      {
        title: "Peak Revenue Share Month",
        value:
          monthlyData.labels[
            monthlyData.profit.indexOf(Math.max(...monthlyData.profit))
          ],
        subtext: `$${Math.max(...monthlyData.profit).toFixed(2)}`,
        icon: <TrendingUpIcon />,
        className: "profit",
      },
    ],
  };

  const generatePDF = () => {
    const element = document.getElementById("profit-calculation-content");
    const opt = {
      margin: 1,
      filename: "venue-statistics.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="profit-calculation">
      <div className="title">Revenue and Profit Statistics</div>

      <div className="controls">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="year-filter"
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="month-filter"
        >
          <option value="all">All Months</option>
          {monthlyData.labels.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>

        <button onClick={generatePDF} className="print-button">
          Download PDF
        </button>
      </div>

      <div className="chart-navigation">
        <TabButton
          active={activeTab === "revenue"}
          onClick={() => setActiveTab("revenue")}
        >
          Revenue & Revenue Share
        </TabButton>
        <TabButton
          active={activeTab === "profit"}
          onClick={() => setActiveTab("profit")}
        >
          Revenue Share Trend
        </TabButton>
        <TabButton
          active={activeTab === "bookings"}
          onClick={() => setActiveTab("bookings")}
        >
          Bookings
        </TabButton>
      </div>

      <div id="profit-calculation-content">
        <div className="stat-cards">
          {statCardsData.topRow.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>

        <div className="chart-container">
          <h2>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Chart
          </h2>
          {loading ? (
            <p>Loading data...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <div className="chart-wrapper">{renderActiveChart()}</div>
          )}
        </div>

        <div className="stat-cards">
          {statCardsData.middleRow.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>
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
