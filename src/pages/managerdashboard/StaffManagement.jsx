import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
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
import "./StaffManagement.scss";

const StaffManagement = () => {
  const [staffData, setStaffData] = useState([]);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    gender: "Male",
    address: "nowhere",
    dob: "2003-12-12",
    isConfirmed: true,
    phone: "0915230240",
    password: "123456",
    roleId: 2,
    status: "Active",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await fetch("http://157.245.50.125:8080/api/User");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const filteredData = data.filter((user) => user.roleId === 2);
        setStaffData(filteredData);
      } catch (error) {
        console.error("Error fetching staff data:", error);
        setError("Error fetching staff data. Please try again later.");
      }
    };
    fetchStaffData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({ ...newStaff, [name]: value });
  };

  const handleAdd = async () => {
    try {
      const response = await fetch("http://157.245.50.125:8080/api/User", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStaff),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("API Error:", error);
        throw new Error(error.message || "Error adding new staff");
      }

      await response.json(); // Wait for the response to be parsed

      // Re-fetch staff data instead of refreshing the page
      // fetchStaffData(); // Call the function to fetch data again

      // setNewStaff({
      //   name: "",
      //   email: "",
      //   gender: "Male",
      //   address: "nowhere",
      //   dob: "2003-12-12",
      //   isConfirmed: true,
      //   phone: "0915230240",
      //   password: "123456",
      //   roleId: 2,
      //   status: "Active",
      // });

      setError(null); // Clear any previous errors
      setShowSuccessMessage(true); // Show success message
    } catch (error) {
      console.error("Error adding new staff:", error);
      setError(error.message); // Set the error message
    }
  };

  const handleEdit = (staffData) => {
    setNewStaff(staffData);
    setEditIndex(staffData.userId);
  };
  const handleCancel = () => {
    setNewStaff({
      name: "",
      email: "",
      gender: "Male",
      address: "nowhere",
      dob: "2003-12-12",
      isConfirmed: true,
      phone: "0915230240",
      password: "123456",
      roleId: 2,
      status: "Active",
    });
    setEditIndex(null);
  };
  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://157.245.50.125:8080/api/User/${editIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newStaff),
        }
      );

      if (!response.ok) {
        // Check for 204 status to confirm success without content
        if (response.status !== 204) {
          const error = await response.json();
          throw new Error(error.message || "Error updating staff");
        }
      }

      // Update staff data locally after a successful edit
      const updatedStaff = staffData.map((s) =>
        s.userId === editIndex ? { ...s, ...newStaff } : s
      );
      setStaffData(updatedStaff);
      setNewStaff({
        name: "",
        email: "",
        password: "123456",
        roleId: 2,
        status: "Active",
      });
      setEditIndex(null);
      setError(null);
    } catch (error) {
      console.error("Error updating staff:", error);
      setError(error.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(
        `http://157.245.50.125:8080/api/User/${userId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error deleting staff");
      }
      setStaffData(staffData.filter((s) => s.userId !== userId));
      setError(null);
    } catch (error) {
      console.error("Error deleting staff:", error);
      setError(error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStaff = staffData.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="staff-management">
      <h2>Staff Management</h2>
      {error && <Alert severity="error">{error}</Alert>}
      <div className="header">
        <div className="form">
          <TextField
            label="Name"
            name="name"
            value={newStaff.name}
            onChange={handleChange}
            variant="outlined"
            style={{ marginRight: "1rem" }}
          />
          <TextField
            label="Email"
            name="email"
            value={newStaff.email}
            onChange={handleChange}
            variant="outlined"
            style={{ marginRight: "1rem" }}
          />
          <TextField
            label="Phone"
            name="phone"
            value={newStaff.phone}
            onChange={handleChange}
            variant="outlined"
            style={{ marginRight: "1rem" }}
          />
          <TextField
            label="Address"
            name="address"
            value={newStaff.address}
            onChange={handleChange}
            variant="outlined"
            style={{ marginRight: "1rem" }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={editIndex ? handleUpdate : handleAdd}
          >
            {editIndex ? "Update Staff" : "Add Staff"}
          </Button>
          {editIndex && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancel}
              style={{ marginLeft: "0.5rem" }}
            >
              Cancel
            </Button>
          )}
        </div>

        <TextField
          label="Search by Name"
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
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStaff.map((s) => (
              <TableRow key={s.userId}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.status}</TableCell>
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
                    onClick={() => handleDelete(s.userId)}
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

export default StaffManagement;
