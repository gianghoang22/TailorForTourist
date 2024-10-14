import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom"; // Import Link, Outlet, and useLocation for routing
import "./UserProfile.scss";

const UserProfile = () => {
  const [avatar, setAvatar] = useState(
    "https://storage.googleapis.com/a1aa/image/RqwuZhRNHWqJIF94Z50tiNgZTK3iL4fa551tpuNLLghW42yJA.jpg"
  );

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

  // User information
  const [userInfo, setUserInfo] = useState({
    fullName: "Miriam Michael",
    email: "miriam@example.com",
    phone: "(123) 456-7890",
    address: "123 Main Street, San Francisco, California",
    city: "San Francisco",
    state: "California",
    zip: "94101",
    country: "USA",
    website: "www.example.com",
  });

  const location = useLocation();
  const isChangePasswordRoute =
    location.pathname === "/profile/change-password";
  const isOrderHistoryRoute = location.pathname === "/profile/order-history";
  const isMeasurementRoute = location.pathname === "/profile/measurement";
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Update the user information here
    console.log("Update user information:", userInfo);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="container">
      {!isChangePasswordRoute &&
        !isOrderHistoryRoute &&
        !isMeasurementRoute && (
          <div>
            <div className="text-center mb-8">
              <h1 className="title">Profile</h1>
              <p className="description">
                The Profile page is your digital hub, where you can fine-tune
                your experience. Here's a closer look at the settings you can
                expect to find in your profile page.
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
                  <h2 className="name">{userInfo.fullName}</h2>
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
                            value={userInfo.fullName}
                            onChange={(event) =>
                              setUserInfo({
                                ...userInfo,
                                fullName: event.target.value,
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
                          <label>City:</label>
                          <input
                            type="text"
                            value={userInfo.city}
                            onChange={(event) =>
                              setUserInfo({
                                ...userInfo,
                                city: event.target.value,
                              })
                            }
                            style={{ width: "100%", margin: "10px 0" }}
                          />
                        </div>
                        <div className="form-group">
                          <label>State:</label>
                          <input
                            type="text"
                            value={userInfo.state}
                            onChange={(event) =>
                              setUserInfo({
                                ...userInfo,
                                state: event.target.value,
                              })
                            }
                            style={{ width: "100%", margin: "10px 0" }}
                          />
                        </div>
                        <div className="form-group">
                          <label>Zip:</label>
                          <input
                            type="text"
                            value={userInfo.zip}
                            onChange={(event) =>
                              setUserInfo({
                                ...userInfo,
                                zip: event.target.value,
                              })
                            }
                            style={{ width: "100%", margin: "10px 0" }}
                          />
                        </div>
                        <div className="form-group">
                          <label>Country:</label>
                          <input
                            type="text"
                            value={userInfo.country}
                            onChange={(event) =>
                              setUserInfo({
                                ...userInfo,
                                country: event.target.value,
                              })
                            }
                            style={{ width: "100%", margin: "10px 0" }}
                          />
                        </div>
                        <div className="form-group">
                          <label>Website:</label>
                          <input
                            type="url"
                            value={userInfo.website}
                            onChange={(event) =>
                              setUserInfo({
                                ...userInfo,
                                website: event.target.value,
                              })
                            }
                            style={{ width: "100%", margin: "10px 0" }}
                          />
                        </div>
                        <div className="button-group">
                          <button type="submit" className="save-btn">
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <table className="profile-table">
                      <tbody>
                        <tr>
                          <td className="label">Full Name</td>
                          <td className="value">{userInfo.fullName}</td>
                        </tr>
                        <tr>
                          <td className="label">Email</td>
                          <td className="value">{userInfo.email}</td>
                        </tr>
                        <tr>
                          <td className="label">Phone</td>
                          <td className="value">{userInfo.phone}</td>
                        </tr>
                        <tr>
                          <td className="label">Address</td>
                          <td className="value">{userInfo.address}</td>
                        </tr>
                        <tr>
                          <td className="label">City</td>
                          <td className="value">{userInfo.city}</td>
                        </tr>
                        <tr>
                          <td className="label">State</td>
                          <td className="value">{userInfo.state}</td>
                        </tr>
                        <tr>
                          <td className="label">Zip</td>
                          <td className="value">{userInfo.zip}</td>
                        </tr>
                        <tr>
                          <td className="label">Country</td>
                          <td className="value">{userInfo.country}</td>
                        </tr>
                        <tr>
                          <td className="label">Website</td>
                          <td className="value">{userInfo.website}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      <Outlet />
    </div>
  );
};

export default UserProfile;
