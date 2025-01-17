import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./ShipperManagement.scss";

const ShipperManagement = () => {
  const [shipperData, setShipperData] = useState([]);
  const [newShipper, setNewShipper] = useState({
    shipperPartnerName: "",
    phone: "",
    company: "",
    status: "Active",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchShipperData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to log in first!");
        setLoading(false);
        return;
      }

      const response = await fetch("https://vesttour.xyz/api/ShipperPartner", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setShipperData(data);
    } catch (error) {
      console.error("Error fetching shipper data:", error);
      setError("Error fetching shipper data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipperData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewShipper({ ...newShipper, [name]: value });
  };

  const validateFields = () => {
    return (
      newShipper.phone &&
      newShipper.company
    );
  };

  const handleAdd = async () => {
    if (!validateFields()) {
      setError("All fields must be filled.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to log in first!");
        return;
      }

      const response = await fetch("https://vesttour.xyz/api/ShipperPartner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newShipper),
      });

      if (!response.ok) throw new Error("Error adding new shipper");
      const addedShipper = await response.json();
      setShipperData((prevData) => [...prevData, addedShipper]);
      setError(null);
      setShowSuccessMessage(true);
      setNewShipper({ phone: "", company: "", status: "Active" });
      await fetchShipperData();
    } catch (error) {
      console.error("Error adding new shipper:", error);
      setError(error.message);
    }
  };

  const handleEdit = (shipper) => {
    setNewShipper(shipper);
    setEditIndex(shipper.id);
  };

  const handleUpdate = async () => {
    if (!validateFields()) {
      setError("All fields must be filled.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to log in first!");
        return;
      }

      const response = await fetch(`https://vesttour.xyz/api/ShipperPartner/${newShipper.shipperPartnerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newShipper),
      });

      if (!response.ok) throw new Error("Error updating shipper");
      setShipperData((prevData) => prevData.map((s) => (s.shipperPartnerId === newShipper.shipperPartnerId ? newShipper : s)));
      setError(null);
      setShowSuccessMessage(true);
      setNewShipper({ phone: "", company: "", status: "Active" });
      setEditIndex(null);
      await fetchShipperData();
    } catch (error) {
      console.error("Error updating shipper:", error);
      if (error.message.includes("401")) {
        setError("Unauthorized: Please log in again.");
      } else {
        setError(error.message);
      }
    }
  };

  const handleToggleStatus = async (shipper) => {
    console.log("Current shipper:", shipper);
    
    if (!shipper || !shipper.shipperPartnerId) {
        console.error("Shipper ID is undefined");
        setError("Shipper ID is required.");
        return;
    }

    const updatedStatus = shipper.status === "Active" ? "Deactive" : "Active";
    const updatedShipper = { 
      shipperPartnerId: shipper.shipperPartnerId,
      phone: shipper.phone,
      company: shipper.company,
      status: updatedStatus 
    };

    console.log("Payload to be sent:", updatedShipper);

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("You need to log in first!");
            return;
        }

        const response = await fetch(`https://vesttour.xyz/api/ShipperPartner/${shipper.shipperPartnerId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedShipper),
        });

        if (!response.ok) throw new Error("Error updating shipper status");
        setShipperData((prevData) =>
            prevData.map((s) => (s.shipperPartnerId === shipper.shipperPartnerId ? updatedShipper : s))
        );
        setError(null);
        setShowSuccessMessage(true);
    } catch (error) {
        console.error("Error updating shipper status:", error);
        setError(error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredShippers = shipperData;

  return (
    <div className="shipper-management">
      <h2>Shipper Partner</h2>
      {showSuccessMessage && (
        <Alert severity="success">Shipper status has been successfully updated!</Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="header">
            <div className="form">
              <TextField
                label="Phone"
                name="phone"
                value={newShipper.phone}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
              />
              <TextField
                label="Company"
                name="company"
                value={newShipper.company}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
              />
              <TextField
                label="Status"
                name="status"
                select
                value={newShipper.status}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Deactive">Deactive</MenuItem>
              </TextField>
              {editIndex !== null ? (
                <Button variant="contained" color="primary" onClick={handleUpdate}>
                  Update Shipper
                </Button>
              ) : (
                <Button variant="contained" color="secondary" onClick={handleAdd}>
                  Add Shipper Partner
                </Button>
              )}
            </div>
          </div>

          <TableContainer component={Paper}>
            <Table style={{ width: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell>Phone</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shipperData.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell>{s.company}</TableCell>
                    <TableCell>
                      <Chip
                        label={s.status}
                        color={s.status === "Active" ? "success" : "error"}
                        variant="outlined"
                        size="small"
                        sx={{
                          minWidth: "80px",
                          fontSize: "0.875rem",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(s)}
                        style={{ marginRight: "8px" }}
                      >
                        Edit
                      </Button>
                      <TextField
                        select
                        value={s.status}
                        size="small"
                        onChange={(e) => handleToggleStatus(s)}
                        variant="outlined"
                        style={{ width: "120px" }}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Deactive">Deactive</MenuItem>
                      </TextField>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default ShipperManagement;
