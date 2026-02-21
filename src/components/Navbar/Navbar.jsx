import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import ResetPasswordModal from '../ResetPasswordModal/ResetPasswordModal';
import './Navbar.css';

const Navbar = () => {
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
        setShowDropdown(false);
    };

    const confirmLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleUpdatePasswordClick = () => {
        setShowResetPassword(true);
        setShowDropdown(false);
    };

    // Helper to get initials for the user icon
    const getInitials = (email) => {
        if (!email) return 'U';
        return email.charAt(0).toUpperCase();
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo" onClick={() => navigate('/')}>
                        <span>Planning</span>Kart
                    </div>

                    {user && (
                        <div className="navbar-right">
                            <div className="user-menu-container" ref={dropdownRef}>
                                <div
                                    className="user-icon-btn"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    title={user.email}
                                >
                                    {getInitials(user.email)}
                                </div>

                                {showDropdown && (
                                    <div className="user-dropdown">
                                        <div className="dropdown-header">
                                            <span className="dropdown-email">{user.email}</span>
                                            <span className="dropdown-role">{user.role}</span>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item" onClick={handleUpdatePasswordClick}>
                                            <svg xmlns="http://www.w3.org/-svg-2000" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                            Update Password
                                        </button>
                                        <button className="dropdown-item text-danger" onClick={handleLogoutClick}>
                                            <svg xmlns="http://www.w3.org/-svg-2000" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <ConfirmationModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={confirmLogout}
                title="Confirm Logout"
                message="Are you sure you want to logout?"
                confirmText="Logout"
                cancelText="Cancel"
                isDanger={true}
            />

            <ResetPasswordModal
                isOpen={showResetPassword}
                onClose={() => setShowResetPassword(false)}
            />
        </>
    );
};

export default Navbar;
