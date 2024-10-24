import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const MeasureList = () => {
  const [measurements, setMeasurements] = useState([]);
  const [user, setUser] = useState(null); // To store the logged-in user
  const [editMeasurementId, setEditMeasurementId] = useState(null); // To track the measurement being edited
  const API_URL = 'https://localhost:7194/api/Measurement';
  const USER_API_URL = 'https://localhost:7194/api/User'; // User API

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await axios.get(`${USER_API_URL}/loggedInUser`);
        const userData = response.data;

        if (userData.roleId === 3) {
          setUser(userData);
          fetchMeasurements(userData.userId);
        } else {
          console.error('Only customers can manage measurements.');
        }
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      }
    };

    fetchLoggedInUser();
  }, []);

  const fetchMeasurements = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/byUser/${userId}`);
      setMeasurements(response.data);
    } catch (error) {
      console.error('Error fetching measurements:', error);
    }
  };

  // Schema validation using Yup
  const validationSchema = Yup.object().shape({
    weight: Yup.number().required('Weight is required').min(30, 'Weight should be at least 30kg').max(200, 'Weight cannot exceed 200kg'),
    height: Yup.number().required('Height is required').min(100, 'Height should be at least 100cm').max(250, 'Height cannot exceed 250cm'),
    neck: Yup.number().required('Neck size is required').min(30, 'Neck size should be at least 30cm'),
    hip: Yup.number().required('Hip size is required').min(60, 'Hip size should be at least 60cm'),
    waist: Yup.number().required('Waist size is required').min(50, 'Waist size should be at least 50cm'),
    armhole: Yup.number().required('Armhole size is required').min(20, 'Armhole should be at least 20cm'),
    biceps: Yup.number().required('Biceps size is required').min(20, 'Biceps should be at least 20cm'),
    pantsWaist: Yup.number().required('Pants waist size is required').min(50, 'Pants waist should be at least 50cm'),
    crotch: Yup.number().required('Crotch size is required').min(20, 'Crotch should be at least 20cm'),
    thigh: Yup.number().required('Thigh size is required').min(40, 'Thigh should be at least 40cm'),
    pantsLength: Yup.number().required('Pants length is required').min(50, 'Pants length should be at least 50cm'),
  });

  const formik = useFormik({
    initialValues: {
      weight: '',
      height: '',
      neck: '',
      hip: '',
      waist: '',
      armhole: '',
      biceps: '',
      pantsWaist: '',
      crotch: '',
      thigh: '',
      pantsLength: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (user) {
          if (editMeasurementId) {
            // Update existing measurement
            const response = await axios.put(`${API_URL}/${editMeasurementId}`, { ...values, userId: user.userId });
            setMeasurements(measurements.map(m => (m.measurementId === editMeasurementId ? response.data : m)));
            setEditMeasurementId(null);
          } else {
            // Add new measurement
            const response = await axios.post(API_URL, { ...values, userId: user.userId });
            setMeasurements([...measurements, response.data]);
          }
          formik.resetForm();
        } else {
          console.error('No user found');
        }
      } catch (error) {
        console.error('Error adding/updating measurement:', error);
      }
    },
    enableReinitialize: true, // This allows the form to reset when the form values change (for editing)
  });

  // Set form values when editing a measurement
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
      setMeasurements(measurements.filter(m => m.measurementId !== measurementId));
    } catch (error) {
      console.error('Error deleting measurement:', error);
    }
  };

  return (
    <div>
      <h1>Measurement List</h1>
      <form onSubmit={formik.handleSubmit}>
        {/* Form fields */}
        <div>
          <label>Weight:</label>
          <input
            type="number"
            name="weight"
            value={formik.values.weight}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.weight && formik.errors.weight ? <div>{formik.errors.weight}</div> : null}
        </div>

        {/* Additional form fields for height, neck, hip, etc. */}
        <button type="submit">{editMeasurementId ? 'Update Measurement' : 'Add Measurement'}</button>
      </form>

      <ul>
        {measurements.map((measurement) => (
          <li key={measurement.measurementId}>
            {`Weight: ${measurement.weight}, Height: ${measurement.height}, Neck: ${measurement.neck}, Hip: ${measurement.hip}`}
            <button onClick={() => handleEdit(measurement)}>Edit</button>
            <button onClick={() => handleDelete(measurement.measurementId)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MeasureList;
