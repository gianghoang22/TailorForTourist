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
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [sortConfig, setSortConfig] = useState({
    key: "orderDate",
    direction: "desc",
  });
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [tailorPartnerId, setTailorPartnerId] = useState(null);
  const userID = localStorage.getItem("userID");

  const fetchTailorPartnerId = async () => {
    try {
      if (!userID) {
        throw new Error("User ID not found");
      }

      const response = await fetch(
        `https://vesttour.xyz/api/TailorPartner/get-by-user/${userID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.data?.tailorPartnerId) {
        setTailorPartnerId(data.data.tailorPartnerId);
        return data.data.tailorPartnerId;
      } else {
        throw new Error("Failed to get tailor partner ID");
      }
    } catch (error) {
      console.error("Error fetching tailor partner ID:", error);
      setError("Error fetching tailor partner details");
      return null;
    }
  };

  useEffect(() => {
    if (userID) {
      fetchTailorPartnerId().then((id) => {
        if (id) {
          fetchRevenueData(id);
        }
      });
    }
  }, [userID]);

  const fetchRevenueData = async (id) => {
    try {
      setIsLoading(true);

      const assignedOrdersResponse = await fetch(
        `https://vesttour.xyz/api/ProcessingTailor/assigned-to/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!assignedOrdersResponse.ok) {
        throw new Error(`HTTP error! Status: ${assignedOrdersResponse.status}`);
      }

      const assignedOrdersData = await assignedOrdersResponse.json();
      const assignedOrderIds = assignedOrdersData.data.map(
        (order) => order.orderId
      );

      // Then fetch full order details for these assigned orders
      const ordersWithDetails = await Promise.all(
        assignedOrderIds.map(async (orderId) => {
          const detailsResponse = await fetch(
            `https://vesttour.xyz/api/Orders/${orderId}/details`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );
          const details = await detailsResponse.json();

          // Calculate total price only for SUIT products
          const suitTotalPrice = details.orderDetails
            .filter((detail) => detail.productCode.startsWith("SUIT"))
            .reduce((sum, detail) => sum + detail.price, 0);

          return {
            ...details,
            suitTotalPrice,
          };
        })
      );

      const finishedOrders = ordersWithDetails.filter(
        (order) => order.shipStatus === "Finished"
      );

      const totalRevenue = finishedOrders.reduce((sum, order) => {
        return sum + order.suitTotalPrice * 0.7;
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
        const orderDate = new Date(order.orderDate);
        const orderYear = orderDate.getFullYear();
        const orderMonth = orderDate.getMonth();

        const matchesSearch = order.orderId
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const matchesDate =
          orderYear === selectedYear &&
          (selectedMonth === "all" || orderMonth === parseInt(selectedMonth));

        const matchesAmount =
          (!minAmount || order.suitTotalPrice >= parseFloat(minAmount)) &&
          (!maxAmount || order.suitTotalPrice <= parseFloat(maxAmount));

        return matchesSearch && matchesDate && matchesAmount;
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
            ).toLocaleDateString()},${order.suitTotalPrice.toFixed(2)},${(
              order.suitTotalPrice * 0.7
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
    setSelectedMonth("all");
    setSelectedYear(new Date().getFullYear());
    setMinAmount("");
    setMaxAmount("");
  };

  const calculateStats = () => {
    const filteredOrders = filterOrders();
    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + (order.suitTotalPrice || 0) * 0.7,
      0
    );
    const averageOrderValue =
      filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;

    return {
      totalRevenue,
      averageOrderValue,
      totalOrders: filteredOrders.length,
    };
  };

  const stats = calculateStats();

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
            <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
            <p className="stat-label">From filtered orders</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>Average Order Value</h3>
            <p className="stat-value">${stats.averageOrderValue.toFixed(2)}</p>
            <p className="stat-label">Per completed order</p>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
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
            {[
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
            ].map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>

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
            {filterOrders().map((order) => (
              <tr key={order.orderId}>
                <td>#{order.orderId}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>${(order.suitTotalPrice || 0).toFixed(2)}</td>
                <td className="revenue-cell">
                  ${((order.suitTotalPrice || 0) * 0.7).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filterOrders().length === 0 && (
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
