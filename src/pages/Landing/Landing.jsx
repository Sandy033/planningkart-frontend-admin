import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../../store/slices/authSlice';
import './Landing.css';

const Landing = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user) {
            const userRole = user.role.toUpperCase();
            if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN' || userRole === 'SUPER_ADMIN') {
                navigate('/admin');
            } else {
                // If already logged in but not admin, stay here or maybe show error? 
                // For now, let's just stay here, but maybe clear auth if they shouldn't be here?
                // Or just redirect to home which is here.
            }
        }
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
        const resultAction = await dispatch(login(formData));

        if (login.fulfilled.match(resultAction)) {
            const user = resultAction.payload.user;
            const userRole = user.role.toUpperCase();
            if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN' || userRole === 'SUPER_ADMIN') {
                navigate('/admin');
            }
        }
    };

    return (
        <div className="landing">
            <div className="container landing-container">
                <div className="landing-text">
                    <h1 className="landing-title fade-in">
                        <span>Planning</span>Kart Admin
                    </h1>
                    <p className="landing-subtitle fade-in">
                        Manage events and categories with ease
                    </p>
                </div>

                <div className="auth-card card-glass slide-in-right">
                    <div className="auth-header">
                        <h2>Welcome Back</h2>
                        <p>Login to your account</p>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
