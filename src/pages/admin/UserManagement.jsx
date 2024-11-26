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

const roles = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Staff" },
  { id: 3, name: "Customer" },
  { id: 4, name: "Manager" },
  { id: 5, name: "Tailor Partner" },
];

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
    roleId: 2, // Default role
    status: "Active",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You need to log in first!");
          return;
        }

        const response = await fetch("https://localhost:7194/api/User", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          setError(
            "You are not authorized to access this resource. Please log in."
          );
          localStorage.removeItem("token");
          window.location.href = "/signin";
          return;
        }

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setUserData(data);
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

  const validateEmailUnique = (email) => {
    return !userData.some((user) => user.email === email);
  };

  const validateFields = () => {
    return (
      newUser.name &&
      newUser.email &&
      newUser.phone &&
      newUser.address &&
      newUser.gender &&
      newUser.dob
    );
  };

  const handleAdd = async () => {
    if (!validateEmailUnique(newUser.email)) {
      setError("Email must be unique.");
      return;
    }

    if (!validateFields()) {
      setError("All fields must be filled.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to log in first!");
        return;
      }

      const response = await fetch("https://localhost:7194/api/User", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error adding new user");
      }

      const addedUser = await response.json();
      setUserData([...userData, addedUser]);
      setError(null);
      setShowSuccessMessage(true);
      window.location.reload();
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
    if (
      !validateEmailUnique(newUser.email) &&
      newUser.email !==
        userData.find((user) => user.userId === editIndex)?.email
    ) {
      setError("Email must be unique.");
      return;
    }

    if (!validateFields()) {
      setError("All fields must be filled.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to log in first!");
        return;
      }

      const response = await fetch(
        `http://157.245.50.125:8080/api/User/${editIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newUser),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error updating user");
      }

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
      setShowSuccessMessage(true);
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
      setError(error.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to log in first!");
        return;
      }

      const response = await fetch(
        `http://157.245.50.125:8080/api/User/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          <TextField
            label="Role"
            name="roleId"
            select
            value={newUser.roleId}
            onChange={handleChange}
            variant="outlined"
            style={{ marginRight: "1rem" }}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>
          {editIndex !== null ? (
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update User
            </Button>
          ) : (
            <Button variant="contained" color="secondary" onClick={handleAdd}>
              Add User
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
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Role</TableCell> {/* Added Role Column */}
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
                  {roles.find((role) => role.id === u.roleId)?.name}
                </TableCell>{" "}
                {/* Display Role Name */}
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(u)}
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
        <Alert severity="success">User has been successfully updated!</Alert>
      )}
    </div>
  );
};

export default UserManagement;
