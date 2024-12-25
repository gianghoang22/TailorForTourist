import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const BASE_URL = "https://localhost:7194/api/Shipment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const ShipmentList = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        setShipments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, []);

  const updateShipmentStatus = async (shipment) => {
    const statusOrder = [
      "Packaging",
      "Preparing",
      "Shipping",
      "Ready",
      "Finished",
    ];
    
    const currentStatusIndex = statusOrder.indexOf(shipment.status);
    const nextStatus = statusOrder[currentStatusIndex + 1] || shipment.status;

    console.log("Current Status:", shipment.status);
    console.log("Next Status:", nextStatus);

    const updatedShipment = {
      status: nextStatus,
    };

    console.log("Sending JSON:", JSON.stringify(updatedShipment));

    try {
      const response = await fetch(`${BASE_URL}/${shipment.Id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedShipment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating shipment status:", errorData);
        return;
      }

      setShipments((prevShipments) =>
        prevShipments.map((s) =>
          s.shipmentId === shipment.shipmentId ? { ...shipment, status: nextStatus, shippedAt: nextStatus === "Finished" ? new Date().toISOString().split("T")[0] : shipment.shippedAt } : s
        )
      );
    } catch (err) {
      console.error("Error updating shipment status:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Shipment Management
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Track Number</StyledTableCell>
              <StyledTableCell>Recipient Name</StyledTableCell>
              <StyledTableCell>Recipient Address</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Create At</StyledTableCell>
              <StyledTableCell>Shipped At</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow key={shipment.shipmentId} hover>
                <TableCell>{shipment.trackNumber}</TableCell>
                <TableCell>{shipment.recipientName}</TableCell>
                <TableCell>{shipment.recipientAddress}</TableCell>
                <TableCell>{shipment.status}</TableCell>
                <TableCell>{shipment.createAt}</TableCell>
                <TableCell>{shipment.shippedAt}</TableCell>
                <TableCell>
                  <Tooltip title="Update Status">
                    <IconButton
                      onClick={() => updateShipmentStatus(shipment)}
                      sx={{ color: "primary.main" }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ShipmentList;
