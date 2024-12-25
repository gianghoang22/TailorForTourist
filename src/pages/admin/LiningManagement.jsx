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
    status: "Active",
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

        const response = await fetch("https://localhost:7194/api/Linings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setLiningData(data);
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
      const { liningId, ...liningToAdd } = newLining;
      const token = getAuthToken();

      const response = await fetch("https://localhost:7194/api/Linings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(liningToAdd),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error response:", errorResponse);
        throw new Error(errorResponse.message || "Error adding new lining");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error adding new lining:", error);
      setError(error.message);
    }
  };
  const handleEdit = (lining) => {
    setNewLining(lining);
    setEditIndex(lining.liningId);
  };

  const handleUpdate = async () => {
    try {
      const token = getAuthToken();

      const response = await fetch(
        `https://localhost:7194/api/Linings/${editIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newLining),
        }
      );

      console.log("Response Status:", response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error updating lining");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error updating lining:", error);
      setError(error.message);
    }
  };

  const handleStatusChange = async (liningId, newStatus) => {
    try {
      const liningToUpdate = liningData.find((l) => l.liningId === liningId);
      const updatedLining = { ...liningToUpdate, status: newStatus };

      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `https://localhost:7194/api/Linings/${liningId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedLining),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Error updating status: ${response.status} ${errorText}`
        );
      }

      setLiningData(
        liningData.map((l) =>
          l.liningId === liningId ? { ...l, status: newStatus } : l
        )
      );
      setError(null);
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredLinings = liningData.filter((l) =>
    l.liningName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastLining = currentPage * itemsPerPage;
  const indexOfFirstLining = indexOfLastLining - itemsPerPage;
  const currentLinings = filteredLinings.slice(indexOfFirstLining, indexOfLastLining);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="lining-management">
      <Typography variant="h4" component="h2">
        Lining Management
      </Typography>

      <Fade in={error != null}>
        <div>{error && <Alert severity="error">{error}</Alert>}</div>
      </Fade>
      <Fade in={showSuccessMessage}>
        <div>
          {showSuccessMessage && (
            <Alert severity="success">Lining successfully updated/added!</Alert>
          )}
        </div>
      </Fade>

      {isLoading ? (
        <Box className="loading-container">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper className="header" elevation={0}>
            <div className="form">
              <Tooltip title="Enter lining name">
                <TextField
                  label="Lining Name"
                  name="liningName"
                  value={newLining.liningName}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  className="form-group"
                  required
                />
              </Tooltip>
              <Tooltip title="Enter image URL">
                <TextField
                  label="Image URL"
                  name="imageUrl"
                  value={newLining.imageUrl}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  className="form-group"
                  required
                />
              </Tooltip>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "flex-start",
                  marginLeft: "auto",
                }}
              >
                {editIndex ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                    className="action-button"
                    startIcon={<EditIcon />}
                  >
                    Update Lining
                  </Button>
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
                        color={l.status === "Active" ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit lining">
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleEdit(l)}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                      </Tooltip>
                      <Select
                        value={l.status || "Active"}
                        onChange={(e) =>
                          handleStatusChange(l.liningId, e.target.value)
                        }
                        size="small"
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Deactive">Deactive</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="pagination">
            {Array.from({ length: Math.ceil(filteredLinings.length / itemsPerPage) }, (_, index) => (
              <Button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                variant={currentPage === index + 1 ? "contained" : "outlined"}
                style={{ margin: "0 5px" }}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LiningManagement;
