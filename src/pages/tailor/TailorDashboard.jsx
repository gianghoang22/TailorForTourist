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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./TailorDashboard.scss";

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
  <div className="loading-spinner-overlay">
    <div className="loading-spinner">
      <div className="spinner"></div>
      <span className="loading-text">Loading...</span>
    </div>
  </div>
);

const TailorDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
          return {
            ...order,
            stageName: order.stageName || "Make Sample",
            stageStatus: order.stageStatus || "Doing",
            status: status || order.status,
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

      // If the order is in "Not Start" and in the "Make Sample" stage, update order status first
      if (
        order.status === "Not Start" &&
        order.stageName === STAGES.MAKE_SAMPLE
      ) {
        // Update order status to "Doing"
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
      // If the stage is "Make Sample" and order status is "Doing", move to "Fix"
      else if (
        order.stageName === STAGES.MAKE_SAMPLE &&
        order.status === "Doing"
      ) {
        // Update the stage status of "Make Sample" to "Finish"
        const makeSampleFinishResponse = await fetch(
          `https://localhost:7194/api/ProcessingTailor/sample/status/${order.processingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify("Finish"), // Stage status "Finish"
          }
        );

        if (!makeSampleFinishResponse.ok) {
          throw new Error(
            `Failed to update Make Sample stage status: ${makeSampleFinishResponse.status}`
          );
        }

        // Change stage name to "Fix"
        const stageUpdateResponse = await fetch(
          `https://localhost:7194/api/ProcessingTailor/stagename/${order.processingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(STAGES.FIX), // Update stage name to "Fix"
          }
        );

        if (!stageUpdateResponse.ok) {
          throw new Error(
            `Failed to update stage name to Fix: ${stageUpdateResponse.status}`
          );
        }

        // Set stage status for "Fix" to "Doing"
        const fixStatusResponse = await fetch(
          `https://localhost:7194/api/ProcessingTailor/fix/status/${order.processingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify("Doing"), // Stage status "Doing"
          }
        );

        if (!fixStatusResponse.ok) {
          throw new Error(
            `Failed to update Fix stage status: ${fixStatusResponse.status}`
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
            <h3>Processing Orders</h3>
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
                {orders.map((order) => {
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
          </div>
        )}
      </main>
    </div>
  );
};

export default TailorDashboard;
