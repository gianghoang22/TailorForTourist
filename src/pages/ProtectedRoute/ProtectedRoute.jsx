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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      </div>
    );
  }

  return element;
};

export default ProtectedRoute;
