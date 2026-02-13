import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login, clearError } from '../../store/slices/authSlice';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
    const suggestedRole = searchParams.get('role');

    useEffect(() => {
        // Commenting out auto-redirect on mount to avoid conflicts with handleSubmit logic
        // and potential infinite redirect loops if role case mismatches occur here.
        // if (isAuthenticated && user) {
        //     const redirectPath = user.role === 'admin' ? '/admin' : '/organizer';
        //     navigate(redirectPath);
        // }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Attempting login with:', formData.email);

        const resultAction = await dispatch(login(formData));
        console.log('Login result action:', resultAction);

        if (login.fulfilled.match(resultAction)) {
            const user = resultAction.payload.user;
            console.log('Login successful. User:', user);
            console.log('User Role:', user.role);

            const userRole = user.role.toUpperCase();
            if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN' || userRole === 'SUPER_ADMIN') {
                console.log('Redirecting to /admin');
                navigate('/admin');
            } else if (userRole === 'ORGANIZER' || userRole === 'ROLE_ORGANIZER' || userRole === 'EVENT_ORGANIZER') {
                console.log('Redirecting to /organizer');
                navigate('/organizer');
            } else {
                // Fallback
                console.log('Unknown role, redirecting to /');
                navigate('/');
            }
        } else {
            console.error('Login failed:', resultAction.error);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card card-glass">
                    <div className="auth-header">
                        <h2>Welcome Back</h2>
                        {suggestedRole && (
                            <p className="role-badge">Logging in as {suggestedRole}</p>
                        )}
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Don't have an account?{' '}
                            <span className="link" onClick={() => navigate('/signup')}>
                                Sign up
                            </span>
                        </p>
                        <p>
                            <span className="link" onClick={() => navigate('/')}>
                                Back to home
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
