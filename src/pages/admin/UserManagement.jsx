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
import "./UserManagement.scss";

const UserManagement = () => {
  const [userData, setUserData] = useState([]);
  const [newUser, setNewUser] = useState({
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
    const fetchUserData = async () => {
      try {
        const response = await fetch("https://localhost:7244/api/User");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserData(data); // No filtering by roleId
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data. Please try again later.");
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAdd = async () => {
    try {
      const response = await fetch("https://localhost:7244/api/User", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error adding new user");
      }

      await response.json(); // Wait for the response to be parsed
      setUserData([...userData, newUser]); // Update user data without needing to refetch
      setError(null);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error adding new user:", error);
      setError(error.message);
    }
  };

  const handleEdit = (user) => {
    setNewUser(user);
    setEditIndex(user.userId);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `https://localhost:7244/api/User/${editIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error updating user");
      }
      const updatedUser = await response.json();
      const updatedUsers = userData.map((u) =>
        u.userId === editIndex ? updatedUser : u
      );
      setUserData(updatedUsers);
      setNewUser({
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
      setError(null);
    } catch (error) {
      console.error("Error updating user:", error);
      setError(error.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(
        `https://localhost:7244/api/User/${userId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error deleting user");
      }
      setUserData(userData.filter((u) => u.userId !== userId));
      setError(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = userData.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-management">
      <h2>User Management</h2>
      {error && <Alert severity="error">{error}</Alert>}
      <div className="header">
        <div className="form">
          <TextField
            label="Name"
            name="name"
            value={newUser.name}
            onChange={handleChange}
            variant="outlined"
            style={{ marginRight: "1rem" }}
          />
          <TextField
            label="Email"
            name="email"
            value={newUser.email}
            onChange={handleChange}
            variant="outlined"
            style={{ marginRight: "1rem" }}
          />
          <TextField
            label="Phone"
            name="phone"
            value={newUser.phone}
            onChange={handleChange}
            variant="outlined"
            style={{ marginRight: "1rem" }}
          />
          <TextField
            label="Address"
            name="address"
            value={newUser.address}
            onChange={handleChange}
            variant="outlined"
            style={{ marginRight: "1rem" }}
          />
          <TextField
            label="Gender"
            name="gender"
            select
            value={newUser.gender}
            onChange={handleChange}
            variant="outlined"
            style={{ marginRight: "1rem" }}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <Button variant="contained" color="secondary" onClick={handleAdd}>
            Add User
          </Button>
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
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((u) => (
              <TableRow key={u.userId}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone}</TableCell>
                <TableCell>{u.address}</TableCell>
                <TableCell>{u.gender}</TableCell>
                <TableCell>{u.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(u)}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(u.userId)}
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

export default UserManagement;
