// components/common/ProtectedAdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Check if user has admin role
  if (!['admin', 'superadmin'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedAdminRoute; 