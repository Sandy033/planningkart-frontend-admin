import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../../store/slices/authSlice';
import './ResetPasswordModal.css';

const ResetPasswordModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [validationError, setValidationError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // We haven't created this thunk yet, but we will soon
    const { loading, error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setValidationError('');
        setSuccessMessage('');
    };

    const handleConfirm = async (e) => {
        e.preventDefault();

        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setValidationError('All fields are required.');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setValidationError('New passwords do not match.');
            return;
        }

        if (formData.newPassword.length < 8) {
            setValidationError('New password must be at least 8 characters long.');
            return;
        }

        const resultAction = await dispatch(updatePassword({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
        }));

        if (updatePassword.fulfilled.match(resultAction)) {
            setSuccessMessage('Password updated successfully!');
            // clear form data
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setTimeout(() => {
                onClose();
                setSuccessMessage('');
            }, 1500); // Close after 1.5s to show success message
        }
    };

    const handleClose = () => {
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setValidationError('');
        setSuccessMessage('');
        onClose();
    }

    return (
        <div className="reset-password-modal-overlay" onClick={handleClose}>
            <div className="reset-password-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="reset-password-modal-header">
                    <h3>Update Password</h3>
                </div>

                <div className="reset-password-modal-body">
                    {(error || validationError) && (
                        <div className="error-message">
                            {validationError || error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="success-message" style={{ color: 'var(--success-color, #10b981)', marginBottom: 'var(--space-4)', fontSize: '0.875rem' }}>
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleConfirm} className="auth-form" id="reset-password-form">
                        <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                            <label className="form-label">Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                className="form-input"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter current password"
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                className="form-input"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                    </form>
                </div>

                <div className="reset-password-modal-actions">
                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="reset-password-form"
                        className="btn btn-primary btn-sm"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordModal;
