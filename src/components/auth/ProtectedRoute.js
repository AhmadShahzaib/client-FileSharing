import { Navigate } from 'react-router-dom';
const API_URL = 'http://localhost:5001';
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 