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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./StaffManagement.scss";

const StaffManagement = () => {
  const [staffData, setStaffData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState(null);

  useEffect(() => {
    const fetchStoreAndStaffData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("userID");

      console.log("Token:", token);
      console.log("UserID:", userID);

      if (!token || !userID) {
        alert("You need to log in first!");
        window.location.href = "/signin";
        return;
      }

      try {
        // Get store data which includes staffIDs
        const storeResponse = await fetch(
          `https://vesttour.xyz/api/Store/userId/${userID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!storeResponse.ok) {
          throw new Error("Failed to fetch store information");
        }

        const storeData = await storeResponse.json();
        console.log("Store Data:", storeData);

        setStoreId(storeData.storeId);

        // If staffIDs exists and is not empty, fetch staff details
        if (storeData.staffIDs) {
          const staffIds = storeData.staffIDs.split(",").map((id) => id.trim());

          // Fetch details for each staff member
          const staffPromises = staffIds.map((staffId) =>
            fetch(`https://vesttour.xyz/api/User/${staffId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).then((res) => res.json())
          );

          const staffDetails = await Promise.all(staffPromises);
          setStaffData(staffDetails);
        } else {
          setStaffData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching staff data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStoreAndStaffData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStaff = staffData.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="staff-management">
      <div className="title">Staff Management</div>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Search by Name"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ margin: "1rem 0" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
        >
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStaff.map((s) => (
                <TableRow key={s.userId}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default StaffManagement;