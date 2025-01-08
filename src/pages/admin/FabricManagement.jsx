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
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import "./FabricManagement.scss";

const FabricManagement = () => {
  const [fabricData, setFabricData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [newFabric, setNewFabric] = useState({
    // Set default ID for new fabric
    fabricName: "",
    price: 0,
    description: "",
    imageUrl: "", // Initialize as empty string
    tag: 0, // Initialize as 0 or null
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchFabricData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://vesttour.xyz/api/Fabrics");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setFabricData(data);
    } catch (error) {
      console.error("Error fetching fabric data:", error);
      setError("Error fetching fabric data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFabricData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFabric({ ...newFabric, [name]: value });
  };

  const handleAdd = async () => {
    try {
      // Validate required fields
      if (
        !newFabric.fabricName ||
        newFabric.price <= 0 ||
        !newFabric.description
      ) {
        setError(
          "Fabric name, price (greater than 0), and description are required."
        );
        return;
      }

      // Convert price and tag to numbers and add status
      const fabricToAdd = {
        ...newFabric,
        price: parseFloat(newFabric.price),
        tag: parseInt(newFabric.tag, 10),
        status: "Available",
      };

      console.log("Adding Fabric Data:", JSON.stringify(fabricToAdd));

      const response = await fetch("https://vesttour.xyz/api/Fabrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(fabricToAdd),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if there's actually JSON content to parse
      const contentType = response.headers.get("content-type");
      let addedFabric;
      if (contentType && contentType.includes("application/json")) {
        addedFabric = await response.json();
      } else {
        // Handle non-JSON response
        const textResponse = await response.text();
        console.log("Non-JSON response:", textResponse);
        throw new Error("Server did not return JSON response");
      }

      setFabricData([...fabricData, addedFabric]);
      setError(null);
      setSuccessMessage("Fabric successfully added!");
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage("");
      }, 3000);

      // Reset form after successful addition
      setNewFabric({
        fabricName: "",
        price: 0,
        description: "",
        imageUrl: "",
        tag: 0,
      });

      setError(null);
      setShowSuccessMessage(true);

      // Fetch updated data AND refresh the page
      await fetchFabricData();
      window.location.reload();
    } catch (error) {
      console.error("Error adding new fabric:", error);
      setError(
        error.message || "Unexpected error occurred while adding fabric"
      );
    }
  };
  const handleEdit = (fabric) => {
    setNewFabric({
      ...fabric,
      status: fabric.status || "Available",
    });
    setEditIndex(fabric.fabricID);
  };

  const handleUpdate = async () => {
    try {
      // Validate required fields
      if (
        !newFabric.fabricName ||
        newFabric.price <= 0 ||
        !newFabric.description
      ) {
        setError(
          "Fabric name, price (greater than 0), and description are required."
        );
        return;
      }

      // Get the auth token from localStorage or wherever you store it
      const token = localStorage.getItem("token"); // Adjust this based on how you store your auth token

      const fabricToUpdate = {
        fabricID: editIndex,
        fabricName: newFabric.fabricName,
        price: parseFloat(newFabric.price),
        description: newFabric.description,
        imageUrl: newFabric.imageUrl || "",
        tag: parseInt(newFabric.tag, 10),
        status: newFabric.status || "Available",
      };

      console.log("Sending update request:", fabricToUpdate); // Debug log

      const response = await fetch(
        `https://vesttour.xyz/api/Fabrics/${editIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add authorization header
          },
          body: JSON.stringify(fabricToUpdate),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update response error:", response.status, errorText); // Debug log
        throw new Error(
          errorText || `Error updating fabric: ${response.status}`
        );
      }

      // Update local state
      const updatedFabrics = fabricData.map((f) =>
        f.fabricID === editIndex ? { ...f, ...fabricToUpdate } : f
      );

      setFabricData(updatedFabrics);
      setNewFabric({
        fabricID: 0,
        fabricName: "",
        price: 0,
        description: "",
        imageUrl: "",
        tag: 0,
      });
      setEditIndex(null);
      setError(null);
      setSuccessMessage("Fabric successfully updated!");
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating fabric:", error);
      setError(error.message || "Failed to update fabric");
    }
  };

  const handleDelete = async (fabricID) => {
    try {
      const response = await fetch(
        `https://vesttour.xyz/api/Fabrics/${fabricID}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error deleting fabric:", errorResponse);
        setError(errorResponse.message || "Error deleting fabric");
        return;
      }
      setFabricData(fabricData.filter((f) => f.fabricID !== fabricID));
      setError(null);
    } catch (error) {
      console.error("Error deleting fabric:", error);
      setError(error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFabrics = fabricData
    .sort((a, b) => b.fabricID - a.fabricID) // Sort by fabricID in descending order
    .filter((f) =>
      f.fabricName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleStatusChange = async (fabricID, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://vesttour.xyz/api/Fabrics/${fabricID}/status`,
        {
          method: "PATCH",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: `"${newStatus}"`,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update status: ${errorText}`);
      }

      // Update local state
      setFabricData(
        fabricData.map((f) =>
          f.fabricID === fabricID ? { ...f, status: newStatus } : f
        )
      );
      setError(null);
      setSuccessMessage("Status successfully updated!");
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.message);
    }
  };

  // Add this function to map tag numbers to names
  const getTagName = (tag) => {
    switch (tag) {
      case 0:
        return "Premium";
      case 1:
        return "New";
      case 2:
        return "Sale";
      default:
        return "Unknown"; // Handle unexpected values
    }
  };

  const indexOfLastFabric = currentPage * itemsPerPage;
  const indexOfFirstFabric = indexOfLastFabric - itemsPerPage;
  const currentFabrics = filteredFabrics.slice(
    indexOfFirstFabric,
    indexOfLastFabric
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCancelEdit = () => {
    setEditIndex(null);
    setNewFabric({
      fabricName: "",
      price: 0,
      description: "",
      imageUrl: "",
      tag: 0,
    });
    setError(null);
  };

  return (
    <div className="fabric-management">
      <h2>Fabric Management</h2>
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
            {successMessage}
          </Alert>
        </div>
      )}

      {isLoading ? (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          <div
            className="header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <div
              className="form"
              style={{ display: "flex", alignItems: "center" }}
            >
              <TextField
                label="Fabric Name"
                name="fabricName"
                value={newFabric.fabricName}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem", width: "200px" }}
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                value={newFabric.price}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem", width: "200px" }}
              />
              <TextField
                label="Description"
                name="description"
                value={newFabric.description}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem", width: "200px" }}
              />
              <TextField
                label="Image URL"
                name="imageUrl"
                value={newFabric.imageUrl}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem", width: "200px" }}
              />
              <div className="form" style={{ marginRight: "1rem" }}>
                <TextField
                  label="Tag"
                  name="tag"
                  select
                  value={newFabric.tag}
                  onChange={(e) =>
                    handleChange({
                      target: { name: "tag", value: e.target.value },
                    })
                  }
                  variant="outlined"
                  style={{ width: "200px" }}
                >
                  <MenuItem value={0}>Premium</MenuItem>
                  <MenuItem value={1}>New</MenuItem>
                  <MenuItem value={2}>Sale</MenuItem>
                </TextField>
              </div>
              {editIndex ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                    startIcon={<EditIcon />}
                    style={{ marginLeft: "1rem" }}
                  >
                    Update Fabric
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "#9c27b0",
                      borderColor: "#9c27b0",
                      textTransform: "none",
                      marginLeft: "1rem",
                      "&:hover": {
                        borderColor: "#9c27b0",
                        backgroundColor: "transparent",
                      },
                    }}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAdd}
                  startIcon={<AddIcon />}
                  style={{ marginLeft: "1rem" }}
                >
                  Add Fabric
                </Button>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                label="Search by Fabric Name"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ margin: "1rem 0", width: "300px" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fabric Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Image URL</TableCell>
                  <TableCell>Tag</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentFabrics.map((f) => (
                  <TableRow key={f.fabricID}>
                    <TableCell>{f.fabricName}</TableCell>
                    <TableCell>{f.price}</TableCell>
                    <TableCell>{f.description}</TableCell>
                    <TableCell>
                      <img
                        src={f.imageUrl}
                        alt={f.fabricName}
                        style={{
                          width: "100px",
                          height: "auto",
                          objectFit: "cover",
                        }}
                      />
                    </TableCell>
                    <TableCell>{getTagName(f.tag)}</TableCell>
                    <TableCell>
                      <Chip
                        label={f.status}
                        color={f.status === "Available" ? "success" : "error"}
                        variant="outlined"
                        size="small"
                        sx={{
                          minWidth: "80px",
                          fontSize: "0.875rem",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(f)}
                        style={{ marginRight: "0.5rem" }}
                      >
                        Edit
                      </Button>
                      <Select
                        value={f.status || "Available"}
                        onChange={(e) =>
                          handleStatusChange(f.fabricID, e.target.value)
                        }
                        size="small"
                        style={{ minWidth: "120px" }}
                      >
                        <MenuItem value="Available">Available</MenuItem>
                        <MenuItem value="Unavailable">Unavailable</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="pagination">
            {Array.from(
              { length: Math.ceil(filteredFabrics.length / itemsPerPage) },
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

export default FabricManagement;
