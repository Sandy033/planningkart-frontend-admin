import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../components/Navbar/Navbar';
import { fetchCategories } from '../../store/slices/categorySlice';
import { fetchEvents } from '../../store/slices/eventSlice';
import CategoryManager from '../../components/CategoryManager/CategoryManager';
import EventManager from '../../components/EventManager/EventManager';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('categories');
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchEvents());
    }, [dispatch]);

    return (
        <div className="dashboard">
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Admin Dashboard</h1>
                    <p>Manage event categories and moderate events</p>
                </div>

                <div className="dashboard-tabs">
                    <button
                        className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('categories')}
                    >
                        📁 Event Categories
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
                        onClick={() => setActiveTab('events')}
                    >
                        🎯 Event Management
                    </button>
                </div>

                <div className="dashboard-content">
                    {activeTab === 'categories' && <CategoryManager />}
                    {activeTab === 'events' && <EventManager />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
