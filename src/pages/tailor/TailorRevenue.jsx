import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import {
  DollarSign,
  Search,
  Calendar,
  TrendingUp,
  Download,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./TailorRevenue.scss";
import { useNavigate } from "react-router-dom";

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex justify-center items-center">
    <CircularProgress size={40} thickness={4} />
  </div>
);

const TailorRevenue = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    orders: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [sortConfig, setSortConfig] = useState({
    key: "orderDate",
    direction: "desc",
  });
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userID");
      const token = localStorage.getItem("token");

      if (!userId) {
        console.error("User ID is not found in localStorage.");
        alert("Please log in again.");
        navigate("/signin");
        return;
      }

      const storeResponse = await fetch(`https://vesttour.xyz/api/TailorPartner/get-by-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!storeResponse.ok) {
        throw new Error(`HTTP error! Status: ${storeResponse.status}`);
      }

      const storeData = await storeResponse.json();
      const storeId = storeData.data.storeId;

      console.log("Store ID:", storeId);

      const ordersResponse = await fetch(`https://vesttour.xyz/api/Orders/store/${storeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!ordersResponse.ok) {
        throw new Error(`HTTP error! Status: ${ordersResponse.status}`);
      }

      const data = await ordersResponse.json();
      
      const finishedOrders = data.filter(
        (order) => order.shipStatus === "Finished"
      );

      const totalRevenue = finishedOrders.reduce((sum, order) => {
        return sum + order.totalPrice * 0.7;
      }, 0);

      setRevenueData({
        totalRevenue,
        orders: finishedOrders,
      });
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const filterOrders = () => {
    return revenueData.orders
      .filter((order) => {
        const matchesSearch = order.orderId
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesDateRange =
          !startDate ||
          !endDate ||
          (new Date(order.orderDate) >= startDate &&
            new Date(order.orderDate) <= endDate);
        const matchesAmount =
          (!minAmount || order.totalPrice >= parseFloat(minAmount)) &&
          (!maxAmount || order.totalPrice <= parseFloat(maxAmount));

        return matchesSearch && matchesDateRange && matchesAmount;
      })
      .sort((a, b) => {
        if (sortConfig.key === "orderDate") {
          const dateA = new Date(a.orderDate).getTime();
          const dateB = new Date(b.orderDate).getTime();
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        }
        if (sortConfig.key === "orderId" || sortConfig.key === "totalPrice") {
          return sortConfig.direction === "asc"
            ? a[sortConfig.key] - b[sortConfig.key]
            : b[sortConfig.key] - a[sortConfig.key];
        }
        return 0;
      });
  };

  const exportToCSV = () => {
    const filteredOrders = filterOrders();
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Order ID,Order Date,Total Price,Revenue (70%)\n" +
      filteredOrders
        .map(
          (order) =>
            `${order.orderId},${new Date(
              order.orderDate
            ).toLocaleDateString()},${order.totalPrice.toFixed(2)},${(
              order.totalPrice * 0.7
            ).toFixed(2)}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "revenue_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateRange([null, null]);
    setMinAmount("");
    setMaxAmount("");
  };

  const filteredOrders = filterOrders();

  return (
    <div className="revenue-container">
      {/* Header Section */}
      <div className="revenue-header">
        <h1>Revenue Dashboard</h1>
        <button onClick={exportToCSV} className="export-btn">
          <Download size={20} />
          Export Report
        </button>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">${revenueData.totalRevenue.toFixed(2)}</p>
            <p className="stat-label">From all completed orders</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>Average Order Value</h3>
            <p className="stat-value">
              $
              {(
                revenueData.totalRevenue / revenueData.orders.length || 0
              ).toFixed(2)}
            </p>
            <p className="stat-label">Per completed order</p>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-value">{revenueData.orders.length}</p>
            <p className="stat-label">Completed orders</p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-panel">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="date-picker">
            <Calendar className="calendar-icon" size={20} />
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              placeholderText="Select date range"
            />
          </div>

          <div className="amount-range">
            <input
              type="number"
              placeholder="Min Amount"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
            <span className="separator">-</span>
            <input
              type="number"
              placeholder="Max Amount"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>

          <button onClick={clearFilters} className="clear-btn">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("orderId")}>
                <div className="table-header">
                  Order ID
                  {sortConfig.key === "orderId" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th onClick={() => handleSort("orderDate")}>
                <div className="table-header">
                  Order Date
                  {sortConfig.key === "orderDate" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th onClick={() => handleSort("totalPrice")}>
                <div className="table-header">
                  Total Price
                  {sortConfig.key === "totalPrice" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th>Revenue (70%)</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.orderId}>
                <td>#{order.orderId}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td className="revenue-cell">
                  ${(order.totalPrice * 0.7).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="empty-state">
            <p>No orders found matching your filters</p>
            <button onClick={clearFilters}>Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TailorRevenue;
