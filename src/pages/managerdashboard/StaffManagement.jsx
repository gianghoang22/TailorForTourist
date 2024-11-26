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
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to log in first!");
        window.location.href = "/signin";
        return;
      }

      try {
        const response = await fetch("https://localhost:7194/api/User/role/2", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseBody = await response.json();
        console.log("Response Status:", response.status);
        console.log("Response Body:", responseBody);

        if (response.ok) {
          setStaffData(responseBody);
        } else if (response.status === 403) {
          alert("You do not have permission to access this resource.");
        } else {
          throw new Error(responseBody.message || "Unexpected response");
        }
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  const isUniqueEmail = (email) =>
    !staffData.some((staff) => staff.email === email);
  const isUniquePhone = (phone) =>
    !staffData.some((staff) => staff.phone === phone);

  const handleAdd = async () => {
    if (
      !newStaff.name ||
      !newStaff.email ||
      !newStaff.phone ||
      !newStaff.address
    ) {
      setError("All fields are required.");
      return;
    }

    if (!emailRegex.test(newStaff.email)) {
      setError("Invalid email format");
      return;
    }
    if (!phoneRegex.test(newStaff.phone)) {
      setError("Phone number must be 10 digits");
      return;
    }
    if (!isUniqueEmail(newStaff.email)) {
      setError("Email already exists");
      return;
    }
    if (!isUniquePhone(newStaff.phone)) {
      setError("Phone number already exists");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://157.245.50.125:8080/api/User", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newStaff),
      });

      const responseBody = await response.json();
      console.log("Response Status:", response.status);
      console.log("Response Body:", responseBody);

      if (response.ok) {
        // Successfully added staff, refresh the page
        window.location.reload();
      } else if (response.status === 403) {
        alert("You do not have permission to add staff.");
        return;
      } else {
        throw new Error(responseBody.message || "Error adding new staff");
      }
    } catch (error) {
      console.error("Error adding new staff:", error);
      setError(error.message);
    }
  };

  const handleEdit = (staff) => {
    setNewStaff(staff);
    setEditIndex(staff.userId);
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
    if (
      !newStaff.name ||
      !newStaff.email ||
      !newStaff.phone ||
      !newStaff.address
    ) {
      setError("All fields are required.");
      return;
    }

    if (!emailRegex.test(newStaff.email)) {
      setError("Invalid email format");
      return;
    }
    if (!phoneRegex.test(newStaff.phone)) {
      setError("Phone number must be 10 digits");
      return;
    }
    if (!isUniqueEmail(newStaff.email) && editIndex !== newStaff.userId) {
      setError("Email already exists");
      return;
    }
    if (!isUniquePhone(newStaff.phone) && editIndex !== newStaff.userId) {
      setError("Phone number already exists");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://157.245.50.125:8080/api/User/${editIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newStaff),
        }
      );

      const responseBody = await response.json();
      console.log("Response Status:", response.status);
      console.log("Response Body:", responseBody);

      if (response.ok) {
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
      } else if (response.status === 403) {
        alert("You do not have permission to update staff.");
        return;
      } else {
        throw new Error(responseBody.message || "Error updating staff");
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      setError(error.message);
    }
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://157.245.50.125:8080/api/User/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setStaffData(staffData.filter((s) => s.userId !== userId));
        setError(null);
      } else if (response.status === 403) {
        alert("You do not have permission to delete staff.");
        return;
      } else {
        const responseBody = await response.json();
        throw new Error(responseBody.message || "Error deleting staff");
      }
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
