import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        const redirectPath = user?.role === 'admin' ? '/admin' : '/organizer';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
