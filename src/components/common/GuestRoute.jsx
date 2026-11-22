// components/common/GuestRoute.jsx
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) localStorage.removeItem('redirectPath');
  }, [user]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Return users to their protected destination after login.
  if (user) {
    const redirectPath = localStorage.getItem('redirectPath');
    const destination = redirectPath?.startsWith('/') && !redirectPath.startsWith('//')
      ? redirectPath
      : '/';
    return <Navigate to={destination} replace />;
  }
  
  return children;
};

export default GuestRoute;