// src/components/MeasureList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./MeasureList.scss"; // Import the new styles
import { toast } from "react-toastify";
import { TablePagination, Box, Button } from "@mui/material";

const MeasureList = () => {
  const [users, setUsers] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMeasurementId, setEditMeasurementId] = useState(null); // To track editing state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Add search state
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const usersPerPage = 7; // Number of users per page

  const API_URL = "https://vesttour.xyz/api/Measurement";
  const USER_API_URL = "https://vesttour.xyz/api/User";

  // Update the users fetch to filter roleId === 3
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(USER_API_URL);
        // Filter users with roleId === 3
        const filteredUsers = response.data.filter(user => user.roleId === 3);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch measurements for each user
  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await axios.get(API_URL);
        const measurementMap = response.data.reduce((acc, measurement) => {
          acc[measurement.userId] = measurement;
          return acc;
        }, {});
        setMeasurements(measurementMap);
      } catch (error) {
        console.error("Error fetching measurements:", error);
      }
    };
    fetchMeasurements();
  }, []);

  // Function to update a measurement by userId
  const updateMeasurementByUserId = async (userId, measurementId, values) => {
    try {
      const response = await axios.put(`${API_URL}/${measurementId}`, {
        ...values,
        userId: userId,
        measurementId: measurementId,
      });
      setMeasurements(
        measurements.map((m) =>
          m.measurementId === measurementId ? response.data : m
        )
      );
      setEditMeasurementId(null);
    } catch (error) {
      console.error("Error updating measurement:", error);
    }
  };

  const validationSchema = Yup.object().shape({
    weight: Yup.number()
      .required("Weight is required")
      .min(30, "Weight should be at least 30kg")
      .max(200, "Weight cannot exceed 200kg"),
    height: Yup.number()
      .required("Height is required")
      .min(100, "Height should be at least 100cm")
      .max(250, "Height cannot exceed 250cm"),
    neck: Yup.number()
      .required("Neck size is required")
      .min(30, "Neck size should be at least 30cm"),
    hip: Yup.number()
      .required("Hip size is required")
      .min(60, "Hip size should be at least 60cm"),
    waist: Yup.number()
      .required("Waist size is required")
      .min(50, "Waist size should be at least 50cm"),
    armhole: Yup.number()
      .required("Armhole size is required")
      .min(20, "Armhole should be at least 20cm"),
    biceps: Yup.number()
      .required("Biceps size is required")
      .min(20, "Biceps should be at least 20cm"),
    pantsWaist: Yup.number()
      .required("Pants waist size is required")
      .min(50, "Pants waist should be at least 50cm"),
    crotch: Yup.number()
      .required("Crotch size is required")
      .min(20, "Crotch should be at least 20cm"),
    thigh: Yup.number()
      .required("Thigh size is required")
      .min(40, "Thigh should be at least 40cm"),
    pantsLength: Yup.number()
      .required("Pants length is required")
      .min(50, "Pants length should be at least 50cm"),
    age: Yup.number()
      .required("Age is required")
      .min(0, "Age cannot be negative"),
    chest: Yup.number()
      .required("Chest size is required")
      .min(30, "Chest size should be at least 30cm"),
    shoulder: Yup.number()
      .required("Shoulder size is required")
      .min(20, "Shoulder size should be at least 20cm"),
    sleeveLength: Yup.number()
      .required("Sleeve length is required")
      .min(20, "Sleeve length should be at least 20cm"),
    jacketLength: Yup.number()
      .required("Jacket length is required")
      .min(50, "Jacket length should be at least 50cm"),
  });

  const formik = useFormik({
    initialValues: {
      measurementId: editMeasurementId || 0,
      weight: "",
      height: "",
      neck: "",
      hip: "",
      waist: "",
      armhole: "",
      biceps: "",
      pantsWaist: "",
      crotch: "",
      thigh: "",
      pantsLength: "",
      age: "",
      chest: "",
      shoulder: "",
      sleeveLength: "",
      jacketLength: ""
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (selectedUser) {
          const payload = {
            ...values,
            userId: selectedUser.userId,
          };

          console.log("Updating measurement with payload:", payload);

          await updateMeasurementByUserId(
            selectedUser.userId,
            values.measurementId,
            payload
          );

          formik.resetForm();
        } else {
          console.error("No user selected");
        }
      } catch (error) {
        console.error("Error adding/updating measurement:", error);
      }
    },
    enableReinitialize: true,
  });

  const handleEdit = (userId) => {
    const measurement = measurements[userId];
    if (measurement) {
      setEditingMeasurement(measurement);
      setSelectedUserId(userId);
      setShowCreateModal(true);
      createFormik.setValues({
        userId: measurement.userId,
        weight: measurement.weight,
        height: measurement.height,
        neck: measurement.neck,
        hip: measurement.hip,
        waist: measurement.waist,
        armhole: measurement.armhole,
        biceps: measurement.biceps,
        pantsWaist: measurement.pantsWaist,
        crotch: measurement.crotch,
        thigh: measurement.thigh,
        pantsLength: measurement.pantsLength,
        age: measurement.age,
        chest: measurement.chest,
        shoulder: measurement.shoulder,
        sleeveLength: measurement.sleeveLength,
        jacketLength: measurement.jacketLength
      });
    }
  };

  const handleViewDetail = (userId) => {
    const measurement = measurements[userId];
    if (measurement) {
      setSelectedMeasurement(measurement);
      setShowDetailModal(true);
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedMeasurement(null);
  };

  // Function to update the measurements state after create/edit/delete
  const updateMeasurementsState = (measurementData, isEdit = false) => {
    setMeasurements(prevMeasurements => {
      const updatedMeasurements = { ...prevMeasurements };
      if (isEdit) {
        updatedMeasurements[measurementData.userId] = measurementData; // Update existing measurement
      } else {
        updatedMeasurements[measurementData.userId] = measurementData; // Add new measurement
      }
      return updatedMeasurements;
    });
  };

  const fetchMeasurements = async () => {
    try {
      const response = await axios.get(API_URL);
      const measurementMap = response.data.reduce((acc, measurement) => {
        acc[measurement.userId] = measurement;
        return acc;
      }, {});
      setMeasurements(measurementMap);
    } catch (error) {
      console.error("Error fetching measurements:", error);
    }
  };

  const createFormik = useFormik({
    initialValues: {
      userId: 0,
      weight: 0,
      height: 0,
      neck: 0,
      hip: 0,
      waist: 0,
      armhole: 0,
      biceps: 0,
      pantsWaist: 0,
      crotch: 0,
      thigh: 0,
      pantsLength: 0,
      age: 0,
      chest: 0,
      shoulder: 0,
      sleeveLength: 0,
      jacketLength: 0
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!selectedUserId) {
          alert('Please enter user ID');
          return;
        }
    
        const measurementData = {
          // Thêm measurementId khi đang trong chế độ edit
          ...(editingMeasurement && { measurementId: editingMeasurement.measurementId }),
          userId: Number(selectedUserId),
          weight: Number(values.weight) || 0,
          height: Number(values.height) || 0,
          neck: Number(values.neck) || 0,
          hip: Number(values.hip) || 0,
          waist: Number(values.waist) || 0,
          armhole: Number(values.armhole) || 0,
          biceps: Number(values.biceps) || 0,
          pantsWaist: Number(values.pantsWaist) || 0,
          crotch: Number(values.crotch) || 0,
          thigh: Number(values.thigh) || 0,
          pantsLength: Number(values.pantsLength) || 0,
          age: Number(values.age) || 0,
          chest: Number(values.chest) || 0,
          shoulder: Number(values.shoulder) || 0,
          sleeveLength: Number(values.sleeveLength) || 0,
          jacketLength: Number(values.jacketLength) || 0
        };
    
        let response;
    
        if (editingMeasurement) {
          // Update measurement
          await axios.put(`${API_URL}/${editingMeasurement.measurementId}`, measurementData);
          updateMeasurementsState(measurementData, true);
          toast.success('Measurement updated successfully!');
        } else {
          // Create new measurement
          response = await axios.post(API_URL, measurementData);
          updateMeasurementsState(response.data);
          toast.success('Measurement created successfully!');
        }

        await fetchMeasurements();
    
        // Reset form and states
        setShowCreateModal(false);
        resetForm();
        setSelectedUserId(null);
        setEditingMeasurement(null);
    
      } catch (error) {
        console.error('Error saving measurement:', error);
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  });

  // Add filtered users logic
  const filteredUsers = users
    .filter(user => user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.userId - a.userId); 

  // Calculate the current users to display
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser); // Get users for the current page

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Cập nhật state measurements ngay sau khi thêm hoặc cập nhật
  const handleAddOrUpdateMeasurement = async (measurementData) => {
    try {
      let response;
      if (editingMeasurement) {
        // Update measurement
        response = await axios.put(`${API_URL}/${editingMeasurement.measurementId}`, measurementData);
        setMeasurements(prevMeasurements => ({
          ...prevMeasurements,
          [measurementData.userId]: response.data
        }));
        toast.success('Measurement updated successfully!');
      } else {
        // Create new measurement
        response = await axios.post(API_URL, measurementData);
        setMeasurements(prevMeasurements => ({
          ...prevMeasurements,
          [measurementData.userId]: response.data
        }));
        toast.success('Measurement created successfully!');
      }

      // Reset form and states
      setShowCreateModal(false);
      createFormik.resetForm();
      setEditingMeasurement(null);
    } catch (error) {
      console.error('Error saving measurement:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="measure-list-container">
      <div className="header">
        <h2>Customer Measurements</h2>
        <div className="actions">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search by email..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
        </div>
      </div>

      <div className="table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => {  // Changed from filteredUsers to currentUsers
              const measurement = measurements[user.userId];
              return (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.gender}</td>
                  <td className="actions">
                    {measurement && (
                      <>
                        <button 
                          className="btn-view"
                          onClick={() => handleViewDetail(user.userId)}
                        >
                          View Details
                        </button>
                        <button 
                          className="btn-edit"
                          onClick={() => handleEdit(user.userId)}
                        >
                          Edit
                        </button>
                      </>
                    )}
                    {!measurement && (
                      <button 
                        className="btn-add"
                        onClick={() => {
                          setSelectedUserId(user.userId);
                          setShowCreateModal(true);
                        }}
                      >
                        Add Measurement
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
          <Button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            variant={currentPage === index + 1 ? 'contained' : 'outlined'}
            sx={{ mx: 0.5 }}
          >
            {index + 1}
          </Button>
        ))}
      </Box>

      {/* Measurement Detail Modal */}
      {showDetailModal && selectedMeasurement && (
        <div className="modal-overlay">
          <div className="modal-content detail-modal">
            <div className="modal-header">
              <h3>Measurement Details</h3>
              <button className="close-button" onClick={closeDetailModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="customer-header">
                {console.log("Users Data:", users)}
                {(() => {
                  const user = users.find(user => user.userId === selectedMeasurement.userId);
                  return (
                    <>
                      <h4>{user ? user.name : "Tên không có sẵn"}</h4>
                      <p>{user ? user.email : ""} • {user ? user.phone : ""}</p>
                    </>
                  );
                })()}
              </div>

              <div className="measurements-detail">
                <div className="detail-section">
                  <h5>Basic Measurements</h5>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span>Weight</span>
                      <strong>{selectedMeasurement.weight} kg</strong>
                    </div>
                    <div className="detail-item">
                      <span>Height</span>
                      <strong>{selectedMeasurement.height} cm</strong>
                    </div>
                    <div className="detail-item">
                      <span>Age</span>
                      <strong>{selectedMeasurement.age}</strong>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h5>Upper Body</h5>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span>Neck</span>
                      <strong>{selectedMeasurement.neck} cm</strong>
                    </div>
                    <div className="detail-item">
                      <span>Chest</span>
                      <strong>{selectedMeasurement.chest} cm</strong>
                    </div>
                    <div className="detail-item">
                      <span>Shoulder</span>
                      <strong>{selectedMeasurement.shoulder} cm</strong>
                    </div>
                    <div className="detail-item">
                      <span>Armhole</span>
                      <strong>{selectedMeasurement.armhole} cm</strong>
                    </div>
                    <div className="detail-item">
                      <span>Biceps</span>
                      <strong>{selectedMeasurement.biceps} cm</strong>
                    </div>
                    <div className="detail-item">
                      <span>Sleeve Length</span>
                      <strong>{selectedMeasurement.sleeveLength} cm</strong>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h5>Lower Body</h5>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span>Waist</span>
                      <strong>{selectedMeasurement.waist} cm</strong>
                    </div>
                    <div className="detail-item">
                      <span>Hip</span>
                      <strong>{selectedMeasurement.hip} cm</strong>
                    </div>
                    <div className="detail-item">
                      <span>Pants Waist</span>
                      <strong>{selectedMeasurement.pantsWaist} cm</strong>
                    </div>
                    <div className="detail-item">
                      <span>Crotch</span>
                      <strong>{selectedMeasurement.crotch} cm</strong>
                    </div>
                    <div className="detail-item">
                      <span>Thigh</span>
                      <strong>{selectedMeasurement.thigh} cm</strong>
                    </div>
                    <div className="detail-item">
                      <span>Pants Length</span>
                      <strong>{selectedMeasurement.pantsLength} cm</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal for Add/Edit */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editMeasurementId ? "Edit Measurement" : "Add Measurement"}</h3>
            <div className="customer-header">
              {(() => {
                const user = users.find(user => user.userId === selectedUser.userId);
                return (
                  <>
                    <h4>{user ? user.name : "Tên không có sẵn"}</h4>
                    <p>{user ? user.email : ""} • {user ? user.phone : ""}</p>
                  </>
                );
              })()}
            </div>
            <form onSubmit={formik.handleSubmit} className="measurement-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formik.values.weight}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.weight && 
                    <span className="error">{formik.errors.weight}</span>
                  }
                </div>
                {/* Add other form fields similarly */}
              </div>
              <div className="form-actions">
                <button type="button" className="secondary-button">
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editMeasurementId ? "Update" : "Add"} Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Measurement Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content detail-modal">
            <div className="modal-header">
              <h3>{editingMeasurement ? 'Edit Measurement' : 'Create New Measurement'}</h3>
              <button 
                className="close-button" 
                onClick={() => {
                  setShowCreateModal(false);
                  createFormik.resetForm();
                  setEditingMeasurement(null);
                }}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="customer-header">
                {(() => {
                  console.log("Selected User ID:", selectedUserId);
                  const user = users.find(user => user.userId === selectedUserId);
                  console.log("Found User:", user);
                  return (
                    <>
                      <h4>{user ? user.name : "Tên không có sẵn"}</h4>
                      <p>{user ? user.email : ""} • {user ? user.phone : ""}</p>
                    </>
                  );
                })()}
              </div>

              <form onSubmit={createFormik.handleSubmit}>
                <div className="measurements-detail">
                  <div className="detail-section">
                    <h5>Basic Measurements</h5>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span>Weight (kg)</span>
                        <input
                          type="number"
                          {...createFormik.getFieldProps('weight')}
                          placeholder="Enter weight"
                        />
                      </div>
                      <div className="detail-item">
                        <span>Height (cm)</span>
                        <input
                          type="number"
                          {...createFormik.getFieldProps('height')}
                          placeholder="Enter height"
                        />
                      </div>
                      <div className="detail-item">
                        <span>Age</span>
                        <input
                          type="number"
                          {...createFormik.getFieldProps('age')}
                          placeholder="Enter age"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h5>Upper Body</h5>
                    <div className="detail-grid">
                      {[
                        { name: 'neck', label: 'Neck' },
                        { name: 'chest', label: 'Chest' },
                        { name: 'shoulder', label: 'Shoulder' },
                        { name: 'armhole', label: 'Armhole' },
                        { name: 'biceps', label: 'Biceps' },
                        { name: 'sleeveLength', label: 'Sleeve Length' },
                        { name: 'jacketLength', label: 'Jacket Length' }
                      ].map(field => (
                        <div key={field.name} className="detail-item">
                          <span>{field.label} (cm)</span>
                          <input
                            type="number"
                            {...createFormik.getFieldProps(field.name)}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            className={
                              createFormik.touched[field.name] && createFormik.errors[field.name] 
                                ? "error-input" 
                                : ""
                            }
                          />
                          {createFormik.touched[field.name] && createFormik.errors[field.name] && (
                            <div className="error-message">{createFormik.errors[field.name]}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h5>Lower Body</h5>
                    <div className="detail-grid">
                      {[
                        { name: 'waist', label: 'Waist' },
                        { name: 'hip', label: 'Hip' },
                        { name: 'pantsWaist', label: 'Pants Waist' },
                        { name: 'crotch', label: 'Crotch' },
                        { name: 'thigh', label: 'Thigh' },
                        { name: 'pantsLength', label: 'Pants Length' }
                      ].map(field => (
                        <div key={field.name} className="detail-item">
                          <span>{field.label} (cm)</span>
                          <input
                            type="number"
                            {...createFormik.getFieldProps(field.name)}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            className={
                              createFormik.touched[field.name] && createFormik.errors[field.name] 
                                ? "error-input" 
                                : ""
                            }
                          />
                          {createFormik.touched[field.name] && createFormik.errors[field.name] && (
                            <div className="error-message">{createFormik.errors[field.name]}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="secondary-button"
                    onClick={() => {
                      setShowCreateModal(false);
                      createFormik.resetForm();
                      setEditingMeasurement(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasureList;