import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user) {
            const redirectPath = user.role === 'admin' ? '/admin' : '/organizer';
            navigate(redirectPath);
        }
    }, [isAuthenticated, user, navigate]);

    return (
        <div className="landing">
            <div className="landing-hero">
                <div className="container">
                    <h1 className="landing-title fade-in">
                        <span>Planning</span>Kart Admin Console
                    </h1>
                    <p className="landing-subtitle fade-in">
                        Manage events and categories with ease
                    </p>

                    <div className="user-type-cards">
                        <div className="user-type-card card-glass slide-in-left" onClick={() => navigate('/login?role=admin')}>
                            <div className="card-icon">👨‍💼</div>
                            <h3>Admin</h3>
                            <p>Manage event categories and promote/demote events</p>
                            <button className="btn btn-primary">Login as Admin</button>
                        </div>

                        <div className="user-type-card card-glass slide-in-right" style={{ cursor: 'default' }}>
                            <div onClick={() => navigate('/login?role=organizer')} style={{ cursor: 'pointer' }}>
                                <div className="card-icon">🎯</div>
                                <h3>Organizer</h3>
                                <p>Create and manage your events</p>
                                <button className="btn btn-accent">Login as Organizer</button>
                            </div>
                            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                <span
                                    className="link"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate('/signup');
                                    }}
                                    style={{ fontSize: '0.9rem', color: '#fff', textDecoration: 'underline', position: 'relative', zIndex: 10 }}
                                >
                                    New Organizer? Sign up here
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
