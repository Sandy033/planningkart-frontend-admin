import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import './Navbar.css';

const Navbar = () => {
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        dispatch(logout());
        navigate('/');
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
                            <div className="user-info-nav">
                                <span className="user-email">{user.email}</span>
                                <span className="user-role">{user.role}</span>
                            </div>
                            <button className="btn btn-outline btn-sm" onClick={handleLogoutClick}>
                                Logout
                            </button>
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
        </>
    );
};

export default Navbar;
