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
import "./FabricManagement.scss";

const FabricManagement = () => {
  const [fabricData, setFabricData] = useState([]);
  const [newFabric, setNewFabric] = useState({
    fabricID: 0, // Set default ID for new fabric
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

  useEffect(() => {
    const fetchFabricData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://localhost:7194/api/Fabrics");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFabricData(data); // No filtering required
      } catch (error) {
        console.error("Error fetching fabric data:", error);
        setError("Error fetching fabric data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
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

      // Convert price and tag to numbers
      const fabricToAdd = {
        ...newFabric,
        price: parseFloat(newFabric.price), // Convert price to a float
        tag: parseInt(newFabric.tag, 10), // Convert tag to an integer
      };

      console.log("Adding Fabric Data:", JSON.stringify(fabricToAdd));

      const response = await fetch("https://localhost:7194/api/Fabrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fabricToAdd),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error adding new fabric:", errorResponse);
        setError(errorResponse.message || "Error adding new fabric");
        return;
      }

      const addedFabric = await response.json();
      setFabricData([...fabricData, addedFabric]); // Update local state without needing to refetch
      setError(null);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error adding new fabric:", error);
      setError(
        error.message || "Unexpected error occurred while adding fabric"
      );
    }
  };
  const handleEdit = (fabric) => {
    setNewFabric(fabric);
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

      console.log("Updating Fabric Data:", JSON.stringify(newFabric, null, 2)); // Log data before sending

      const response = await fetch(
        `https://localhost:7194/api/Fabrics/${editIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newFabric),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error updating fabric:", errorResponse);
        setError(errorResponse.message || "Error updating fabric");
        return;
      }

      // Update local state without needing to refetch
      const updatedFabrics = fabricData.map((f) =>
        f.fabricID === editIndex ? { ...f, ...newFabric } : f
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
      setShowSuccessMessage(true); // Show success message after update
    } catch (error) {
      console.error("Error updating fabric:", error);
      setError(error.message);
    }
  };

  const handleDelete = async (fabricID) => {
    try {
      const response = await fetch(
        `https://localhost:7194/api/Fabrics/${fabricID}`,
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

  const filteredFabrics = fabricData.filter((f) =>
    f.fabricName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fabric-management">
      <h2>Fabric Management</h2>
      {error && <Alert severity="error">{error}</Alert>}

      {isLoading ? (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="header">
            <div className="form">
              <TextField
                label="Fabric Name"
                name="fabricName"
                value={newFabric.fabricName}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                value={newFabric.price}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
              />
              <TextField
                label="Description"
                name="description"
                value={newFabric.description}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
              />
              <TextField
                label="Image URL"
                name="imageUrl"
                value={newFabric.imageUrl}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
              />
              <TextField
                label="Tag"
                name="tag"
                type="number"
                value={newFabric.tag}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
              />
              {editIndex ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleUpdate}
                >
                  Update Fabric
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAdd}
                >
                  Add Fabric
                </Button>
              )}
            </div>

            <TextField
              label="Search by Fabric Name"
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
                  <TableCell>Fabric Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Image URL</TableCell>
                  <TableCell>Tag</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFabrics.map((f) => (
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
                    <TableCell>{f.tag}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(f)}
                        style={{ marginRight: "0.5rem" }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDelete(f.fabricID)}
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
            <Alert severity="success" style={{ marginTop: "1rem" }}>
              Fabric successfully saved!
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default FabricManagement;
