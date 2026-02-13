import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role) {
        const userRole = user.role.toUpperCase();
        const reqRole = requiredRole.toUpperCase();

        // Check if roles match, treating SUPER_ADMIN as ADMIN
        const isAdmin = userRole === 'ADMIN' || userRole === 'ROLE_ADMIN' || userRole === 'SUPER_ADMIN';
        const requiresAdmin = reqRole === 'ADMIN' || reqRole === 'ROLE_ADMIN';

        const rolesMatch = (isAdmin && requiresAdmin) || (userRole === reqRole);

        if (!rolesMatch) {
            // Redirect to appropriate dashboard based on user role
            const redirectPath = isAdmin ? '/admin' : '/organizer';
            return <Navigate to={redirectPath} replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
