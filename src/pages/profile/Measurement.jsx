import React, { useState, useEffect } from "react";
import "./Measurement.scss";
import ProfileNav from "./ProfileNav";

const Measurement = () => {
  const [formData, setFormData] = useState({
    measurementId: 0,
    userId: 0,
    weight: 0,
    height: 0,
    neck: 0,
    chest: 0,
    waist: 0,
    hip: 0,
    shoulder: 0,
    sleeveLength: 0,
    biceps: 0,
    armhole: 0,
    jacketLength: 0,
    pantsWaist: 0,
    crotch: 0,
    thigh: 0,
    pantsLength: 0,
    age: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [measurementId, setMeasurementId] = useState(null);

  useEffect(() => {
    const fetchMeasurementData = async () => {
      const userID = localStorage.getItem("userID");
      if (!userID) {
        console.error("User ID not found in localStorage.");
        return;
      }

      try {
        const response = await fetch(
          `https://localhost:7194/api/Measurement/user/${userID}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            console.warn("Measurement data not found for this user.");
            setFormData((prevData) => ({ ...prevData, userId: userID }));
          } else {
            const errorResponse = await response.text();
            throw new Error(
              `Failed to fetch measurement data: ${errorResponse}`
            );
          }
        } else {
          const data = await response.json();
          setFormData(data);
          setMeasurementId(data.measurementId);
        }
      } catch (error) {
        console.error("Error fetching measurement data:", error);
      }
    };

    fetchMeasurementData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateFields = () => {
    const newErrors = {};
    const numberFields = [
      "chest",
      "waist",
      "hip",
      "neck",
      "armhole",
      "biceps",
      "shoulder",
      "sleeveLength",
      "jacketLength",
      "pantsWaist",
      "crotch",
      "thigh",
      "pantsLength",
    ];

    numberFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      } else if (
        isNaN(formData[field]) ||
        formData[field] < 0 ||
        formData[field] > 200
      ) {
        newErrors[field] = "Please enter a valid number (0-200)";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // return true if no errors
  };

  const handleSubmit = () => {
    if (validateFields()) {
      // If validation passes, post data to the API
      fetch("https://localhost:7194/api/Measurement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Success:", data);
          // Optionally reset the form or handle success feedback
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleEdit = async () => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      console.error("User ID not found in localStorage.");
      return;
    }

    if (isEditing) {
      try {
        const requestOptions = {
          method: measurementId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, userId: userID }),
        };
        const url = measurementId
          ? `https://localhost:7194/api/Measurement/${measurementId}`
          : "https://localhost:7194/api/Measurement";

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          const errorResponse = await response.text();
          throw new Error(
            `Failed to ${measurementId ? "update" : "create"} measurement data: ${errorResponse}`
          );
        }

        if (!measurementId) {
          const createdData = await response.json();
          setMeasurementId(createdData.measurementId);
          console.log("Measurement data created successfully");
        } else {
          console.log("Measurement data updated successfully");
        }
      } catch (error) {
        console.error("Error saving measurement data:", error);
      }
    }

    setIsEditing(!isEditing);
  };

  return (
    <div className="main-container">
      <ProfileNav />
      <div className="image-container">
        <img
          src="https://rundletailoring.com.au/files/2018/03/size-man-1024x1024.png"
          alt="Measurement Guide"
        />
      </div>
      <div className="form-container">
        <h1>Measurement</h1>
        <div className="form-content">
          <div className="measurements">
            {[
              { label: "Weight", name: "weight", placeholder: "kg" },
              { label: "Height", name: "height", placeholder: "cm" },
              { label: "Neck", name: "neck", placeholder: "cm" },
              { label: "Chest", name: "chest", placeholder: "cm" },
              { label: "Waist", name: "waist", placeholder: "cm" },
              { label: "Hip", name: "hip", placeholder: "cm" },
              { label: "Shoulder", name: "shoulder", placeholder: "cm" },
              {
                label: "Sleeve Length",
                name: "sleeveLength",
                placeholder: "cm",
              },
              { label: "Biceps", name: "biceps", placeholder: "cm" },
              { label: "Armhole", name: "armhole", placeholder: "cm" },
              {
                label: "Jacket Length",
                name: "jacketLength",
                placeholder: "cm",
              },
              { label: "Pants Waist", name: "pantsWaist", placeholder: "cm" },
              { label: "Crotch", name: "crotch", placeholder: "cm" },
              { label: "Thigh", name: "thigh", placeholder: "cm" },
              { label: "Pants Length", name: "pantsLength", placeholder: "cm" },
              { label: "Age", name: "age", placeholder: "years" },
            ].map(({ label, name, placeholder }) => (
              <div key={name} className="form-group">
                <label>{label}</label>
                <input
                  name={name}
                  type="number"
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  disabled={!isEditing}
                />
              </div>
            ))}
          </div>
        </div>
        <button type="button" onClick={handleEdit}>
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default Measurement;
