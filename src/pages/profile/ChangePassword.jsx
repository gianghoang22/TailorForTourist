import React from "react";
import ProfileNav from "./ProfileNav"; // Navigation component
import "./ChangePassword.scss"; // SCSS for styling

const ChangePassword = () => {
  return (
    <div>
      <ProfileNav />{" "}
      {/* Move ProfileNav to the top, outside of the container */}
      <div className="change-password-page">
        <div className="change-password-container">
          <h3 className="section-title">Change Password</h3>
          <form className="change-password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password:</label>
              <input
                type="password"
                id="currentPassword"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password:</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              {" "}
              Change Password{" "}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
