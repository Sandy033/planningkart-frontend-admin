import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false }) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="confirmation-modal-overlay" onClick={onClose}>
            <div className="confirmation-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="confirmation-modal-header">
                    <h3>{title}</h3>
                </div>
                <div className="confirmation-modal-body">
                    <p>{message}</p>
                </div>
                <div className="confirmation-modal-actions">
                    <button
                        className="btn btn-outline btn-sm"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`btn btn-sm ${isDanger ? 'btn-danger' : 'btn-primary'}`}
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
