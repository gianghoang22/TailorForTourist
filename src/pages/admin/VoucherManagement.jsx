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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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

  useEffect(() => {
    const fetchVoucherData = async () => {
      try {
        const response = await fetch("http://157.245.50.125:8080/api/Voucher");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setVoucherData(data);
      } catch (error) {
        console.error("Error fetching voucher data:", error);
        setError("Error fetching voucher data. Please try again later.");
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
                `https://localhost:7194/api/Voucher/${voucher.voucherId}`,
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

  const handleAdd = async () => {
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
      const response = await fetch("http://157.245.50.125:8080/api/Voucher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVoucher),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error adding new voucher");
      }

      const addedVoucher = await response.json();
      setVoucherData([...voucherData, addedVoucher]);
      setError(null);
      setShowSuccessMessage(true);
      setNewVoucher({
        voucherId: null,
        status: "Pending",
        voucherCode: "",
        description: "",
        discountNumber: 0,
        dateStart: "",
        dateEnd: "",
      });
    } catch (error) {
      console.error("Error adding new voucher:", error);
      setError(error.message);
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

    try {
      const response = await fetch(
        `http://157.245.50.125:8080/api/Voucher/${editIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newVoucher),
        }
      );

      if (!response.ok) {
        let errorMessage = "Error updating voucher";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const updatedVoucher = await response.json();
      const updatedVouchers = voucherData.map((v) =>
        v.voucherId === editIndex ? updatedVoucher : v
      );
      setVoucherData(updatedVouchers);
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
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error updating voucher:", error);
      setError(error.message);
    }
  };

  const handleDelete = async (voucherId) => {
    try {
      const response = await fetch(
        `http://157.245.50.125:8080/api/Voucher/${voucherId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error deleting voucher");
      }
      setVoucherData(voucherData.filter((v) => v.voucherId !== voucherId));
      setError(null);
    } catch (error) {
      console.error("Error deleting voucher:", error);
      setError(error.message);
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

  return (
    <div className="voucher-management">
      <h2>Voucher Management</h2>
      {error && <Alert severity="error">{error}</Alert>}
      <div className="header">
        <div className="form">
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
            label="Discount Number"
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
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update Voucher
            </Button>
          ) : (
            <Button variant="contained" color="secondary" onClick={handleAdd}>
              Add Voucher
            </Button>
          )}
        </div>

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
                <TableCell>{v.discountNumber}%</TableCell>
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
                    style={{ marginRight: "0.5rem" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(v.voucherId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {showSuccessMessage && (
        <div className="success-message">
          <p>Added/Updated successfully!</p>
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      )}
    </div>
  );
};

export default VoucherManagement;
