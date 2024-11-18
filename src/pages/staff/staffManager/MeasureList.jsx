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

  const API_URL = "https://localhost:7194/api/Measurement";
  const USER_API_URL = "https://localhost:7194/api/User";

  // Fetch all users, filter by roleId === 3
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${USER_API_URL}`);
        const allUsers = response.data;
        const customers = allUsers.filter((user) => user.roleId === 3);
        setUsers(customers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch measurements by userId
  const fetchMeasurements = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/byUser/${userId}`);
      setMeasurements(response.data);
    } catch (error) {
      console.error("Error fetching measurements:", error);
    }
  };

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
    formik.setValues({
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
    });
    setEditMeasurementId(measurement.measurementId);
  };

  const handleDelete = async (measurementId) => {
    try {
      await axios.delete(`${API_URL}/${measurementId}`);
      setMeasurements(
        measurements.filter((m) => m.measurementId !== measurementId)
      );
    } catch (error) {
      console.error("Error deleting measurement:", error);
    }
  };

  const handleShowMeasurements = (user) => {
    setSelectedUser(user);
    fetchMeasurements(user.userId);
  };

  return (
    <div className="measure-list">
      <h2>Customer List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td className="actions">
                <button onClick={() => handleShowMeasurements(user)}>
                  Show Measurements
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <>
          <h3>Measurements for {selectedUser.name}</h3>
          <table>
            <thead>
              <tr>
                <th>Weight</th>
                <th>Height</th>
                <th>Neck</th>
                <th>Hip</th>
                <th>Waist</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((measurement) => (
                <tr key={measurement.measurementId}>
                  <td>{measurement.weight}</td>
                  <td>{measurement.height}</td>
                  <td>{measurement.neck}</td>
                  <td>{measurement.hip}</td>
                  <td>{measurement.waist}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(measurement)}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(measurement.measurementId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>{editMeasurementId ? "Edit Measurement" : "Add Measurement"}</h3>
          <form onSubmit={formik.handleSubmit} className="measurement-form">
            <div>
              <label>Weight:</label>
              <input
                type="number"
                name="weight"
                value={formik.values.weight}
                onChange={formik.handleChange}
              />
              {formik.errors.weight && <div>{formik.errors.weight}</div>}
            </div>
            <div>
              <label>Height:</label>
              <input
                type="number"
                name="height"
                value={formik.values.height}
                onChange={formik.handleChange}
              />
              {formik.errors.height && <div>{formik.errors.height}</div>}
            </div>
            <div>
              <label>Neck:</label>
              <input
                type="number"
                name="neck"
                value={formik.values.neck}
                onChange={formik.handleChange}
              />
              {formik.errors.neck && <div>{formik.errors.neck}</div>}
            </div>
            <div>
              <label>Hip:</label>
              <input
                type="number"
                name="hip"
                value={formik.values.hip}
                onChange={formik.handleChange}
              />
              {formik.errors.hip && <div>{formik.errors.hip}</div>}
            </div>
            <div>
              <label>Waist:</label>
              <input
                type="number"
                name="waist"
                value={formik.values.waist}
                onChange={formik.handleChange}
              />
              {formik.errors.waist && <div>{formik.errors.waist}</div>}
            </div>
            <button type="submit">
              {editMeasurementId ? "Update" : "Add"} Measurement
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default MeasureList;
