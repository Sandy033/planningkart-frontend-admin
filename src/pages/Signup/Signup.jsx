import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup, clearError } from '../../store/slices/authSlice';
import '../Landing/Landing.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'admin', // Defaulting to admin or user, since organizer is gone. Or maybe just remove role if backend handles it? Let's keep it clean.
        phoneNumber: '',
        dateOfBirth: '',
    });

    const [validationError, setValidationError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user) {
            // const redirectPath = user.role === 'admin' ? '/admin' : '/organizer';
            // navigate(redirectPath);
            // Commenting out auto-redirect to allow manual navigation control after signup
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
        setValidationError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setValidationError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setValidationError('Password must be at least 8 characters');
            return;
        }

        const { confirmPassword, ...signupData } = formData;

        // Ensure role is admin or whatever is appropriate for this open signup.
        // If we only want admins, we can force it here.
        // Assuming 'user' or 'admin' depending on requirements.
        // Since this is an admin console, maybe we are signing up admins?
        // Or maybe just generic users who need approval.
        // Sticking to 'admin' as role if that's the intent of the app now.
        // But the Implementation Plan said "Default all signups to the standard signup thunk".

        const resultAction = await dispatch(signup({ ...signupData, name: `${formData.firstName} ${formData.lastName}` }));

        if (signup.fulfilled.match(resultAction)) {
            navigate('/');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container" style={{ maxWidth: '800px' }}>
                <div className="auth-card card-glass">
                    <div className="auth-header">
                        <h2>Create Account</h2>
                        <p>Join PlanningKart today</p>
                    </div>

                    {(error || validationError) && (
                        <div className="error-message">
                            {validationError || error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    className="form-input"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    required
                                />
                            </div>
                            <div className="col-md-6 form-group">
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    className="form-input"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    required
                                />
                            </div>
                        </div>

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

                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                            <div className="col-md-6 form-group">
                                <label className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-input"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    className="form-input"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                />
                            </div>
                            <div className="col-md-6 form-group">
                                <label className="form-label">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    className="form-input"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* <div className="form-group">
                            <label className="form-label">I am a...</label>
                            <select
                                name="role"
                                className="form-select"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="organizer">Event Organizer</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div> */}



                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <span className="link" onClick={() => navigate('/')}>
                                Login
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

export default Signup;
