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
    status: "On going",
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
        const response = await fetch("https://localhost:7194/api/Voucher");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVoucher({ ...newVoucher, [name]: value });
  };

  const handleAdd = async () => {
    try {
      const response = await fetch("https://localhost:7194/api/Voucher", {
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
    } catch (error) {
      console.error("Error adding new voucher:", error);
      setError(error.message);
    }
  };

  const handleEdit = (voucher) => {
    setNewVoucher(voucher);
    setEditIndex(voucher.voucherId);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `https://localhost:7194/api/Voucher/${editIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newVoucher),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error updating voucher");
      }
      const updatedVoucher = await response.json();
      const updatedVouchers = voucherData.map((v) =>
        v.voucherId === editIndex ? updatedVoucher : v
      );
      setVoucherData(updatedVouchers);
      setNewVoucher({
        voucherId: null,
        status: "On going",
        voucherCode: "",
        description: "",
        discountNumber: 0,
        dateStart: "",
        dateEnd: "",
      });
      setEditIndex(null);
      setError(null);
    } catch (error) {
      console.error("Error updating voucher:", error);
      setError(error.message);
    }
  };

  const handleDelete = async (voucherId) => {
    try {
      const response = await fetch(
        `https://localhost:7194/api/Voucher/${voucherId}`,
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
          <Button variant="contained" color="secondary" onClick={handleAdd}>
            Add Voucher
          </Button>
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
                <TableCell>{v.discountNumber * 100}%</TableCell>
                <TableCell>{v.status}</TableCell>
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
          <p>Added successfully!</p>
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      )}
    </div>
  );
};

export default VoucherManagement;
