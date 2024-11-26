import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles, allowGuestAccess }) => {
  const userID = localStorage.getItem("userID");
  const roleID = localStorage.getItem("roleID");

  const isLoggedIn = !!userID;
  const isAuthorized = allowedRoles.includes(roleID);

  if (!isLoggedIn) {
    // Allow access if guest access is enabled
    if (allowGuestAccess) {
      return element;
    }
    return <Navigate to="/signin" />;
  }

  if (isLoggedIn && !isAuthorized) {
    return <Navigate to="/" />; // Redirect to home or an unauthorized page
  }

  return element;
};

export default ProtectedRoute;
