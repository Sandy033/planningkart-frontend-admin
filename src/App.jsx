import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Landing from './pages/Landing/Landing';

import Signup from './pages/Signup/Signup';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/signup" element={<Signup />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Organizer route removed */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
