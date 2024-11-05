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
import "./LiningManagement.scss";

const LiningManagement = () => {
  const [liningData, setLiningData] = useState([]);
  const [newLining, setNewLining] = useState({
    liningId: null,
    liningName: "",
    imageUrl: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchLiningData = async () => {
      try {
        const response = await fetch("https://localhost:7194/api/Linings");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setLiningData(data); // No filtering required
      } catch (error) {
        console.error("Error fetching lining data:", error);
        setError("Error fetching lining data. Please try again later.");
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
      const response = await fetch("https://localhost:7194/api/Linings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLining),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error adding new lining");
      }

      const addedLining = await response.json();
      setLiningData([...liningData, addedLining]); // Update lining data without needing to refetch
      setError(null);
      setShowSuccessMessage(true);
      setNewLining({ liningId: null, liningName: "", imageUrl: "" }); // Reset form
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
      const response = await fetch(
        `https://localhost:7194/api/Linings/${editIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLining),
        }
      );

      console.log("Response Status:", response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error updating lining");
      }

      // Handle 204 No Content
      if (response.status === 204) {
        // Optionally, you can show a success message here
        console.log("Lining updated successfully.");
        // Refresh the page
        window.location.reload();
        return; // Successfully updated without needing to parse response
      }

      // For any other response, you can check if the body is empty
      const textResponse = await response.text();
      if (textResponse.trim() === "") {
        console.warn(
          "Received empty response body, but update was likely successful"
        );
        // Refresh the page
        window.location.reload();
        return; // Handle the empty response accordingly, but do nothing further
      }

      // If there is a non-empty response, parse it
      const updatedLining = JSON.parse(textResponse);
      const updatedLinings = liningData.map((l) =>
        l.liningId === editIndex ? updatedLining : l
      );
      setLiningData(updatedLinings);
      setNewLining({ liningId: null, liningName: "", imageUrl: "" });
      setEditIndex(null);
      setError(null);
      setShowSuccessMessage(true);

      // Refresh the page after successful update
      window.location.reload();
    } catch (error) {
      console.error("Error updating lining:", error);
      setError(error.message);
    }
  };

  const handleDelete = async (liningId) => {
    try {
      const response = await fetch(
        `https://localhost:7194/api/Linings/${liningId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error deleting lining");
      }
      setLiningData(liningData.filter((l) => l.liningId !== liningId));
      setError(null);
    } catch (error) {
      console.error("Error deleting lining:", error);
      setError(error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredLinings = liningData.filter((l) =>
    l.liningName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="lining-management">
      <h2>Lining Management</h2>
      {error && <Alert severity="error">{error}</Alert>}
      <div className="header">
        <div className="form">
          <TextField
            label="Lining Name"
            name="liningName"
            value={newLining.liningName}
            onChange={handleChange}
            variant="outlined"
            style={{ marginRight: "1rem" }}
          />
          <TextField
            label="Image URL"
            name="imageUrl"
            value={newLining.imageUrl}
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
              Update Lining
            </Button>
          ) : (
            <Button variant="contained" color="secondary" onClick={handleAdd}>
              Add Lining
            </Button>
          )}
        </div>

        <TextField
          label="Search by Lining Name"
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
              <TableCell>Lining Name</TableCell>
              <TableCell>Image URL</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLinings.map((l) => (
              <TableRow key={l.liningId}>
                <TableCell>{l.liningName}</TableCell>
                <TableCell>
                  <img
                    src={l.imageUrl}
                    alt={l.liningName}
                    style={{ width: "50px", height: "auto" }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(l)}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(l.liningId)}
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

export default LiningManagement;
