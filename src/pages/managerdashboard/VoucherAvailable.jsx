import React, { useState, useEffect } from "react";
import {
  TextField,
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
  InputBase,
  IconButton,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./VoucherAvailable.scss";

const VoucherAvailable = () => {
  const [voucherData, setVoucherData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
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
    <div className="voucher-available">
      <div className="page-title">Available Vouchers</div>

      {error && (
        <Alert severity="error" className="error-alert">
          {error}
        </Alert>
      )}

      {isLoading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="header">
            <Paper className="search-container">
              <IconButton className="search-icon" aria-label="search">
                <SearchIcon />
              </IconButton>
              <InputBase
                className="search-input"
                placeholder="Search by voucher code..."
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
              />
            </Paper>
          </div>

          <Paper className="table-wrapper">
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Voucher Code</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Discount Number</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVouchers.map((v) => (
                    <TableRow
                      key={v.voucherId}
                      className={`voucher-row ${v.status.toLowerCase()}`}
                    >
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </div>
  );
};

export default VoucherAvailable;
