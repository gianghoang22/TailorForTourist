import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
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
  Fade,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import "./VoucherManagement.scss";

const VoucherManagement = () => {
  const [voucherData, setVoucherData] = useState([]);
  const [newVoucher, setNewVoucher] = useState({
    voucherId: null,
    status: "Pending",
    voucherCode: "",
    description: "",
    discountNumber: 0,
    dateStart: "",
    dateEnd: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVoucherData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://vesttour.xyz/api/Voucher");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setVoucherData(data);
      } catch (error) {
        console.error("Error fetching voucher data:", error);
        setError("Error fetching voucher data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVoucherData();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const currentDate = new Date();
      const updatedVouchers = await Promise.all(
        voucherData.map(async (voucher) => {
          const startDate = new Date(voucher.dateStart);
          const endDate = new Date(voucher.dateEnd);
          let newStatus = voucher.status;

          if (currentDate < startDate) {
            newStatus = "Pending";
          } else if (currentDate >= startDate && currentDate <= endDate) {
            newStatus = "OnGoing";
          } else if (currentDate > endDate) {
            newStatus = "Expired";
          }

          if (newStatus !== voucher.status) {
            const updatedVoucher = { ...voucher, status: newStatus };
            try {
              const response = await fetch(
                `https://vesttour.xyz/api/Voucher/${voucher.voucherId}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(updatedVoucher),
                }
              );
              if (!response.ok) {
                throw new Error("Failed to update voucher status");
              }
              return updatedVoucher;
            } catch (error) {
              console.error("Error updating voucher status:", error);
              return voucher;
            }
          }
          return voucher;
        })
      );
      setVoucherData(updatedVouchers);
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [voucherData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVoucher({ ...newVoucher, [name]: value });
  };

  const validateForm = () => {
    const { voucherCode, description, discountNumber, dateStart, dateEnd } =
      newVoucher;

    if (
      !voucherCode ||
      !description ||
      !discountNumber ||
      !dateStart ||
      !dateEnd
    ) {
      setError(
        "All fields must be filled in. Please complete all fields before proceeding."
      );
      return false;
    }

    return true;
  };

  const isDuplicateVoucherCode = (code) => {
    return voucherData.some((voucher) => voucher.voucherCode === code);
  };

  const isValidDateStart = (date) => {
    const selectedDate = new Date(date);
    const currentDate = new Date(today);
    return selectedDate >= currentDate;
  };

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!isValidDateStart(newVoucher.dateStart)) {
      setError(
        "Start date cannot be in the past. Please select today or a future date."
      );
      return;
    }

    if (isDuplicateVoucherCode(newVoucher.voucherCode)) {
      setError("Voucher code already exists. Please use a unique code.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("https://vesttour.xyz/api/Voucher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVoucher),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error adding new voucher");
      }

      // Fetch updated data after successful addition
      const fetchResponse = await fetch("https://vesttour.xyz/api/Voucher");
      if (!fetchResponse.ok) {
        throw new Error("Failed to refresh voucher data");
      }
      const updatedData = await fetchResponse.json();
      setVoucherData(updatedData);

      setShowSuccessMessage(true);

      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000);

      // Reset form
      setNewVoucher({
        voucherId: null,
        status: "Pending",
        voucherCode: "",
        description: "",
        discountNumber: 0,
        dateStart: "",
        dateEnd: "",
      });

      setError(null);
    } catch (error) {
      console.error("Error adding new voucher:", error);
      setError(error.message || "Failed to add voucher");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (voucher) => {
    setNewVoucher(voucher);
    setEditIndex(voucher.voucherId);
  };

  const validateVoucherCode = (code) => {
    const bigSalePattern = /^BIGSALE\d{2}$/;
    const freeShipPattern = /^FREESHIP\d{2}$/;
    return bigSalePattern.test(code) || freeShipPattern.test(code);
  };

  const handleUpdate = async () => {
    try {
      if (!validateForm()) return;

      if (!validateVoucherCode(newVoucher.voucherCode)) {
        setError(
          "Voucher code must be in the format 'BIGSALExx' or 'FREESHIPxx', where 'xx' is two digits."
        );
        return;
      }

      if (
        voucherData.some(
          (voucher) =>
            voucher.voucherCode === newVoucher.voucherCode &&
            voucher.voucherId !== editIndex
        )
      ) {
        setError("Voucher code already exists. Please use a unique code.");
        return;
      }

      if (!isValidDateStart(newVoucher.dateStart)) {
        setError(
          "Start date cannot be in the past. Please select today or a future date."
        );
        return;
      }

      const response = await fetch(
        `https://vesttour.xyz/api/Voucher/${editIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newVoucher),
        }
      );

      // Check specifically for 204 No Content response
      if (response.status === 204) {
        // Update the local state directly
        setVoucherData(
          voucherData.map((v) =>
            v.voucherId === editIndex ? { ...v, ...newVoucher } : v
          )
        );

        setShowSuccessMessage(true);

        // Hide success message after 2 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 2000);

        // Reset form and state
        setNewVoucher({
          voucherId: null,
          status: "Pending",
          voucherCode: "",
          description: "",
          discountNumber: 0,
          dateStart: "",
          dateEnd: "",
        });
        setEditIndex(null);
        setError(null);
        return;
      }

      // Handle error cases
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Error updating voucher: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error updating voucher:", error);
      setError(error.message || "Failed to update voucher");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVouchers = voucherData.filter((v) =>
    v.voucherCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "OnGoing":
        return "green";
      case "Expired":
        return "red";
      default:
        return "inherit";
    }
  };

  const handleCancel = () => {
    setEditIndex(null);
    setNewVoucher({
      voucherId: null,
      status: "Pending",
      voucherCode: "",
      description: "",
      discountNumber: 0,
      dateStart: "",
      dateEnd: "",
    });
  };

  return (
    <div className="voucher-management">
      <h2>Voucher Management</h2>
      {error && <Alert severity="error">{error}</Alert>}
      {showSuccessMessage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: "20px",
            zIndex: 9999,
          }}
        >
          <Alert
            severity="success"
            style={{
              padding: "1rem 2rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              width: "auto",
              minWidth: "300px",
              fontSize: "1.1rem",
            }}
          >
            Voucher successfully updated/added!
          </Alert>
        </div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="header">
            <form
              className="form"
              onSubmit={handleAdd}
              style={{ marginRight: "20px" }}
            >
              <TextField
                label="Voucher Code"
                name="voucherCode"
                value={newVoucher.voucherCode}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
              />
              <TextField
                label="Description"
                name="description"
                value={newVoucher.description}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
              />
              <TextField
                label="Discount % Number"
                name="discountNumber"
                type="number"
                value={newVoucher.discountNumber}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
              />
              <TextField
                label="Start Date"
                name="dateStart"
                type="date"
                value={newVoucher.dateStart}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="End Date"
                name="dateEnd"
                type="date"
                value={newVoucher.dateEnd}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {editIndex ? (
                <>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handleUpdate}
                    startIcon={<EditIcon />}
                    sx={{
                      backgroundColor: "#2196F3",
                      color: "white",
                      textTransform: "uppercase",
                      "&:hover": {
                        backgroundColor: "#1976d2",
                      },
                    }}
                  >
                    Update Voucher
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{
                      marginLeft: "1rem",
                      color: "#D946EF",
                      borderColor: "#D946EF",
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#D946EF",
                        backgroundColor: "rgba(217, 70, 239, 0.04)",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                >
                  Add Voucher
                </Button>
              )}
            </form>

            <TextField
              label="Search by Voucher Code"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ margin: "1rem 0", marginLeft: "auto" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Voucher Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Discount Number</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVouchers.map((v) => (
                  <TableRow key={v.voucherId}>
                    <TableCell>{v.voucherCode}</TableCell>
                    <TableCell>{v.description}</TableCell>
                    <TableCell>{v.discountNumber}</TableCell>
                    <TableCell style={{ color: getStatusColor(v.status) }}>
                      {v.status}
                    </TableCell>
                    <TableCell>
                      {new Date(v.dateStart).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(v.dateEnd).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(v)}
                      >
                        Edit
                      </Button>
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

export default VoucherManagement;
