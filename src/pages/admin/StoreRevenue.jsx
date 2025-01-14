import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
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
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import html2pdf from "html2pdf.js";
import "./StoreRevenue.scss";
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

const StoreRevenue = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [activeTab, setActiveTab] = useState("revenue");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("all");

  // Fetch stores on component mount
  useEffect(() => {
    fetchStores();
  }, []);

  // Fetch orders when store selection changes
  useEffect(() => {
    if (selectedStore) {
      fetchStoreOrders(selectedStore);
    }
  }, [selectedStore]);

  const fetchStores = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://vesttour.xyz/api/Store", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch stores");
      const data = await response.json();
      // Filter stores with "Active" status and ensure it's an array
      const activeStores = Array.isArray(data)
        ? data.filter((store) => store.status === "Active")
        : [];
      setStores(activeStores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      setStores([]);
    }
  };

  const fetchStoreOrders = async (storeId) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://vesttour.xyz/api/Orders/store/${storeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch orders");
      const ordersData = await response.json();

      // Use the same revenue calculation logic as ProfitCalculation
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
    } catch (error) {
      console.error("Error fetching orders:", error);
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
    const monthlyRevenueShare = new Array(12).fill(0);
    const monthlyOrders = new Array(12).fill(0);

    orders.forEach((order) => {
      if (order.shipStatus === "Finished") {
        const date = new Date(order.orderDate);
        const orderYear = date.getFullYear();

        if (
          orderYear === selectedYear &&
          (selectedMonth === "all" ||
            date.getMonth() === parseInt(selectedMonth))
        ) {
          const month = date.getMonth();
          monthlyRevenue[month] += order.calculatedRevenue || 0;
          monthlyRevenueShare[month] += order.revenueShare || 0;
          monthlyOrders[month]++;
        }
      }
    });

    return {
      labels: months,
      revenue: monthlyRevenue,
      revenueShare: monthlyRevenueShare,
      orders: monthlyOrders,
    };
  };

  const monthlyData = processMonthlyData();

  // Chart configurations
  const revenueData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: "Total Revenue",
        data: monthlyData.revenue,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgba(53, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Revenue Share",
        data: monthlyData.revenueShare,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const ordersData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: "Orders",
        data: monthlyData.orders,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // Calculate statistics
  const calculateStats = () => {
    const finishedOrders = orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      const orderYear = orderDate.getFullYear();
      const orderMonth = orderDate.getMonth();

      return (
        order.shipStatus === "Finished" &&
        orderYear === selectedYear &&
        (selectedMonth === "all" || orderMonth === parseInt(selectedMonth))
      );
    });

    const totalRevenue = finishedOrders.reduce(
      (sum, order) => sum + (order.calculatedRevenue || 0),
      0
    );

    const totalRevenueShare = finishedOrders.reduce(
      (sum, order) => sum + (order.revenueShare || 0),
      0
    );

    const totalOrders = finishedOrders.length;

    return {
      totalRevenue,
      totalRevenueShare,
      totalOrders,
    };
  };

  const stats = calculateStats();

  const generatePDF = () => {
    const element = document.getElementById("store-revenue-content");
    const opt = {
      margin: 1,
      filename: `store-revenue-${selectedStore}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <StorefrontIcon /> Store Revenue Analysis
          </Typography>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={generatePDF}
            disabled={!selectedStore}
          >
            Export Report
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Store</InputLabel>
            <Select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              label="Select Store"
            >
              {stores.map((store) => (
                <MenuItem key={store.storeId} value={store.storeId}>
                  {store.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              label="Year"
            >
              <MenuItem value={2024}>2024</MenuItem>
              <MenuItem value={2025}>2025</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              label="Month"
            >
              <MenuItem value="all">All Months</MenuItem>
              {monthlyData.labels.map((month, index) => (
                <MenuItem key={month} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : selectedStore ? (
        <div id="store-revenue-content">
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <StatCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toFixed(2)}`}
              icon={<AttachMoneyIcon />}
              color="primary"
            />
            <StatCard
              title="Revenue Share"
              value={`$${stats.totalRevenueShare.toFixed(2)}`}
              icon={<AttachMoneyIcon />}
              color="success"
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<StorefrontIcon />}
              color="info"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Paper sx={{ p: 3, flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Revenue Trend
              </Typography>
              <Bar data={revenueData} options={chartOptions} />
            </Paper>
            <Paper sx={{ p: 3, flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Orders Trend
              </Typography>
              <Line data={ordersData} options={chartOptions} />
            </Paper>
          </Box>
        </div>
      ) : (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            Please select a store to view revenue statistics
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 2,
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
    }}
  >
    <Box sx={{ color: `${color}.main` }}>{icon}</Box>
    <Typography variant="h6">{value}</Typography>
    <Typography variant="body2" color="textSecondary">
      {title}
    </Typography>
  </Paper>
);

export default StoreRevenue;
