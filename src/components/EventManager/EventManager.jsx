import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleEventStatus } from '../../store/slices/eventSlice';
import EventList from '../EventList/EventList';
import './EventManager.css';

const EventManager = () => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useDispatch();
    const { items: events, loading } = useSelector((state) => state.events);
    const { items: categories } = useSelector((state) => state.categories);

    const handleToggleStatus = async (event) => {
        await dispatch(toggleEventStatus({ id: event.id, isActive: !event.isActive }));
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category?.name || 'Unknown';
    };

    const filteredEvents = events.filter(event => {
        const matchesFilter = filter === 'all' ||
            (filter === 'active' && event.isActive) ||
            (filter === 'inactive' && !event.isActive);
        const matchesSearch = event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="event-manager">
            <div className="manager-header">
                <h3>Event Management</h3>
            </div>

            <div className="event-filters">
                <input
                    type="text"
                    className="form-input search-input"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="filter-buttons">
                    <button
                        className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({events.length})
                    </button>
                    <button
                        className={`btn btn-sm ${filter === 'active' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('active')}
                    >
                        Active ({events.filter(e => e.isActive).length})
                    </button>
                    <button
                        className={`btn btn-sm ${filter === 'inactive' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('inactive')}
                    >
                        Inactive ({events.filter(e => !e.isActive).length})
                    </button>
                </div>
            </div>

            {loading && <p>Loading events...</p>}

            <EventList
                events={filteredEvents}
                onToggleStatus={handleToggleStatus}
            />
        </div>
    );
};

export default EventManager;
