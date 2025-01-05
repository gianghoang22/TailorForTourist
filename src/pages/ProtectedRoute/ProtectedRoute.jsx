import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles, allowGuestAccess }) => {
  const userID = localStorage.getItem("userID");
  const roleID = localStorage.getItem("roleID");

  const isLoggedIn = !!userID;

  // If guest access is allowed, no need to check authorization
  if (allowGuestAccess) {
    return element;
  }

  // Check login status for non-guest routes
  if (!isLoggedIn) {
    return <Navigate to="/signin" />;
  }

  // Check authorization for logged-in users
  const isAuthorized = allowedRoles.includes(roleID);
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      </div>
    );
  }

  return element;
};

export default ProtectedRoute;
