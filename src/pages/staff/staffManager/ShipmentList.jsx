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

const BASE_URL = "https://localhost:7194/api";

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

const fetchAllShipments = async () => {
  const response = await fetch(`${BASE_URL}/ShipperPartner`);
  if (!response.ok) throw new Error("Failed to fetch shipments");
  return response.json();
};

const createShipment = async (shipmentData) => {
  const response = await fetch(`${BASE_URL}/ShipperPartner`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(shipmentData),
  });
  if (!response.ok) throw new Error("Failed to create shipment");
  return response.json();
};

const updateShipment = async (id, shipmentData) => {
  const response = await fetch(`${BASE_URL}/ShipperPartner/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(shipmentData),
  });
  if (!response.ok) throw new Error("Failed to update shipment");
  return response.json();
};

const deleteShipment = async (id) => {
  const response = await fetch(`${BASE_URL}/ShipperPartner/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete shipment");
  return response.json();
};

const ShipmentList = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({
    shipperPartnerId: "",
    shipperPartnerName: "",
    phone: "",
    company: "",
    status: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const data = await fetchAllShipments();
        setShipments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteShipment(id);
      setShipments((prevShipments) =>
        prevShipments.filter((shipment) => shipment.shipperPartnerId !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isEditMode) {
        await updateShipment(formState.shipperPartnerId, formState);
      } else {
        await createShipment(formState);
      }
      setOpen(false);
      setFormState({
        shipperPartnerId: "",
        shipperPartnerName: "",
        phone: "",
        company: "",
        status: "",
      });
      const data = await fetchAllShipments();
      setShipments(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (shipment) => {
    setFormState(shipment);
    setIsEditMode(true);
    setOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Shipment Management
      </Typography>

      <StyledButton
        variant="contained"
        startIcon={<Add />}
        onClick={() => {
          setOpen(true);
          setIsEditMode(false);
        }}
        sx={{ mb: 2 }}
      >
        Add Shipment
      </StyledButton>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Shipper ID</StyledTableCell>
              <StyledTableCell>Shipper Name</StyledTableCell>
              <StyledTableCell>Phone</StyledTableCell>
              <StyledTableCell>Company</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow key={shipment.shipperPartnerId} hover>
                <TableCell>{shipment.shipperPartnerId}</TableCell>
                <TableCell>{shipment.shipperPartnerName}</TableCell>
                <TableCell>{shipment.phone}</TableCell>
                <TableCell>{shipment.company}</TableCell>
                <TableCell>{shipment.status}</TableCell>
                <TableCell>
                  <Tooltip title="Edit Shipment">
                    <IconButton
                      onClick={() => handleEdit(shipment)}
                      sx={{ color: "primary.main" }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Shipment">
                    <IconButton
                      onClick={() => handleDelete(shipment.shipperPartnerId)}
                      sx={{ color: "secondary.main" }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Add/Edit Shipment Form */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {isEditMode ? "Edit Shipment" : "Add Shipment"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please fill out the form below to {isEditMode ? "edit" : "add"} a
            shipment.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Shipper ID"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.shipperPartnerId}
            onChange={(e) =>
              setFormState({ ...formState, shipperPartnerId: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Shipper's Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.shipperPartnerName}
            onChange={(e) =>
              setFormState({ ...formState, shipperPartnerName: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Phone"
            type="number"
            fullWidth
            variant="outlined"
            value={formState.phone}
            onChange={(e) =>
              setFormState({ ...formState, phone: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Company"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.company}
            onChange={(e) =>
              setFormState({ ...formState, company: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Status"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.status}
            onChange={(e) =>
              setFormState({ ...formState, status: e.target.value })
            }
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            color="primary"
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShipmentList;
