import React, { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  Home,
  LayoutDashboard,
  LogOut,
  Users,
  ChevronDown,
  ChevronUp,
  Scissors,
  Package,
  Ruler,
  Search,
  Filter,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./TailorDashboard.scss";
import { CircularProgress } from "@mui/material";

const statusColors = {
  "Not Start": "bg-yellow-300 text-yellow-800",
  Doing: "bg-green-300 text-green-800",
  Finish: "bg-green-300 text-green-800",
  Due: "bg-orange-300 text-orange-800",
  Cancel: "bg-red-300 text-red-800",
  Pending: "bg-gray-300 text-gray-800",
  Processing: "bg-purple-300 text-purple-800",
};

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex justify-center items-center">
    <CircularProgress size={40} thickness={4} />
  </div>
);

const TailorDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const STAGES = {
    MAKE_SAMPLE: "Make Sample",
    FIX: "Fix",
    DELIVERY: "Delivery",
  };

  const STAGE_ORDER = [STAGES.MAKE_SAMPLE, STAGES.FIX, STAGES.DELIVERY];

  const getNextStage = (currentStage) => {
    const currentIndex = STAGE_ORDER.indexOf(currentStage);
    return currentIndex < STAGE_ORDER.length - 1
      ? STAGE_ORDER[currentIndex + 1]
      : null;
  };

  const isDateOverdue = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
    return date < today;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userID");
    localStorage.removeItem("roleID");
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const fetchStyleName = async (styleId) => {
    try {
      const response = await fetch(
        `https://localhost:7194/api/Style/${styleId}`,
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
      return data.styleName;
    } catch (error) {
      console.error(`Error fetching style name for styleId ${styleId}:`, error);
      return null;
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      console.log(`Fetching order details for orderId: ${orderId}`);
      // Step 1: Fetch order details to get productId
      const orderResponse = await fetch(
        `https://localhost:7194/api/Orders/${orderId}/details`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!orderResponse.ok) {
        throw new Error(`HTTP error! Status: ${orderResponse.status}`);
      }

      const orderData = await orderResponse.json();

      if (!orderData.orderDetails || orderData.orderDetails.length === 0) {
        console.log(`No order details found for order ${orderId}`);
        return { error: `No order details found for order ${orderId}` };
      }

      const { productId } = orderData.orderDetails[0];
      if (!productId) {
        console.log(`No productId found in order details for order ${orderId}`);
        return { error: `No productId found for order ${orderId}` };
      }

      console.log(`Order details fetched. ProductId: ${productId}`);

      // Step 2: Fetch product details to get measurementId
      const productResponse = await fetch(
        `https://localhost:7194/api/Product/details/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!productResponse.ok) {
        throw new Error(`HTTP error! Status: ${productResponse.status}`);
      }

      const productData = await productResponse.json();
      if (!productData || !productData.productID) {
        console.log(`No product data found for productId ${productId}`);
        return { error: `No product data found for productId ${productId}` };
      }

      console.log(
        `Product details fetched. MeasurementId: ${productData.measurementID}`
      );

      // Fetch style name for each style option
      const styleOptionsWithNames = await Promise.all(
        productData.styleOptions.map(async (option) => {
          try {
            const styleName = await fetchStyleName(option.styleId);
            return { ...option, styleName };
          } catch (error) {
            console.error(
              `Error fetching style name for styleId ${option.styleId}:`,
              error
            );
            return { ...option, styleName: "N/A" };
          }
        })
      );

      // Step 3: Fetch measurement data
      let measurementData = null;
      let measurementError = null;
      if (productData.measurementID) {
        try {
          console.log(
            `Fetching measurement data for measurementId: ${productData.measurementID}`
          );
          const measurementResponse = await fetch(
            `https://localhost:7194/api/Measurement/${productData.measurementID}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (measurementResponse.ok) {
            measurementData = await measurementResponse.json();
            console.log(
              "Measurement data fetched successfully:",
              measurementData
            );
          } else {
            measurementError = `Error fetching measurement data: ${measurementResponse.status}`;
            console.error(measurementError);
          }
        } catch (error) {
          measurementError = `Error fetching measurement data: ${error.message}`;
          console.error(measurementError);
        }
      } else {
        measurementError = "No measurementId found in product data";
        console.log(measurementError);
      }

      return {
        productId,
        fabricName: productData.fabricName,
        liningName: productData.liningName,
        styleOptions: styleOptionsWithNames,
        orderInfo: {
          status: orderData.status,
          guestName: orderData.guestName,
          orderDate: orderData.orderDate,
        },
        measurement: measurementData,
        measurementError: measurementError,
      };
    } catch (error) {
      console.error(
        `Error in fetchOrderDetails for orderId ${orderId}:`,
        error
      );
      return {
        error: `Error fetching details for order ${orderId}: ${error.message}`,
      };
    }
  };

  const fetchProcessingStatus = async (processingId) => {
    try {
      const response = await fetch(
        `https://localhost:7194/api/ProcessingTailor/${processingId}`,
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
      return data.status;
    } catch (error) {
      console.error(
        `Error fetching processing status for processingId ${processingId}:`,
        error
      );
      return null;
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://localhost:7194/api/ProcessingTailor",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const updatedOrders = await Promise.all(
        (data.data || []).map(async (order) => {
          const status = await fetchProcessingStatus(order.processingId);

          // Check for overdue dates based on current stage
          let isDue = false;
          if (status !== "Finish") {
            switch (order.stageName) {
              case STAGES.MAKE_SAMPLE:
                isDue = isDateOverdue(order.dateSample);
                break;
              case STAGES.FIX:
                isDue = isDateOverdue(order.dateFix);
                break;
              case STAGES.DELIVERY:
                isDue = isDateOverdue(order.dateDelivery);
                break;
            }

            // If order is overdue, update the status to "Due" in the backend
            if (isDue && status !== "Due") {
              try {
                const dueUpdateResponse = await fetch(
                  `https://localhost:7194/api/ProcessingTailor/process/status/${order.processingId}`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify("Due"),
                  }
                );

                if (!dueUpdateResponse.ok) {
                  console.error("Failed to update status to Due");
                }
              } catch (error) {
                console.error("Error updating due status:", error);
              }
            }
          }

          return {
            ...order,
            stageName: order.stageName || "Make Sample",
            stageStatus: order.stageStatus || "Doing",
            status: isDue ? "Due" : status || order.status,
          };
        })
      );

      setOrders(updatedOrders);

      // Fetch details for each order
      const detailsPromises = updatedOrders.map(async (order) => {
        try {
          const details = await fetchOrderDetails(order.orderId);
          return [order.orderId, details];
        } catch (error) {
          console.log(
            `Failed to fetch details for order ${order.orderId}:`,
            error
          );
          return [order.orderId, null];
        }
      });

      const detailsResults = await Promise.all(detailsPromises);
      const detailsMap = Object.fromEntries(
        detailsResults.filter(([, details]) => details != null)
      );
      setOrderDetails(detailsMap);
      console.log("Order details:", detailsMap);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Error fetching orders. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (order) => {
    // Implement edit functionality
    console.log("Edit order:", order);
  };

  const handleUpdate = async (order) => {
    try {
      const token = localStorage.getItem("token");
      const skipFixStage = !order.dateFix; // Check if dateFix is missing

      // Initial "Not Start" to "Doing" transition remains the same
      if (
        order.status === "Not Start" &&
        order.stageName === STAGES.MAKE_SAMPLE
      ) {
        // Update order and stage status to "Doing"
        const processingResponse = await fetch(
          `https://localhost:7194/api/ProcessingTailor/process/status/${order.processingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify("Doing"), // Send status "Doing"
          }
        );

        if (!processingResponse.ok) {
          throw new Error(
            `Failed to update processing status: ${processingResponse.status}`
          );
        }

        // Update stage status to "Doing" for "Make Sample"
        const stageStatusResponse = await fetch(
          `https://localhost:7194/api/ProcessingTailor/sample/status/${order.processingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify("Doing"), // Set stage status to "Doing"
          }
        );

        if (!stageStatusResponse.ok) {
          throw new Error(
            `Failed to update stage status: ${stageStatusResponse.status}`
          );
        }
      }
      // Modified logic for Make Sample to next stage transition
      else if (
        order.stageName === STAGES.MAKE_SAMPLE &&
        order.status === "Doing"
      ) {
        // Update Make Sample stage to "Finish"
        const makeSampleFinishResponse = await fetch(
          `https://localhost:7194/api/ProcessingTailor/sample/status/${order.processingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify("Finish"),
          }
        );

        if (!makeSampleFinishResponse.ok) {
          throw new Error(
            `Failed to update Make Sample stage status: ${makeSampleFinishResponse.status}`
          );
        }

        // Change stage name to "Delivery" if skipFixStage is true, otherwise go to "Fix"
        const nextStage = skipFixStage ? STAGES.DELIVERY : STAGES.FIX;
        const stageUpdateResponse = await fetch(
          `https://localhost:7194/api/ProcessingTailor/stagename/${order.processingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(nextStage),
          }
        );

        if (!stageUpdateResponse.ok) {
          throw new Error(
            `Failed to update stage name to ${nextStage}: ${stageUpdateResponse.status}`
          );
        }

        // Set stage status for next stage to "Doing"
        const statusEndpoint = skipFixStage ? "delivery" : "fix";
        const nextStageResponse = await fetch(
          `https://localhost:7194/api/ProcessingTailor/${statusEndpoint}/status/${order.processingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify("Doing"),
          }
        );

        if (!nextStageResponse.ok) {
          throw new Error(
            `Failed to update ${nextStage} stage status: ${nextStageResponse.status}`
          );
        }
      }
      // If the stage is "Fix" and order status is "Doing", move to "Delivery"
      else if (order.stageName === STAGES.FIX && order.status === "Doing") {
        // Update the stage status of "Fix" to "Finish"
        const fixFinishResponse = await fetch(
          `https://localhost:7194/api/ProcessingTailor/fix/status/${order.processingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify("Finish"), // Stage status "Finish"
          }
        );

        if (!fixFinishResponse.ok) {
          throw new Error(
            `Failed to update Fix stage status: ${fixFinishResponse.status}`
          );
        }

        // Change stage name to "Delivery"
        const stageUpdateResponse = await fetch(
          `https://localhost:7194/api/ProcessingTailor/stagename/${order.processingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(STAGES.DELIVERY), // Update stage name to "Delivery"
          }
        );

        if (!stageUpdateResponse.ok) {
          throw new Error(
            `Failed to update stage name to Delivery: ${stageUpdateResponse.status}`
          );
        }

        // Set stage status for "Delivery" to "Doing"
        const deliveryStatusResponse = await fetch(
          `https://localhost:7194/api/ProcessingTailor/delivery/status/${order.processingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify("Doing"), // Stage status "Doing"
          }
        );

        if (!deliveryStatusResponse.ok) {
          throw new Error(
            `Failed to update Delivery stage status: ${deliveryStatusResponse.status}`
          );
        }
      }
      // Final Update when Delivery is finished, change Stage Status and Order Status to "Finish"
      else if (
        order.stageName === STAGES.DELIVERY &&
        order.status === "Doing"
      ) {
        // Update the stage status of "Delivery" to "Finish"
        const deliveryFinishResponse = await fetch(
          `https://localhost:7194/api/ProcessingTailor/delivery/status/${order.processingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify("Finish"), // Stage status "Finish"
          }
        );

        if (!deliveryFinishResponse.ok) {
          throw new Error(
            `Failed to update Delivery stage status: ${deliveryFinishResponse.status}`
          );
        }

        // Update order status to "Finish"
        const orderFinishResponse = await fetch(
          `https://localhost:7194/api/ProcessingTailor/process/status/${order.processingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify("Finish"), // Order status "Finish"
          }
        );

        if (!orderFinishResponse.ok) {
          throw new Error(
            `Failed to update order status to Finish: ${orderFinishResponse.status}`
          );
        }
      }

      // After making the necessary updates, fetch the updated orders list
      await fetchOrders();
      setError(null);
    } catch (error) {
      console.error("Error updating order:", error);
      setError(error.message);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getFilteredOrders = () => {
    return orders.filter((order) => {
      const statusMatch =
        statusFilter === "all" || order.status === statusFilter;
      const searchMatch = order.orderId.toString().includes(searchOrderId);
      const stageMatch =
        stageFilter === "all" || order.stageName === stageFilter;

      return statusMatch && searchMatch && stageMatch;
    });
  };

  const filteredOrders = getFilteredOrders();
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          <img src="/dappr-logo.png" alt="Dappr Logo" />
        </div>
        <nav>
          <button>
            <Home />
          </button>
          <button>
            <LayoutDashboard />
          </button>
          <button>
            <Users />
          </button>
          <button>
            <Calendar />
          </button>
        </nav>
        <div className="bottom-buttons">
          <button onClick={handleLogout}>
            <LogOut />
          </button>
        </div>
      </aside>

      <main>
        <header>
          <h1>WELCOME, Tailor !</h1>
          <div className="header-actions">
            <button>
              <Calendar />
            </button>
            <button>
              <Bell />
            </button>
            <button className="avatar">
              <img src="/avatar.png" alt="Tailor" />
            </button>
          </div>
        </header>

        {error && <div className="error">{error}</div>}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="dashboard-content">
            <div className="filters-section">
              <div className="filters-header">
                <h3>Processing Orders</h3>
                <div className="filters-summary">
                  <span>{filteredOrders.length} orders found</span>
                  {(statusFilter !== "all" ||
                    stageFilter !== "all" ||
                    searchOrderId) && (
                    <button
                      className="clear-filters"
                      onClick={() => {
                        setStatusFilter("all");
                        setStageFilter("all");
                        setSearchOrderId("");
                        setCurrentPage(1);
                      }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              <div className="filters-container">
                <div className="search-box">
                  <Search className="search-icon" size={20} />
                  <input
                    type="text"
                    placeholder="Search by Order ID..."
                    value={searchOrderId}
                    onChange={(e) => {
                      setSearchOrderId(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  {searchOrderId && (
                    <button
                      className="clear-search"
                      onClick={() => {
                        setSearchOrderId("");
                        setCurrentPage(1);
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="filter-group">
                  <div className="filter-label">
                    <Filter size={18} />
                    <span>Filters:</span>
                  </div>

                  <div className="select-wrapper">
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="all">All Status</option>
                      <option value="Not Start">Not Start</option>
                      <option value="Doing">Doing</option>
                      <option value="Finish">Finish</option>
                      <option value="Due">Due</option>
                      <option value="Cancel">Cancel</option>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                    </select>
                    <ChevronDown size={16} className="select-icon" />
                  </div>

                  <div className="select-wrapper">
                    <select
                      value={stageFilter}
                      onChange={(e) => {
                        setStageFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="all">All Stages</option>
                      <option value="Make Sample">Make Sample</option>
                      <option value="Fix">Fix</option>
                      <option value="Delivery">Delivery</option>
                    </select>
                    <ChevronDown size={16} className="select-icon" />
                  </div>
                </div>
              </div>

              {(statusFilter !== "all" || stageFilter !== "all") && (
                <div className="active-filters">
                  <span className="active-filters-label">Active Filters:</span>
                  {statusFilter !== "all" && (
                    <div className="filter-tag">
                      Status: {statusFilter}
                      <button onClick={() => setStatusFilter("all")}>
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {stageFilter !== "all" && (
                    <div className="filter-tag">
                      Stage: {stageFilter}
                      <button onClick={() => setStageFilter("all")}>
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Stage Name</th>
                  <th>Order Status</th>
                  <th>Note</th>
                  <th>Date Sample</th>
                  <th>Date Fix</th>
                  <th>Date Delivery</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => {
                  const details = orderDetails[order.orderId] || {};
                  return (
                    <React.Fragment key={order.processingId}>
                      <tr>
                        <td>{order.orderId}</td>
                        <td>{order.stageName}</td>
                        <td>
                          <span
                            className={`status-label ${order.status.toLowerCase().replace(" ", "-")}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>{order.note}</td>
                        <td>{order.dateSample}</td>
                        <td>{order.dateFix}</td>
                        <td>{order.dateDelivery}</td>
                        <td>
                          <button
                            onClick={() => handleUpdate(order)}
                            disabled={order.status === "Finish"}
                          >
                            Update Status
                          </button>
                          <button
                            onClick={() => toggleOrderDetails(order.orderId)}
                          >
                            {expandedOrder === order.orderId ? (
                              <ChevronUp />
                            ) : (
                              <ChevronDown />
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedOrder === order.orderId && (
                        <tr>
                          <td colSpan="8">
                            <div className="order-details bg-white shadow-lg rounded-lg p-6 mt-4">
                              <div className="grid grid-cols-2 gap-8">
                                <div className="order-info">
                                  <h4 className="text-xl font-semibold mb-4 flex items-center">
                                    <Package className="mr-2" /> Order Details
                                  </h4>
                                  <div className="bg-gray-100 p-4 rounded-md">
                                    <p className="mb-2">
                                      <span className="font-semibold">
                                        Order ID:
                                      </span>{" "}
                                      {order.orderId}
                                    </p>
                                    <p className="mb-2">
                                      <span className="font-semibold">
                                        Guest Name:
                                      </span>{" "}
                                      {details.orderInfo?.guestName || "N/A"}
                                    </p>
                                    <p className="mb-2">
                                      <span className="font-semibold">
                                        Order Date:
                                      </span>{" "}
                                      {details.orderInfo?.orderDate || "N/A"}
                                    </p>
                                  </div>
                                  <h5 className="text-lg font-semibold mt-4 mb-2 flex items-center">
                                    <Scissors className="mr-2" /> Product
                                    Details
                                  </h5>
                                  <div className="bg-gray-100 p-4 rounded-md">
                                    <p className="mb-2">
                                      <span className="font-semibold">
                                        Fabric:
                                      </span>{" "}
                                      {details.fabricName || "N/A"}
                                    </p>
                                    <p className="mb-2">
                                      <span className="font-semibold">
                                        Lining:
                                      </span>{" "}
                                      {details.liningName || "N/A"}
                                    </p>
                                  </div>
                                  <h6 className="text-md font-semibold mt-4 mb-2">
                                    Style Options
                                  </h6>
                                  <div className="bg-gray-100 p-4 rounded-md">
                                    {details.styleOptions &&
                                      details.styleOptions.map(
                                        (option, index) => (
                                          <div key={index} className="mb-2">
                                            <p>
                                              <span className="font-semibold">
                                                Style:
                                              </span>{" "}
                                              {option.styleName || "N/A"}
                                            </p>
                                            <p>
                                              <span className="font-semibold">
                                                Type:
                                              </span>{" "}
                                              {option.optionType || "N/A"}
                                            </p>
                                            <p>
                                              <span className="font-semibold">
                                                Value:
                                              </span>{" "}
                                              {option.optionValue || "N/A"}
                                            </p>
                                          </div>
                                        )
                                      )}
                                  </div>
                                </div>
                                <div className="measurements">
                                  <h4 className="text-xl font-semibold mb-4 flex items-center">
                                    <Ruler className="mr-2" /> Measurements
                                  </h4>
                                  {details.measurementError ? (
                                    <p className="text-red-500 bg-red-100 p-4 rounded-md">
                                      {details.measurementError}
                                    </p>
                                  ) : details.measurement ? (
                                    <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-md">
                                      {Object.entries(details.measurement).map(
                                        ([key, value]) => (
                                          <p key={key} className="capitalize">
                                            <span className="font-semibold">
                                              {key}:
                                            </span>{" "}
                                            {value || "N/A"}
                                          </p>
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    <p className="bg-yellow-100 p-4 rounded-md text-yellow-700">
                                      No measurement data available.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            <div className="pagination">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>

              <div className="pagination-numbers">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`pagination-number ${currentPage === index + 1 ? "active" : ""}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TailorDashboard;
