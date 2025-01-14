import React, { useState } from "react";
import ProfileNav from "./ProfileNav";
import "./ChangePassword.scss";

const ChangePassword = () => {
  const [passwordData, setPasswordData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const userId = localStorage.getItem("userID");
    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    // Create request payload with the three required query parameters
    const requestPayload = {
      email: passwordData.email.trim(),
      oldPassword: passwordData.oldPassword.trim(),
      newPassword: passwordData.newPassword.trim(),
      // Note: We don't include id here as it's in the URL path
    };

    try {
      // The userId goes in the URL path, not in the request body
      const response = await fetch(
        `https://vesttour.xyz/api/User/${userId}/update-pass?email=${encodeURIComponent(requestPayload.email)}&oldPassword=${encodeURIComponent(requestPayload.oldPassword)}&newPassword=${encodeURIComponent(requestPayload.newPassword)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          // No body needed since we're using query parameters
        }
      );

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.errors) {
            errorMessage = Object.values(errorData.errors).flat().join(", ");
          } else {
            errorMessage =
              errorData.message ||
              errorData.title ||
              "Failed to change password";
          }
        } catch {
          errorMessage =
            responseText || `Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      setSuccess("Password changed successfully!");
      setPasswordData({ email: "", oldPassword: "", newPassword: "" });
      setConfirmPassword("");
    } catch (error) {
      console.error("Password change error:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      <ProfileNav />
      <div className="change-password-page">
        <div className="change-password-container">
          <h3 className="section-title">Change Password</h3>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <form className="change-password-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={passwordData.email}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="oldPassword">Current Password:</label>
              <input
                type="password"
                id="oldPassword"
                className="form-input"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                className="form-input"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password:</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
