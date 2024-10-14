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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = () => {
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
            <div className="form-group">
              <label>Chest</label>
              <input
                name="chest"
                type="number"
                value={formData.chest}
                onChange={handleChange}
                placeholder="cm"
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Waist</label>
              <input
                name="waist"
                type="number"
                value={formData.waist}
                onChange={handleChange}
                placeholder="cm"
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Hip</label>
              <input
                name="hip"
                type="number"
                value={formData.hip}
                onChange={handleChange}
                placeholder="cm"
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Neck</label>
              <input
                name="neck"
                type="number"
                value={formData.neck}
                onChange={handleChange}
                placeholder="cm"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="measurements">
            <h2>Measurements Table 2</h2>
            <div className="form-group">
              <label>Armhole</label>
              <input
                name="armhole"
                type="number"
                value={formData.armhole}
                onChange={handleChange}
                placeholder="cm"
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Biceps</label>
              <input
                name="biceps"
                type="number"
                value={formData.biceps}
                onChange={handleChange}
                placeholder="cm"
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Shoulder</label>
              <input
                name="shoulder"
                type="number"
                value={formData.shoulder}
                onChange={handleChange}
                placeholder="cm"
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Sleeve Length</label>
              <input
                name="sleeveLength"
                type="number"
                value={formData.sleeveLength}
                onChange={handleChange}
                placeholder="cm"
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Jacket Length</label>
              <input
                name="jacketLength"
                type="number"
                value={formData.jacketLength}
                onChange={handleChange}
                placeholder="cm"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        <div className="form-content">
          <div className="measurements">
            <h2>Measurements Table 3</h2>
            <div className="form-group">
              <label>Pants Waist</label>
              <input
                name="pantsWaist"
                type="number"
                value={formData.pantsWaist}
                onChange={handleChange}
                placeholder="cm"
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Crotch</label>
              <input
                name="crotch"
                type="number"
                value={formData.crotch}
                onChange={handleChange}
                placeholder="cm"
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Thigh</label>
              <input
                name="thigh"
                type="number"
                value={formData.thigh}
                onChange={handleChange}
                placeholder="cm"
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Pants Length</label>
              <input
                name="pantsLength"
                type="number"
                value={formData.pantsLength}
                onChange={handleChange}
                placeholder="cm"
                disabled={!isEditing}
              />
            </div>
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
