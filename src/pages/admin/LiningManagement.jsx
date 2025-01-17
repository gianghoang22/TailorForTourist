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
  Select,
  MenuItem,
  Box,
  Typography,
  Fade,
  Tooltip,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import "./LiningManagement.scss";

const LiningManagement = () => {
  const [liningData, setLiningData] = useState([]);
  const [newLining, setNewLining] = useState({
    liningId: null,
    liningName: "",
    imageUrl: "",
    status: "Available",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    const fetchLiningData = async () => {
      try {
        setIsLoading(true);
        const token = getAuthToken();

        const response = await fetch("https://vesttour.xyz/api/Linings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched data:", data); // Debug log

        // Check if data is an array or needs to be extracted from response
        const liningsArray = Array.isArray(data)
          ? data
          : data.data
            ? data.data
            : data.linings
              ? data.linings
              : [];

        setLiningData(liningsArray);
      } catch (error) {
        console.error("Error fetching lining data:", error);
        setError("Error fetching lining data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLiningData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLining({ ...newLining, [name]: value });
  };

  const handleAdd = async () => {
    try {
      if (!newLining.liningName || !newLining.imageUrl) {
        setError("Lining Name and Image URL are required");
        return;
      }

      const token = getAuthToken();
      const liningToAdd = {
        liningName: newLining.liningName,
        imageUrl: newLining.imageUrl,
        status: "Available",
      };

      await fetch("https://vesttour.xyz/api/Linings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(liningToAdd),
      });

      // Fetch updated data
      const fetchResponse = await fetch("https://vesttour.xyz/api/Linings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (fetchResponse.ok) {
        const updatedData = await fetchResponse.json();
        console.log("Updated data after add:", updatedData); // Debug log

        // Handle the data structure
        const liningsArray = Array.isArray(updatedData)
          ? updatedData
          : updatedData.data
            ? updatedData.data
            : updatedData.linings
              ? updatedData.linings
              : [];

        setLiningData(liningsArray);

        // Reset form
        setNewLining({
          liningId: null,
          liningName: "",
          imageUrl: "",
          status: "Available",
        });

        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        setError(null);
      }
    } catch (error) {
      console.error("Error in lining operation:", error);
      setError("Error adding lining. Please try again.");
    }
  };
  const handleEdit = (lining) => {
    setNewLining(lining);
    setEditIndex(lining.liningId);
  };

  const handleUpdate = async () => {
    try {
      const token = getAuthToken();

      // Create a copy of the data without the liningId
      const { liningId, ...updateData } = newLining;

      const response = await fetch(
        `https://vesttour.xyz/api/Linings/${editIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error updating lining");
      }

      // Update the local state directly instead of fetching again
      setLiningData((prevData) =>
        prevData.map((item) =>
          item.liningId === editIndex ? { ...item, ...updateData } : item
        )
      );

      // Reset form state
      setEditIndex(null);
      setNewLining({
        liningId: null,
        liningName: "",
        imageUrl: "",
        status: "Available",
      });

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Error updating lining:", error);
      setError(error.message);
    }
  };

  const handleStatusChange = async (liningId, newStatus) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Sending status:", newStatus); // Debug log

      const response = await fetch(
        `https://vesttour.xyz/api/Linings/${liningId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newStatus), // Send just the status string
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Update error:", errorData);
        throw new Error("Failed to update status");
      }

      // Update local state
      setLiningData(
        liningData.map((l) =>
          l.liningId === liningId ? { ...l, status: newStatus } : l
        )
      );

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      setError(null);
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredLinings = Array.isArray(liningData)
    ? liningData
        .sort((a, b) => b.liningId - a.liningId)
        .filter((l) =>
          l.liningName.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];

  const indexOfLastLining = currentPage * itemsPerPage;
  const indexOfFirstLining = indexOfLastLining - itemsPerPage;
  const currentLinings = filteredLinings.slice(
    indexOfFirstLining,
    indexOfLastLining
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCancel = () => {
    setEditIndex(null);
    setNewLining({
      liningId: null,
      liningName: "",
      imageUrl: "",
      status: "Available",
    });
  };

  return (
    <div className="lining-management">
      <Typography variant="h4" component="h2">
        Lining Management
      </Typography>

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
            Lining successfully updated/added!
          </Alert>
        </div>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      {isLoading ? (
        <Box className="loading-container">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper className="header" elevation={0}>
            <div className="form" style={{ marginRight: "20px" }}>
              <TextField
                label="Lining Name"
                name="liningName"
                value={newLining.liningName}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{
                  marginRight: "1rem",
                  width: "250px",
                }}
              />
              <TextField
                label="Image URL"
                name="imageUrl"
                value={newLining.imageUrl}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{
                  marginRight: "1rem",
                  width: "250px",
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "flex-start",
                  marginLeft: "auto",
                }}
              >
                {editIndex ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdate}
                      className="action-button"
                      startIcon={<EditIcon />}
                    >
                      Update Lining
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        color: "#D946EF",
                        borderColor: "#D946EF",
                        "&:hover": {
                          borderColor: "#D946EF",
                          backgroundColor: "rgba(217, 70, 239, 0.04)",
                        },
                      }}
                      onClick={handleCancel}
                      className="action-button"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleAdd}
                    className="action-button"
                    startIcon={<AddIcon />}
                  >
                    Add Lining
                  </Button>
                )}
              </Box>
            </div>

            <TextField
              label="Search by Lining Name"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-field"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>

          <TableContainer component={Paper} elevation={0}>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Lining Name</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentLinings.map((l) => (
                  <TableRow key={l.liningId} hover>
                    <TableCell>{l.liningName}</TableCell>
                    <TableCell>
                      <img
                        src={l.imageUrl}
                        alt={l.liningName}
                        className="image-preview"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={l.status}
                        color={l.status === "Available" ? "success" : "error"}
                        variant="outlined"
                        size="small"
                        sx={{
                          minWidth: "80px",
                          fontSize: "0.875rem",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(l)}
                        style={{ marginRight: "8px" }}
                      >
                        Edit
                      </Button>
                      <TextField
                        select
                        value={l.status}
                        size="small"
                        onChange={(e) =>
                          handleStatusChange(l.liningId, e.target.value)
                        }
                        variant="outlined"
                        style={{ width: "120px" }}
                      >
                        <MenuItem value="Available">Available</MenuItem>
                        <MenuItem value="Unavailable">Unavailable</MenuItem>
                      </TextField>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="pagination">
            {Array.from(
              { length: Math.ceil(filteredLinings.length / itemsPerPage) },
              (_, index) => (
                <Button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  variant={currentPage === index + 1 ? "contained" : "outlined"}
                  style={{ margin: "0 5px" }}
                >
                  {index + 1}
                </Button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LiningManagement;
