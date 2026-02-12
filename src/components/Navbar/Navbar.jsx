import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import './Navbar.css';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
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
                        <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
