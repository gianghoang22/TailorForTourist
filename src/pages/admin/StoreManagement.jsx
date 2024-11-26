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
import "./StoreManagement.scss";

const StoreManagement = () => {
  const [storeData, setStoreData] = useState([]);
  const [newStore, setNewStore] = useState({
    storeId: null,
    userId: 0,
    name: "",
    address: "",
    contactNumber: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch("http://157.245.50.125:8080/api/Store");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStoreData(data);
      } catch (error) {
        console.error("Error fetching store data:", error);
        setError("Error fetching store data. Please try again later.");
      }
    };
    fetchStoreData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStore({ ...newStore, [name]: value });
  };

  const handleAdd = async () => {
    // Check for required fields
    const { name, address, contactNumber } = newStore;
    if (!name || !address || !contactNumber) {
      setError("All fields are required. Please complete all fields.");
      return;
    }

    // Check for unique store name and contact number
    const isDuplicate = storeData.some(
      (store) => store.name === name || store.contactNumber === contactNumber
    );
    if (isDuplicate) {
      setError(
        "Store name or contact number already exists. Please use unique values."
      );
      return;
    }

    try {
      const response = await fetch("http://157.245.50.125:8080/api/Store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStore),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error adding new store");
      }

      const addedStore = await response.json();
      setStoreData([...storeData, addedStore]);
      setError(null);
      setShowSuccessMessage(true);
      setNewStore({
        storeId: null,
        userId: 0,
        name: "",
        address: "",
        contactNumber: "",
      });
    } catch (error) {
      console.error("Error adding new store:", error);
      setError(error.message);
    }
  };

  const handleEdit = (store) => {
    setNewStore(store);
    setEditIndex(store.storeId);
  };

  const handleUpdate = async () => {
    const { name, address, contactNumber } = newStore;

    // Check for required fields
    if (!name || !address || !contactNumber) {
      setError("All fields are required. Please complete all fields.");
      return;
    }

    // Check for unique store name and contact number
    const isDuplicate = storeData.some(
      (store) =>
        (store.name === name || store.contactNumber === contactNumber) &&
        store.storeId !== editIndex
    );
    if (isDuplicate) {
      setError(
        "Store name or contact number already exists. Please use unique values."
      );
      return;
    }

    try {
      const response = await fetch(
        `http://157.245.50.125:8080/api/Store/${editIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newStore),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error updating store");
      }

      const updatedStores = storeData.map((s) =>
        s.storeId === editIndex ? { ...s, ...newStore } : s
      );
      setStoreData(updatedStores);
      setNewStore({
        storeId: null,
        userId: 0,
        name: "",
        address: "",
        contactNumber: "",
      });
      setEditIndex(null);
      setError(null);
      setShowSuccessMessage(true); // Show success message after update
    } catch (error) {
      console.error("Error updating store:", error);
      setError(error.message);
    }
  };

  const handleDelete = async (storeId) => {
    try {
      const response = await fetch(
        `http://157.245.50.125:8080/api/Store/${storeId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error deleting store");
      }
      setStoreData(storeData.filter((s) => s.storeId !== storeId));
      setError(null);
    } catch (error) {
      console.error("Error deleting store:", error);
      setError(error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStores = storeData.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="store-management">
      <h2>Store Management</h2>
      {error && <Alert severity="error">{error}</Alert>}
      {showSuccessMessage && (
        <Alert severity="success">Store successfully updated/added!</Alert>
      )}
      <div className="header">
        <div className="form">
          <TextField
            label="Store Name"
            name="name"
            value={newStore.name}
            onChange={handleChange}
            variant="outlined"
            style={{ marginRight: "1rem" }}
          />
          <TextField
            label="Address"
            name="address"
            value={newStore.address}
            onChange={handleChange}
            variant="outlined"
            style={{ marginRight: "1rem" }}
          />
          <TextField
            label="Contact Number"
            name="contactNumber"
            value={newStore.contactNumber}
            onChange={handleChange}
            variant="outlined"
            style={{ marginRight: "1rem" }}
          />
          {editIndex ? (
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update Store
            </Button>
          ) : (
            <Button variant="contained" color="secondary" onClick={handleAdd}>
              Add Store
            </Button>
          )}
        </div>

        <TextField
          label="Search by Store Name"
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
              <TableCell>Store Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStores.map((s) => (
              <TableRow key={s.storeId}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.address}</TableCell>
                <TableCell>{s.contactNumber}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(s)}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(s.storeId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StoreManagement;
