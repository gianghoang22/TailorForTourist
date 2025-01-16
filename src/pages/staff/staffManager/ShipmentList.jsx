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
  Box,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import TablePagination from "@mui/material/TablePagination";

const CustomStyledTableCell = styled(TableCell)(({ theme }) => ({
  color: 'white !important',
  fontWeight: 'bold',
  padding: '1rem',
  textAlign: 'left',
  backgroundColor: theme.palette.primary.main,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const BASE_URL = "https://vesttour.xyz/api";

const fetchStoreByStaffId = async (staffId) => {
  const response = await fetch(`${BASE_URL}/Store/GetStoreByStaff/${staffId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch store");
  }
  return response.json();
};

const fetchOrdersByStoreId = async (storeId) => {
  const response = await fetch(`${BASE_URL}/Orders/store/${storeId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
};

const ShipmentList = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 7;

  // Mảng trạng thái theo thứ tự
  const statusOrder = [
    "Confirming",
    "Tailoring",
    "Shipping",
    "Ready",
    "Finished",
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("userID");
        if (!userId) {
          throw new Error("User ID not found");
        }
        const storeData = await fetchStoreByStaffId(userId);
        const shipmentsData = await fetchOrdersByStoreId(storeData.storeId);
        setShipments(shipmentsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const sortedShipments = [...shipments].sort((a, b) => b.orderId - a.orderId);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedShipments = sortedShipments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const statusStyles = {
    Tailoring: { background: "#a5b4fc", color: "#1e1b4b" },    // Soft indigo
    Confirming: { background: "#fecdd3", color: "#881337" },   // Soft pink
    Shipping: { background: "#fef08a", color: "#854d0e" },     // Soft yellow
    Ready: { background: "#bfdbfe", color: "#14532d" },        // Soft green
    Finished: { background: "#86efac", color: "#1e3a8a" },     // Soft blue
  };

  const getStatusStyles = (status) => statusStyles[status] || { background: "white", color: "white" };

  // Hàm xác định trạng thái tiếp theo
  const getNextStatus = (currentStatus) => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    return currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] : currentStatus; // Trả về trạng thái tiếp theo
  };

  // Hàm cập nhật trạng thái đơn hàng
  const updateShipmentStatus = async (id, currentStatus) => {
    const newStatus = getNextStatus(currentStatus); // Lấy trạng thái tiếp theo
    console.log("Updating shipment status:", id, newStatus); // Ghi log thông tin

    try {
      const response = await fetch(`${BASE_URL}/Orders/update-ship-status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStatus),
      });

      console.log("Response status:", response.status);
      const responseData = await response.text();
      console.log("Response data:", responseData);

      if (!response.ok) {
        throw new Error(`Failed to update shipment status: ${responseData}`);
      }

      // Cập nhật trạng thái trong state
      setShipments((prevShipments) =>
        prevShipments.map((shipment) =>
          shipment.orderId === id ? { ...shipment, shipStatus: newStatus } : shipment
        )
      );
    } catch (error) {
      console.error("Error updating shipment status:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Shipment Management
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <CustomStyledTableCell>Order ID</CustomStyledTableCell>
              <CustomStyledTableCell>Guest Name</CustomStyledTableCell>
              <CustomStyledTableCell>Guest Email</CustomStyledTableCell>
              <CustomStyledTableCell>Guest Address</CustomStyledTableCell>
              <CustomStyledTableCell>Order Date</CustomStyledTableCell>
              <CustomStyledTableCell>Shipped Date</CustomStyledTableCell>
              <CustomStyledTableCell>Ship Status</CustomStyledTableCell>
              <CustomStyledTableCell>Delivery Method</CustomStyledTableCell>
              <CustomStyledTableCell>Total Price</CustomStyledTableCell>
              <CustomStyledTableCell>Actions</CustomStyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedShipments.map((shipment) => {
              const { background, color } = getStatusStyles(shipment.shipStatus);
              return (
                <TableRow key={shipment.orderId} hover>
                  <TableCell>{shipment.orderId}</TableCell>
                  <TableCell>{shipment.guestName}</TableCell>
                  <TableCell>{shipment.guestEmail}</TableCell>
                  <TableCell>{shipment.guestAddress}</TableCell>
                  <TableCell>{formatDate(shipment.orderDate)}</TableCell>
                  <TableCell>{formatDate(shipment.shippedDate)}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: background,
                        color: color,
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                      }}
                    >
                      {shipment.shipStatus}
                    </span>
                  </TableCell>
                  <TableCell>{shipment.deliveryMethod}</TableCell>
                  <TableCell>{shipment.totalPrice}</TableCell>
                  <TableCell>
                    <Tooltip title="Update Status">
                      <IconButton
                        onClick={() => updateShipmentStatus(shipment.orderId, shipment.shipStatus)}
                        sx={{ color: "primary.main" }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        {Array.from({ length: Math.ceil(shipments.length / rowsPerPage) }, (_, index) => (
          <Button
            key={index}
            onClick={() => setPage(index)}
            variant={page === index ? 'contained' : 'outlined'}
            sx={{ mx: 0.5 }}
          >
            {index + 1}
          </Button>
        ))}
      </Box>
    </div>
  );
};

export default ShipmentList;