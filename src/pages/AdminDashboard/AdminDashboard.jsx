import React, { useState, useEffect } from 'react';
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

    const { items: categories, loading: categoriesLoading } = useSelector(state => state.categories);
    const { items: events, loading: eventsLoading } = useSelector(state => state.events);

    // Use a ref to guarantee we only trigger the fetch once per component mount
    const hasFetched = React.useRef(false);

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            if (categories.length === 0) dispatch(fetchCategories());
            if (events.length === 0) dispatch(fetchEvents());
        }
    }, [dispatch, categories.length, events.length]);

    return (
        <div className="dashboard">
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Admin Dashboard</h1>
                    <p>Manage event categories and moderate events</p>
                </div>

                {/* Mobile: native dropdown */}
                <select
                    className="dashboard-tabs-mobile"
                    value={activeTab}
                    onChange={e => setActiveTab(e.target.value)}
                >
                    <option value="categories">Event Categories</option>
                    <option value="events">Event Management</option>
                </select>

                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('categories')}
                    >
                        Event Categories
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
                        onClick={() => setActiveTab('events')}
                    >
                        Event Management
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
