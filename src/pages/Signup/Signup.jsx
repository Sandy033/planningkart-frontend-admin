import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup, signupOrganizer, clearError } from '../../store/slices/authSlice';
import '../Login/Login.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'organizer',
        phoneNumber: '',
        dateOfBirth: '',
        // Organization fields
        organizationName: '',
        contactEmail: '',
        contactPhone: '',
        description: '',
        websiteUrl: '',
        logoUrl: ''
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

        const { confirmPassword, role, ...signupData } = formData;

        let resultAction;
        if (role === 'organizer') {
            // Validate required organizer fields
            if (!signupData.organizationName || !signupData.contactEmail) {
                setValidationError('Organization Name and Contact Email are required');
                return;
            }
            resultAction = await dispatch(signupOrganizer(signupData));
        } else {
            resultAction = await dispatch(signup({ ...signupData, name: `${formData.firstName} ${formData.lastName}` }));
        }

        if (signupOrganizer.fulfilled.match(resultAction) || signup.fulfilled.match(resultAction)) {
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

                        {formData.role === 'organizer' && (
                            <>
                                <hr className="my-4" />
                                <h4>Organization Details</h4>
                                <div className="form-group">
                                    <label className="form-label">Organization Name</label>
                                    <input
                                        type="text"
                                        name="organizationName"
                                        className="form-input"
                                        value={formData.organizationName}
                                        onChange={handleChange}
                                        placeholder="Organization Name"
                                        required
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label className="form-label">Contact Email</label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            className="form-input"
                                            value={formData.contactEmail}
                                            onChange={handleChange}
                                            placeholder="Contact Email"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label className="form-label">Contact Phone</label>
                                        <input
                                            type="tel"
                                            name="contactPhone"
                                            className="form-input"
                                            value={formData.contactPhone}
                                            onChange={handleChange}
                                            placeholder="Contact Phone"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Website URL</label>
                                    <input
                                        type="url"
                                        name="websiteUrl"
                                        className="form-input"
                                        value={formData.websiteUrl}
                                        onChange={handleChange}
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        className="form-input"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Tell us about your organization"
                                        rows="3"
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <span className="link" onClick={() => navigate('/login')}>
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
