import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./UserProfile.scss";

const UserProfile = () => {
  const [avatar, setAvatar] = useState(
    "https://storage.googleapis.com/a1aa/image/RqwuZhRNHWqJIF94Z50tiNgZTK3iL4fa551tpuNLLghW42yJA.jpg"
  );
  const [userInfo, setUserInfo] = useState({
    id: "",
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
  const isAppointmentRoute = location.pathname === "/profile/appointment";
  const isFeedbackRoute = location.pathname === "/profile/feedback";

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
        console.log("Avatar preview URL:", e.target.result);
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
        `https://vesttour.xyz/api/User/${userID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage.");
          navigate("/signin", { state: { alert: "Please log in first." } });
          return;
        }

        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          navigate("/signin", {
            state: { alert: "Session expired. Please log in again." },
          });
          return;
        }

        const userID = localStorage.getItem("userID");
        if (!userID) {
          console.error("User ID is not available in localStorage.");
          return;
        }

        const response = await fetch(
          `https://vesttour.xyz/api/User/${userID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
        if (error.message.includes("401 Unauthorized")) {
          navigate("/signin", {
            state: { alert: "Session expired. Please log in again." },
          });
        } else {
          alert("Failed to fetch user data. Please try again later.");
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(currentDate);

  if (
    isChangePasswordRoute ||
    isOrderHistoryRoute ||
    isMeasurementRoute ||
    isAppointmentRoute ||
    isFeedbackRoute
  ) {
    return <Outlet />;
  }

  return (
    <div className="user-profile">
      <header className="user-profile__header">
        <div className="user-profile__header-content">
          <div className="user-profile__welcome">
            <h1 className="user-profile__title">Welcome, {userInfo.name}</h1>
            <p className="user-profile__date">{formattedDate}</p>
          </div>
          <div className="user-profile__actions">
            {/* <div className="user-profile__search">
              <input
                type="search"
                placeholder="Search"
                className="user-profile__search-input"
              />
            </div> */}
            <button className="user-profile__notification-btn">
              <i className="icon-bell"></i>
            </button>
            <div className="user-profile__avatar">
              <img src={avatar} alt={userInfo.name} />
            </div>
          </div>
        </div>
      </header>
      <div className="user-profile__content">
        <aside className="user-profile__sidebar">
          <nav className="user-profile__nav">
            <Link to="/" className="user-profile__nav-item">
              <i className="icon-home"></i>
              Home
            </Link>
            <Link to="/profile" className="user-profile__nav-item">
              <i className="icon-user"></i>
              Profile
            </Link>
            <Link to="/profile/measurement" className="user-profile__nav-item">
              <i className="icon-grid"></i>
              Measurement
            </Link>
            <Link
              to="/profile/order-history"
              className="user-profile__nav-item"
            >
              <i className="icon-shopping-bag"></i>
              Orders
            </Link>
            <Link
              to="/profile/change-password"
              className="user-profile__nav-item"
            >
              <i className="icon-lock"></i>
              Security
            </Link>
            <Link to="/profile/appointment" className="user-profile__nav-item">
              <i className="icon-settings"></i>
              Appointment
            </Link>
            <Link to="/profile/feedback" className="user-profile__nav-item">
              <i className="icon-feedback"></i>
              Feedback
            </Link>
          </nav>
        </aside>
        <main className="user-profile__main">
          <div className="user-profile__header-actions">
            <div>
              <h2 className="user-profile__section-title">Profile</h2>
              <p className="user-profile__section-description">
                Manage your profile information and preferences
              </p>
            </div>
            {!isEditing ? (
              <button className="user-profile__edit-btn" onClick={handleEdit}>
                Edit Profile
              </button>
            ) : (
              <div className="user-profile__edit-actions">
                <button
                  className="user-profile__cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="user-profile__save-btn"
                  onClick={handleSubmit}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
          <div className="user-profile__info">
            <div className="user-profile__avatar-section">
              <div className="user-profile__avatar-large">
                <img src={avatar} alt={userInfo.name} />
              </div>
              <div className="user-profile__avatar-info">
                <h3 className="user-profile__name">{userInfo.name}</h3>
                <p className="user-profile__email">{userInfo.email}</p>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="user-profile__avatar-input"
                />
                <label
                  htmlFor="avatar-upload"
                  className="user-profile__avatar-btn"
                >
                  Change Avatar
                </label>
              </div>
            </div>
            <form className="user-profile__form">
              <div className="user-profile__form-group">
                <label htmlFor="full-name" className="user-profile__label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="full-name"
                  className="user-profile__input"
                  value={userInfo.name}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, name: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="user-profile__form-group">
                <label htmlFor="email" className="user-profile__label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="user-profile__input"
                  value={userInfo.email}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, email: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="user-profile__form-group">
                <label htmlFor="gender" className="user-profile__label">
                  Gender
                </label>
                <select
                  id="gender"
                  className="user-profile__select"
                  value={userInfo.gender}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, gender: e.target.value })
                  }
                  disabled={!isEditing}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="user-profile__form-group">
                <label htmlFor="phone" className="user-profile__label">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="user-profile__input"
                  value={userInfo.phone}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, phone: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="user-profile__form-group">
                <label htmlFor="address" className="user-profile__label">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="user-profile__input"
                  value={userInfo.address}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, address: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="user-profile__form-group">
                <label htmlFor="dob" className="user-profile__label">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  className="user-profile__input"
                  value={userInfo.dob}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, dob: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
