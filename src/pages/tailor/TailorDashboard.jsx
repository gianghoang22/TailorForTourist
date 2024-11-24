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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./TailorDashboard.scss";

const statusColors = {
  "Not Start": "bg-yellow-200 text-yellow-800",
  Doing: "bg-blue-200 text-blue-800",
  Finish: "bg-green-200 text-green-800",
  Due: "bg-orange-200 text-orange-800",
  Cancel: "bg-red-200 text-red-800",
  Pending: "bg-gray-200 text-gray-800",
  Processing: "bg-purple-200 text-purple-800",
};

const TailorDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [error, setError] = useState(null);
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
        return null;
      }

      const { productId } = orderData.orderDetails[0];
      if (!productId) {
        console.log(`No productId found in order details for order ${orderId}`);
        return null;
      }

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
        return null;
      }

      // Fetch style name for each style option
      const styleOptionsWithNames = await Promise.all(
        productData.styleOptions.map(async (option) => {
          const styleName = await fetchStyleName(option.styleId);
          return { ...option, styleName };
        })
      );

      return {
        productId,
        productCode: productData.productCode,
        fabricName: productData.fabricName,
        liningName: productData.liningName,
        styleOptions: styleOptionsWithNames,
        orderInfo: {
          totalPrice: orderData.totalPrice,
          deposit: orderData.deposit,
          status: orderData.status,
          guestName: orderData.guestName,
          orderDate: orderData.orderDate,
        },
      };
    } catch (error) {
      console.error(
        `Error fetching order details for orderId ${orderId}:`,
        error
      );
      return null;
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
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Error fetching orders. Please try again later.");
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

        <div className="dashboard-content">
          <h3>Processing Orders</h3>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Stage Name</th>
                <th>Order Status</th>
                <th>Product Code</th>
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
                      <td>{order.stageName}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded-full ${statusColors[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>{details.productCode}</td>
                      <td>{order.note}</td>
                      <td>{order.dateSample}</td>
                      <td>{order.dateFix}</td>
                      <td>{order.dateDelivery}</td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(order)}
                        >
                          Edit
                        </button>
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
                          <div className="order-details">
                            <h4>Order Details</h4>
                            <p>Fabric Name: {details.fabricName || "N/A"}</p>
                            <p>Lining Name: {details.liningName || "N/A"}</p>
                            {details.styleOptions &&
                              details.styleOptions.map((option, index) => (
                                <div key={index}>
                                  <h5>Style Option {index + 1}</h5>
                                  <p>Style Name: {option.styleName || "N/A"}</p>
                                  <p>
                                    Option Type: {option.optionType || "N/A"}
                                  </p>
                                  <p>
                                    Option Value: {option.optionValue || "N/A"}
                                  </p>
                                </div>
                              ))}
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
      </main>
    </div>
  );
};

export default TailorDashboard;
