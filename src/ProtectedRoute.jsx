import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}