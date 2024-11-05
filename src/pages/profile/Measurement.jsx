import React, { useState } from "react";
import "./Measurement.scss";
import ProfileNav from "./ProfileNav";

const Measurement = () => {
  const [formData, setFormData] = useState({
    chest: "",
    waist: "",
    hip: "",
    neck: "",
    armhole: "",
    biceps: "",
    shoulder: "",
    sleeveLength: "",
    jacketLength: "",
    pantsWaist: "",
    crotch: "",
    thigh: "",
    pantsLength: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

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
      } else if (isNaN(formData[field]) || formData[field] < 0 || formData[field] > 200) {
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

  const handleEdit = () => {
    if (isEditing) {
      handleSubmit(); // Call submit function if currently editing
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
            <h2>Measurements Table 1</h2>
            {["chest", "waist", "hip", "neck"].map((field) => (
              <div className="form-group" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  name={field}
                  type="number"
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder="cm"
                  disabled={!isEditing}
                />
                {errors[field] && <span className="error">{errors[field]}</span>} {/* Error displayed here */}
              </div>
            ))}
          </div>

          <div className="measurements">
            <h2>Measurements Table 2</h2>
            {["armhole", "biceps", "shoulder", "sleeveLength", "jacketLength"].map((field) => (
              <div className="form-group" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  name={field}
                  type="number"
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder="cm"
                  disabled={!isEditing}
                />
                {errors[field] && <span className="error">{errors[field]}</span>} {/* Error displayed here */}
              </div>
            ))}
          </div>
        </div>

        <div className="form-content">
          <div className="measurements">
            <h2>Measurements Table 3</h2>
            {["pantsWaist", "crotch", "thigh", "pantsLength"].map((field) => (
              <div className="form-group" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  name={field}
                  type="number"
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder="cm"
                  disabled={!isEditing}
                />
                {errors[field] && <span className="error">{errors[field]}</span>} {/* Error displayed here */}
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
