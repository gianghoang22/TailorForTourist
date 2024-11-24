import React, { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  Home,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./TailorDashboard.scss";

const TailorDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    stageName: "Make Sample",
    tailorPartnerId: 1,
    status: "On going",
    stageStatus: "Doing",
    orderId: 0,
    note: "",
    dateSample: "",
    dateFix: "",
    dateDelivery: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("userID");
    localStorage.removeItem("roleID");
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://localhost:7194/api/ProcessingTailor"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const updatedOrders = (data.data || []).map((order) => ({
        ...order,
        stageName: order.stageName || "Make Sample",
        stageStatus: order.stageStatus || "Doing",
      }));
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Error fetching orders. Please try again later.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEdit = (order) => {
    setNewOrder(order);
    setEditIndex(order.processingId);
  };

  const handleUpdate = async (order) => {
    try {
      const token = localStorage.getItem("token");
      let statusEndpoint;
      let nextStageName;

      switch (order.stageName) {
        case "Make Sample":
          statusEndpoint = `https://localhost:7194/api/ProcessingTailor/sample/status/${order.processingId}`;
          nextStageName = "Fix";
          break;
        case "Fix":
          statusEndpoint = `https://localhost:7194/api/ProcessingTailor/fix/status/${order.processingId}`;
          nextStageName = "Delivery";
          break;
        case "Delivery":
          statusEndpoint = `https://localhost:7194/api/ProcessingTailor/delivery/status/${order.processingId}`;
          nextStageName = null;
          break;
        default:
          throw new Error("Invalid stage name");
      }

      // Update the current stage status to "Finish"
      const statusResponse = await fetch(statusEndpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify("Finish"),
      });

      if (!statusResponse.ok) {
        const errorData = await statusResponse.json();
        throw new Error(
          errorData.message ||
            `Failed to update stage status: ${statusResponse.status}`
        );
      }

      if (nextStageName) {
        // Move to the next stage
        const stageUpdateResponse = await fetch(
          `https://localhost:7194/api/ProcessingTailor/stagename/${order.processingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(nextStageName),
          }
        );

        if (!stageUpdateResponse.ok) {
          const errorData = await stageUpdateResponse.json();
          throw new Error(
            errorData.message ||
              `Failed to update stage name: ${stageUpdateResponse.status}`
          );
        }
      } else {
        // If there's no next stage (i.e., we're at Delivery), update the order status
        const orderStatusResponse = await fetch(
          `https://localhost:7194/api/ProcessingTailor/process/status/${order.processingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify("Finish"),
          }
        );

        if (!orderStatusResponse.ok) {
          const errorData = await orderStatusResponse.json();
          throw new Error(
            errorData.message ||
              `Failed to update order status: ${orderStatusResponse.status}`
          );
        }
      }

      // Refresh the order list
      await fetchOrders();
      setError(null);
    } catch (error) {
      console.error("Error updating order:", error);
      setError(error.message);
    }
  };

  const handleSaveChanges = async () => {
    if (
      !newOrder.note ||
      !newOrder.dateSample ||
      !newOrder.dateFix ||
      !newOrder.dateDelivery
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://localhost:7194/api/ProcessingTailor/${editIndex}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newOrder),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      await fetchOrders();
      resetForm();
    } catch (error) {
      console.error("Error updating order:", error);
      setError(error.message);
    }
  };

  const resetForm = () => {
    setNewOrder({
      stageName: "Make Sample",
      tailorPartnerId: 1,
      status: "On going",
      stageStatus: "Doing",
      orderId: 0,
      note: "",
      dateSample: "",
      dateFix: "",
      dateDelivery: "",
    });
    setEditIndex(null);
    setError(null);
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
          <h1>Good morning, James!</h1>
          <div className="header-actions">
            <button>
              <Calendar />
            </button>
            <button>
              <Bell />
            </button>
            <button className="avatar">
              <img src="/avatar.png" alt="James" />
            </button>
          </div>
        </header>

        {error && <div className="error">{error}</div>}

        <div className="dashboard-content">
          <h3>Processing Orders</h3>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Processing ID</th>
                <th>Stage Name</th>
                <th>Stage Status</th>
                <th>Tailor Partner ID</th>
                <th>Order Status</th>
                <th>Order ID</th>
                <th>Note</th>
                <th>Date Sample</th>
                <th>Date Fix</th>
                <th>Date Delivery</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.processingId}>
                  <td>{order.processingId}</td>
                  <td>{order.stageName}</td>
                  <td>{order.stageStatus}</td>
                  <td>{order.tailorPartnerId}</td>
                  <td>{order.status}</td>
                  <td>{order.orderId}</td>
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
                      disabled={
                        order.stageName === "Delivery" &&
                        order.stageStatus === "Finish"
                      }
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editIndex && (
            <div className="edit-form">
              <h3>Edit Order</h3>
              <input
                type="text"
                name="note"
                value={newOrder.note}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, note: e.target.value })
                }
                placeholder="Note"
              />
              <input
                type="date"
                name="dateSample"
                value={newOrder.dateSample}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, dateSample: e.target.value })
                }
              />
              <input
                type="date"
                name="dateFix"
                value={newOrder.dateFix}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, dateFix: e.target.value })
                }
              />
              <input
                type="date"
                name="dateDelivery"
                value={newOrder.dateDelivery}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, dateDelivery: e.target.value })
                }
              />
              <button onClick={handleSaveChanges}>Save Changes</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TailorDashboard;
