// src/components/MeasureList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./MeasureList.scss"; // Import the new styles

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

  const API_URL = "https://localhost:7194/api/Measurement";
  const USER_API_URL = "https://localhost:7194/api/User";

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${USER_API_URL}`);
        const userMap = response.data.reduce((acc, user) => {
          acc[user.userId] = user;
          return acc;
        }, {});
        setUsers(userMap);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch all measurements
  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await axios.get(API_URL);
        setMeasurements(response.data);
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
  });

  const formik = useFormik({
    initialValues: {
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
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (selectedUser) {
          if (editMeasurementId) {
            updateMeasurementByUserId(
              selectedUser.userId,
              editMeasurementId,
              values
            );
          } else {
            const response = await axios.post(API_URL, {
              ...values,
              userId: selectedUser.userId,
            });
            setMeasurements([...measurements, response.data]);
          }
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

  const handleEdit = (measurement) => {
    setEditingMeasurement(measurement);
    setShowCreateModal(true);
    createFormik.setValues({
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
    setSelectedUserId(measurement.userId);
  };

  const handleDelete = async (measurementId) => {
    try {
      if (window.confirm('Are you sure you want to delete this measurement?')) {
        console.log('Deleting measurement:', measurementId);
        
        await axios.delete(`${API_URL}/${measurementId}`);
        
        setMeasurements(measurements.filter(m => m.measurementId !== measurementId));
        
        alert('Measurement deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting measurement:', error);
      console.log('Error response data:', error.response?.data);
      alert('Failed to delete measurement. Please try again.');
    }
  };

  const handleViewDetail = (measurement) => {
    setSelectedMeasurement(measurement);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedMeasurement(null);
  };

  const createFormik = useFormik({
    initialValues: {
      measurementId: 0,
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
    validationSchema: Yup.object({
      weight: Yup.number().required('This field is required'),
      height: Yup.number().required('This field is required'),
      neck: Yup.number().required('This field is required'),
      hip: Yup.number().required('This field is required'),
      waist: Yup.number().required('This field is required'),
      armhole: Yup.number().required('This field is required'),
      biceps: Yup.number().required('This field is required'),
      pantsWaist: Yup.number().required('This field is required'),
      crotch: Yup.number().required('This field is required'),
      thigh: Yup.number().required('This field is required'),
      pantsLength: Yup.number().required('This field is required'),
      age: Yup.number().required('This field is required'),
      chest: Yup.number().required('This field is required'),
      shoulder: Yup.number().required('This field is required'),
      sleeveLength: Yup.number().required('This field is required'),
      jacketLength: Yup.number().required('This field is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!selectedUserId) {
          alert('Please enter user ID');
          return;
        }

        const measurementData = {
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
          measurementData.measurementId = editingMeasurement.measurementId;
          console.log('Updating measurement:', measurementData);
          response = await axios.put(`${API_URL}/${editingMeasurement.measurementId}`, measurementData);
          
          setMeasurements(measurements.map(m => 
            m.measurementId === editingMeasurement.measurementId ? response.data : m
          ));
          alert('Measurement updated successfully!');
        } else {
          console.log('Creating new measurement:', measurementData);
          response = await axios.post(API_URL, measurementData);
          setMeasurements([...measurements, response.data]);
          alert('Measurement created successfully!');
        }

        setShowCreateModal(false);
        resetForm();
        setSelectedUserId(null);
        setEditingMeasurement(null);

      } catch (error) {
        console.error('Error saving measurement:', error);
        console.log('Error response data:', error.response?.data);
        alert('Failed to save measurement. Please try again.');
      }
    }
  });

  return (
    <div className="measure-list-container">
      <div className="header">
        <h2>Customer Measurements</h2>
        <div className="actions">
          <div className="search-bar">
            <input type="text" placeholder="Search customer..." />
            <button className="primary-button">Search</button>
          </div>
          <button 
            className="primary-button create-button"
            onClick={() => setShowCreateModal(true)}
          >
            Create New Measurement
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((measurement) => {
              const user = users[measurement.userId];
              return (
                <tr key={measurement.measurementId}>
                  <td>{user?.name}</td>
                  <td>{user?.email}</td>
                  <td>{user?.phone}</td>
                  <td>{user?.gender}</td>
                  <td className="actions">
                    <button 
                      className="btn-view"
                      onClick={() => handleViewDetail(measurement)}
                    >
                      View Details
                    </button>
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(measurement)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(measurement.measurementId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
                <h4>{users[selectedMeasurement.userId]?.name}</h4>
                <p>{users[selectedMeasurement.userId]?.email} • {users[selectedMeasurement.userId]?.phone}</p>
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
                <div className="detail-item">
                  <span>User ID</span>
                  <input
                    type="number"
                    value={selectedUserId || ''}
                    onChange={(e) => setSelectedUserId(Number(e.target.value))}
                    placeholder="Enter user ID"
                    className={
                      createFormik.touched.userId && !selectedUserId 
                        ? "error-input" 
                        : ""
                    }
                  />
                  {createFormik.touched.userId && !selectedUserId && (
                    <div className="error-message">This field is required</div>
                  )}
                </div>
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