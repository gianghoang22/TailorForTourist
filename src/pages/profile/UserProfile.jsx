import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./UserProfile.scss";

const UserProfile = () => {
  const [avatar, setAvatar] = useState(
    "https://storage.googleapis.com/a1aa/image/RqwuZhRNHWqJIF94Z50tiNgZTK3iL4fa551tpuNLLghW42yJA.jpg"
  );
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
    roleId: "",
  });
  const [originalUserInfo, setOriginalUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isChangePasswordRoute =
    location.pathname === "/profile/change-password";
  const isOrderHistoryRoute = location.pathname === "/profile/order-history";
  const isMeasurementRoute = location.pathname === "/profile/measurement";

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUserInfo(originalUserInfo);
    setIsEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userID = localStorage.getItem("userID");
    if (!userID) {
      console.error("User ID not found in localStorage.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7194/api/User/${userID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          `Failed to update user info: ${errorResponse.message || response.statusText}`
        );
      }

      setIsEditing(false);
      console.log("User information updated successfully");
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage.");
        navigate("/signin", { state: { alert: "Please log in first." } });
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          navigate("/signin", {
            state: { alert: "Session expired. Please log in again." },
          });
          return;
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        navigate("/signin", {
          state: { alert: "Invalid token. Please log in again." },
        });
        return;
      }

      const userID = localStorage.getItem("userID");
      if (!userID) {
        console.error("User ID is not available in localStorage.");
        return;
      }

      try {
        const response = await fetch(
          `https://localhost:7194/api/User/${userID}`
        );
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(
            `Failed to fetch user data: ${errorResponse.message || response.statusText}`
          );
        }
        const data = await response.json();
        setUserInfo({
          id: data.userId,
          name: data.name,
          email: data.email,
          gender: data.gender,
          phone: data.phone,
          address: data.address,
          dob: data.dob,
          roleId: data.roleId,
        });
        setOriginalUserInfo({
          id: data.userId,
          name: data.name,
          email: data.email,
          gender: data.gender,
          phone: data.phone,
          address: data.address,
          dob: data.dob,
          roleId: data.roleId,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="container">
      {/* Only render this section if not on the specified routes */}
      {!isChangePasswordRoute &&
        !isOrderHistoryRoute &&
        !isMeasurementRoute && (
          <div>
            <div className="text-center mb-8">
              <h1 className="title">Profile</h1>
              <p className="description">
                The Profile page is your digital hub, where you can fine-tune
                your experience.
              </p>
            </div>
            <div className="profile-container">
              <div className="profile-sidebar">
                <div className="text-center mb-4">
                  <img
                    id="avatar"
                    alt="Profile"
                    className="avatar"
                    src={avatar}
                  />
                  <h2 className="name">{userInfo.name}</h2>
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <button
                    className="edit-avatar-btn"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    Edit Avatar
                  </button>
                </div>
                <ul
                  className="tab-list"
                  style={{ flexDirection: "column", marginLeft: "80px" }}
                >
                  <li>
                    <Link to="/" className="active">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile/measurement">Measurement</Link>
                  </li>
                  <li>
                    <Link to="/profile/order-history">Orders</Link>
                  </li>
                  <li>
                    <Link to="/profile/change-password">Security</Link>
                  </li>
                </ul>
              </div>
              <div className="profile-content">
                <div className="profile-details">
                  <h3 className="section-title">
                    User Information
                    {isEditing ? (
                      <button className="cancel-btn" onClick={handleCancel}>
                        Cancel
                      </button>
                    ) : (
                      <button className="edit-btn" onClick={handleEdit}>
                        Edit
                      </button>
                    )}
                  </h3>
                  {isEditing ? (
                    <div className="form-container">
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label>Full Name:</label>
                          <input
                            type="text"
                            value={userInfo.name}
                            onChange={(event) =>
                              setUserInfo({
                                ...userInfo,
                                name: event.target.value,
                              })
                            }
                            style={{ width: "100%", margin: "10px 0" }}
                          />
                        </div>
                        <div className="form-group">
                          <label>Email:</label>
                          <input
                            type="email"
                            value={userInfo.email}
                            onChange={(event) =>
                              setUserInfo({
                                ...userInfo,
                                email: event.target.value,
                              })
                            }
                            style={{ width: "100%", margin: "10px 0" }}
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone:</label>
                          <input
                            type="tel"
                            value={userInfo.phone}
                            onChange={(event) =>
                              setUserInfo({
                                ...userInfo,
                                phone: event.target.value,
                              })
                            }
                            style={{ width: "100%", margin: "10px 0" }}
                          />
                        </div>
                        <div className="form-group">
                          <label>Address:</label>
                          <input
                            type="text"
                            value={userInfo.address}
                            onChange={(event) =>
                              setUserInfo({
                                ...userInfo,
                                address: event.target.value,
                              })
                            }
                            style={{ width: "100%", margin: "10px 0" }}
                          />
                        </div>
                        <div className="form-group">
                          <label>Gender:</label>
                          <select
                            value={userInfo.gender}
                            onChange={(event) =>
                              setUserInfo({
                                ...userInfo,
                                gender: event.target.value,
                              })
                            }
                            style={{ width: "100%", margin: "10px 0" }}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Date of Birth:</label>
                          <input
                            type="date"
                            value={userInfo.dob}
                            onChange={(event) =>
                              setUserInfo({
                                ...userInfo,
                                dob: event.target.value,
                              })
                            }
                            style={{ width: "100%", margin: "10px 0" }}
                          />
                        </div>
                        <button type="submit" className="submit-btn">
                          Save
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="info-container">
                      <p>
                        <strong>Email:</strong> {userInfo.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {userInfo.phone}
                      </p>
                      <p>
                        <strong>Address:</strong> {userInfo.address}
                      </p>
                      <p>
                        <strong>Gender:</strong> {userInfo.gender}
                      </p>
                      <p>
                        <strong>Date of Birth:</strong> {userInfo.dob}
                      </p>
                    </div>
                  )}
                </div>
                {/* Render the Outlet for child routes */}
                <Outlet />
              </div>
            </div>
          </div>
        )}
      {/* This part renders when on child routes */}
      {isChangePasswordRoute && <Outlet />}
      {isOrderHistoryRoute && <Outlet />}
      {isMeasurementRoute && <Outlet />}
    </div>
  );
};

export default UserProfile;
