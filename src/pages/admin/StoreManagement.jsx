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
import "./StoreManagement.scss";

const StoreManagement = () => {
  const [storeData, setStoreData] = useState([]);
  const [newStore, setNewStore] = useState({
    userId: "",
    name: "",
    address: "",
    contactNumber: "",
    openTime: "",
    closeTime: "",
    staffIDs: "",
    districtID: "",
    imgUrl: "",
    status: "Active",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [managers, setManagers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://vesttour.xyz/api/Store");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStoreData(data);
      } catch (error) {
        console.error("Error fetching store data:", error);
        setError("Error fetching store data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStoreData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Log the token to verify it exists
        console.log("Token:", token);

        const [managersRes, staffRes, provincesRes] = await Promise.all([
          fetch("https://vesttour.xyz/api/User/role/4", { headers }),
          fetch("https://vesttour.xyz/api/User/role/2", { headers }),
          fetch("https://vesttour.xyz/api/Shipping/provinces", { headers }),
        ]);

        // Log response status to check if requests are successful
        console.log("Managers Response:", managersRes.status);
        console.log("Staff Response:", staffRes.status);
        console.log("Provinces Response:", provincesRes.status);

        const managersData = await managersRes.json();
        const staffData = await staffRes.json();
        const provincesData = await provincesRes.json();

        // Log the actual data received
        console.log("Managers Data:", managersData);
        console.log("Staff Data:", staffData);
        console.log("Provinces Data:", provincesData);

        setManagers(managersData);
        setStaff(staffData);
        setProvinces(provincesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching required data");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "staffIDs") {
      setSelectedStaff(
        Array.isArray(value) ? value : value.split(",").map(Number)
      );
      setNewStore({
        ...newStore,
        staffIDs: Array.isArray(value) ? value.join(",") : value,
      });
    } else {
      setNewStore({ ...newStore, [name]: value });
    }
  };

  const handleAdd = async () => {
    try {
      // Validate required fields
      if (!validateFields()) {
        setError("All fields are required. Please complete all fields.");
        return;
      }

      // Check for unique store name and contact number
      const isDuplicate = storeData.some(
        (store) =>
          store.name === newStore.name ||
          store.contactNumber === newStore.contactNumber
      );
      if (isDuplicate) {
        setError(
          "Store name or contact number already exists. Please use unique values."
        );
        return;
      }

      const response = await fetch("https://vesttour.xyz/api/Store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...newStore,
          storeId: 0,
          storeCode: Math.floor(1000000 + Math.random() * 9000000),
          openTime: `${newStore.openTime}:00`,
          closeTime: `${newStore.closeTime}:00`,
        }),
      });

      // Handle response
      if (response.ok) {
        const addedStore = await response.json();

        // Update local state
        setStoreData((prevStores) => [...prevStores, addedStore]);

        // Reset form
        setNewStore({
          userId: "",
          name: "",
          address: "",
          contactNumber: "",
          openTime: "",
          closeTime: "",
          staffIDs: "",
          districtID: "",
          imgUrl: "",
          status: "Active",
        });

        setError(null);
        setSuccessMessage("Store successfully added!");
        setShowSuccessMessage(true);

        // Add timeout to reload page after showing success message
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Reload after 2 seconds (matching the success message duration)
      } else {
        // If response is not ok, handle error
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add store");
      }
    } catch (error) {
      console.error("Error adding store:", error);
      setError(error.message);
    }
  };

  const validateFields = () => {
    return (
      newStore.userId &&
      newStore.name &&
      newStore.address &&
      newStore.contactNumber &&
      newStore.openTime &&
      newStore.closeTime &&
      newStore.districtID
    );
  };

  const handleEdit = (store) => {
    console.log("Editing store:", store); // Debug log
    const staffIDsArray = store.staffIDs
      ? store.staffIDs.split(",").map(Number)
      : [];
    setSelectedStaff(staffIDsArray);

    // Preserve the storeId and other existing data
    setNewStore({
      ...store,
      storeId: store.storeId, // Make sure to keep the storeId
      openTime: store.openTime.substring(0, 5),
      closeTime: store.closeTime.substring(0, 5),
      staffIDs: store.staffIDs || "",
      status: store.status || "Active",
    });
    setEditIndex(store.storeId);
  };

  const handleUpdate = async () => {
    try {
      // Validate required fields
      if (!validateFields()) {
        setError("All fields are required. Please complete all fields.");
        return;
      }

      // Make sure we're using the existing storeId
      const updateData = {
        ...newStore,
        storeId: editIndex, // Ensure storeId is included
        openTime: `${newStore.openTime}:00`,
        closeTime: `${newStore.closeTime}:00`,
        // Preserve existing data that shouldn't change
        storeCode: storeData.find((s) => s.storeId === editIndex)?.storeCode,
      };

      console.log("Updating store with data:", updateData); // Debug log

      const response = await fetch(
        `https://vesttour.xyz/api/Store/${editIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.status === 204 || response.ok) {
        // Update local state
        setStoreData((prevStores) =>
          prevStores.map((store) =>
            store.storeId === editIndex ? updateData : store
          )
        );

        // Reset form and states
        setNewStore({
          userId: "",
          name: "",
          address: "",
          contactNumber: "",
          openTime: "",
          closeTime: "",
          staffIDs: "",
          districtID: "",
          imgUrl: "",
          status: "Active",
        });
        setEditIndex(null);
        setSelectedStaff([]);
        setError(null);
        setSuccessMessage("Store successfully updated!");
        setShowSuccessMessage(true);

        setTimeout(() => {
          setShowSuccessMessage(false);
          setSuccessMessage("");
        }, 3000);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update store");
      }
    } catch (error) {
      console.error("Error updating store:", error);
      setError(error.message);
    }
  };

  const handleStatusChange = async (storeId, newStatus) => {
    try {
      console.log("Current store data:", storeData);
      console.log("Changing store ID:", storeId);
      console.log("New status:", newStatus);

      const token = localStorage.getItem("token");

      // Find the current store data
      const currentStore = storeData.find((s) => s.storeId === storeId);
      if (!currentStore) {
        throw new Error("Store not found");
      }

      // Create the update object with all existing data plus new status
      const updateData = {
        storeId: currentStore.storeId,
        userId: currentStore.userId,
        name: currentStore.name,
        address: currentStore.address,
        contactNumber: currentStore.contactNumber,
        openTime: currentStore.openTime,
        closeTime: currentStore.closeTime,
        staffIDs: currentStore.staffIDs,
        districtID: currentStore.districtID,
        imgUrl: currentStore.imgUrl,
        status: newStatus, // Make sure this is being updated
      };

      console.log("Sending update request:", updateData);

      const response = await fetch(
        `https://vesttour.xyz/api/Store/${storeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      console.log("Response status:", response.status);

      if (response.status === 204) {
        // Success - update local state
        setStoreData(
          storeData.map((s) =>
            s.storeId === storeId ? { ...s, status: newStatus } : s
          )
        );
        setError(null);
        setSuccessMessage("Store status successfully updated!");
        setShowSuccessMessage(true);

        setTimeout(() => {
          setShowSuccessMessage(false);
          setSuccessMessage("");
        }, 3000);
      } else {
        throw new Error(`Error updating store status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStores = storeData
    .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.storeId - a.storeId);

  // Add this function to filter out assigned managers
  const getAvailableManagers = () => {
    const assignedManagerIds = storeData.map((store) => store.userId);
    return managers.filter(
      (manager) =>
        !assignedManagerIds.includes(manager.userId) ||
        (editIndex &&
          storeData.find((store) => store.storeId === editIndex)?.userId ===
            manager.userId)
    );
  };

  // Add this function to filter out assigned staff
  const getAvailableStaff = () => {
    const assignedStaffIds = storeData.flatMap((store) =>
      store.staffIDs ? store.staffIDs.split(",").map(Number) : []
    );
    return staff.filter(
      (staffMember) =>
        !assignedStaffIds.includes(staffMember.userId) ||
        (editIndex &&
          storeData
            .find((store) => store.storeId === editIndex)
            ?.staffIDs?.split(",")
            .map(Number)
            .includes(staffMember.userId))
    );
  };

  // Add this function to handle cancel
  const handleCancelEdit = () => {
    setEditIndex(null);
    setNewStore({
      userId: "",
      name: "",
      address: "",
      contactNumber: "",
      openTime: "",
      closeTime: "",
      staffIDs: "",
      districtID: "",
      imgUrl: "",
      status: "Active",
    });
    setSelectedStaff([]);
    setError(null);
  };

  return (
    <div className="store-management">
      <h2>Store Management</h2>
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
          <div className="header">
            <div className="form">
              <Select
                label="Manager"
                name="userId"
                value={newStore.userId}
                onChange={handleChange}
                variant="outlined"
                displayEmpty
                style={{ marginRight: "1rem", minWidth: "200px" }}
              >
                <MenuItem value="" disabled>
                  Select Manager
                </MenuItem>
                {getAvailableManagers().length > 0 ? (
                  getAvailableManagers().map((manager) => (
                    <MenuItem key={manager.userId} value={manager.userId}>
                      {manager.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No available managers
                  </MenuItem>
                )}
              </Select>

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
              <TextField
                label="Open Time"
                name="openTime"
                type="time"
                value={newStore.openTime}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
              <TextField
                label="Close Time"
                name="closeTime"
                type="time"
                value={newStore.closeTime}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
              <Select
                label="Province"
                name="districtID"
                value={newStore.districtID}
                onChange={handleChange}
                variant="outlined"
                displayEmpty
                style={{ marginRight: "1rem", minWidth: "200px" }}
              >
                <MenuItem value="" disabled>
                  Select Province
                </MenuItem>
                {provinces && provinces.length > 0 ? (
                  provinces.map((province) => (
                    <MenuItem
                      key={province.provinceID}
                      value={province.provinceID}
                    >
                      {province.provinceName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No provinces available
                  </MenuItem>
                )}
              </Select>
              <TextField
                label="Image URL"
                name="imgUrl"
                value={newStore.imgUrl}
                onChange={handleChange}
                variant="outlined"
                style={{ marginRight: "1rem" }}
              />
              <Select
                multiple
                label="Staff Members"
                name="staffIDs"
                value={selectedStaff}
                onChange={handleChange}
                variant="outlined"
                displayEmpty
                style={{ marginRight: "1rem", minWidth: "200px" }}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return "Select Staff Members";
                  }
                  return selected
                    .map((id) => staff.find((s) => s.userId === id)?.name)
                    .filter(Boolean)
                    .join(", ");
                }}
              >
                {getAvailableStaff().length > 0 ? (
                  getAvailableStaff().map((staffMember) => (
                    <MenuItem
                      key={staffMember.userId}
                      value={staffMember.userId}
                    >
                      {staffMember.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No available staff
                  </MenuItem>
                )}
              </Select>
              {editIndex ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                    startIcon={<EditIcon />}
                  >
                    Update Store
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "#D946EF",
                      borderColor: "#D946EF",
                      "&:hover": {
                        borderColor: "#D946EF",
                        backgroundColor: "rgba(217, 70, 239, 0.04)",
                      },
                    }}
                    onClick={handleCancelEdit}
                    style={{ marginLeft: "1rem" }}
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
                >
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

          <TableContainer
            component={Paper}
            style={{
              maxWidth: "100%",
              overflowX: "auto",
              marginTop: "1rem",
            }}
          >
            <Table style={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Store Name
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Address
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Contact Number
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Open Time
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Close Time
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStores.map((s) => (
                  <TableRow key={s.storeId}>
                    <TableCell
                      style={{
                        maxWidth: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.name}
                    </TableCell>
                    <TableCell
                      style={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.address}
                    </TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      {s.contactNumber}
                    </TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      {s.openTime}
                    </TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      {s.closeTime}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={s.status}
                        color={s.status === "Active" ? "success" : "error"}
                        variant="outlined"
                        size="small"
                        sx={{
                          minWidth: "80px",
                          fontSize: "0.875rem",
                        }}
                      />
                    </TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(s)}
                        style={{ marginRight: "0.5rem" }}
                        size="small"
                      >
                        Edit
                      </Button>
                      <Select
                        value={s.status || "Active"}
                        onChange={(e) =>
                          handleStatusChange(s.storeId, e.target.value)
                        }
                        size="small"
                        style={{ minWidth: "120px" }}
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
        </>
      )}
    </div>
  );
};

export default StoreManagement;
