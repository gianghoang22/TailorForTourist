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
  CircularProgress,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
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
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You need to log in first!");
          setLoading(false);
          return;
        }

        console.log("Fetching data..."); // Debug log

        const response = await fetch("https://vesttour.xyz/api/User", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", response.status); // Debug log

        if (response.status === 401) {
          setError(
            "You are not authorized to access this resource. Please log in."
          );
          localStorage.removeItem("token");
          window.location.href = "/signin";
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data.sort((a, b) => b.userId - a.userId));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data. Please try again later.");
      } finally {
        setLoading(false);
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
    const errors = {};

    // Add debug logging
    console.log("Validating fields:", newUser);

    // Only validate required fields
    if (!newUser.name?.trim()) {
      errors.name = "Name is required";
    } else if (newUser.name.length < 4 || newUser.name.length > 25) {
      errors.name = "Name must be between 4 and 25 characters";
    }

    if (!newUser.email?.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailRegex.test(newUser.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (!newUser.address?.trim()) {
      errors.address = "Address is required";
    }

    if (!newUser.gender) {
      errors.gender = "Gender is required";
    }

    if (!newUser.roleId) {
      errors.roleId = "Role is required";
    }

    // Phone validation (optional)
    if (newUser.phone) {
      const phoneRegex = /^(0|\+84)(\d{9,10})$/;
      if (!phoneRegex.test(newUser.phone)) {
        errors.phone = "Phone must start with 0 or +84 and have 9-10 digits";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showTemporarySuccess = (message) => {
    setShowSuccessMessage(message);
    setTimeout(() => {
      setShowSuccessMessage(null);
    }, 2000); // Message will disappear after 2 seconds
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

      setLoading(true);

      const response = await fetch("https://vesttour.xyz/api/User", {
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

      // Update local state
      setUserData((prevData) => [...prevData, addedUser]);
      setError(null);
      showTemporarySuccess("User has been successfully added!");

      // Reset form
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

      // Wait for 1 second before reloading
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.reload();
    } catch (error) {
      console.error("Error adding new user:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setNewUser(user);
    setEditIndex(user.userId);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to log in first!");
        return;
      }

      // Create the update object with only the necessary fields
      const updateData = {
        userId: editIndex,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        gender: newUser.gender,
        roleId: newUser.roleId,
        status: newUser.status,
      };

      const response = await fetch(
        `https://vesttour.xyz/api/User/${editIndex}`,
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
        throw new Error("Failed to update user");
      }

      // Update the local state without waiting for response data
      setUserData((prevData) =>
        prevData.map((user) =>
          user.userId === editIndex ? { ...user, ...updateData } : user
        )
      );

      // Show success message and reset state
      showTemporarySuccess("User has been successfully updated!");
      setEditIndex(null);
      setError(null);

      // Reset form
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
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user. Please try again.");
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to log in first!");
        return;
      }

      const response = await fetch(
        `https://vesttour.xyz/api/User/${userId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newStatus),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error updating user status");
      }

      // Update the user status in the local state
      setUserData(
        userData.map((user) =>
          user.userId === userId ? { ...user, status: newStatus } : user
        )
      );
      setError(null);
      showTemporarySuccess("User status has been successfully updated!");
    } catch (error) {
      console.error("Error updating user status:", error);
      setError(error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = userData
    .sort((a, b) => b.userId - a.userId)
    .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleCancelEdit = () => {
    setEditIndex(null);
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
    setFieldErrors({});
    setError(null);
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
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
            {showSuccessMessage}
          </Alert>
        </div>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
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
                label="Name"
                name="name"
                value={newUser.name}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
                error={!!fieldErrors.name}
                helperText={fieldErrors.name}
                required
              />
              <TextField
                label="Email"
                name="email"
                value={newUser.email}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                required
              />
              <TextField
                label="Phone"
                name="phone"
                value={newUser.phone}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
                error={!!fieldErrors.phone}
                helperText={fieldErrors.phone}
                required
              />
              <TextField
                label="Address"
                name="address"
                value={newUser.address}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
                error={!!fieldErrors.address}
                helperText={fieldErrors.address}
                required
              />
              <TextField
                label="Gender"
                name="gender"
                select
                value={newUser.gender}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
                error={!!fieldErrors.gender}
                helperText={fieldErrors.gender}
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
              <TextField
                label="Role"
                name="roleId"
                select
                value={newUser.roleId}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
                error={!!fieldErrors.roleId}
                helperText={fieldErrors.roleId}
                required
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </TextField>
              <div style={{ display: "flex", gap: "1rem" }}>
                {editIndex !== null ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdate}
                      startIcon={<EditIcon />}
                    >
                      Update User
                    </Button>
                    <Button variant="outlined" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleAdd}
                    startIcon={<AddIcon />}
                  >
                    Add User
                  </Button>
                )}
              </div>
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
            <Table style={{ width: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell
                    style={{ whiteSpace: "normal", maxWidth: "150px" }}
                  >
                    Address
                  </TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentUsers.map((u) => (
                  <TableRow key={u.userId}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.phone}</TableCell>
                    <TableCell
                      style={{ whiteSpace: "normal", maxWidth: "150px" }}
                    >
                      {u.address}
                    </TableCell>
                    <TableCell>{u.gender}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.status}
                        color={u.status === "Active" ? "success" : "error"}
                        variant="outlined"
                        size="small"
                        sx={{
                          minWidth: "80px",
                          fontSize: "0.875rem",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {roles.find((role) => role.id === u.roleId)?.name}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(u)}
                        style={{ marginRight: "8px" }}
                      >
                        Edit
                      </Button>
                      <TextField
                        select
                        value={u.status}
                        size="small"
                        onChange={(e) =>
                          handleStatusChange(u.userId, e.target.value)
                        }
                        variant="outlined"
                        style={{ width: "120px" }}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Deactive">Deactive</MenuItem>
                      </TextField>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="pagination">
            {Array.from(
              { length: Math.ceil(filteredUsers.length / itemsPerPage) },
              (_, index) => (
                <Button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
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

export default UserManagement;
