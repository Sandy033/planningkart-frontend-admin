import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && user?.role) {
        const userRole = user.role.toUpperCase();
        const reqRole = requiredRole.toUpperCase();

        // Check if roles match, treating SUPER_ADMIN as ADMIN
        const isAdmin = userRole === 'ADMIN' || userRole === 'ROLE_ADMIN' || userRole === 'SUPER_ADMIN';
        const requiresAdmin = reqRole === 'ADMIN' || reqRole === 'ROLE_ADMIN';

        if (requiresAdmin && !isAdmin) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
