
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

 
  if (!user) {
    return <Navigate to="/login" replace />;
  }


  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};


export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }


  if (user) {
    switch(user.role) {
      case 'Admin':
        return <Navigate to="/Admin/Dashboard" replace />;
      case 'Owner':
        return <Navigate to="/Owner/Dashboard" replace />;
      case 'Marketer':
        return <Navigate to="/Marketer/Dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};