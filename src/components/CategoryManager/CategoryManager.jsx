import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory, updateCategory, deleteCategory } from '../../store/slices/categorySlice';
import Modal from '../Modal/Modal';
import './CategoryManager.css';

const CategoryManager = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const dispatch = useDispatch();
    const { items: categories, loading } = useSelector((state) => state.categories);

    const handleCreate = () => {
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
        setShowModal(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, description: category.description || '' });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            await dispatch(deleteCategory(id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingCategory) {
            await dispatch(updateCategory({ id: editingCategory.id, data: formData }));
        } else {
            await dispatch(createCategory(formData));
        }
        setShowModal(false);
        setFormData({ name: '', description: '' });
    };

    return (
        <div className="category-manager">
            <div className="manager-header">
                <h3>Event Categories</h3>
                <button className="btn btn-primary" onClick={handleCreate}>
                    ➕ Add Category
                </button>
            </div>

            {loading && <p>Loading categories...</p>}

            <div className="category-grid">
                {categories.map((category) => (
                    <div key={category.id} className="category-card card-glass">
                        <div className="category-info">
                            <h4>{category.name}</h4>
                            {category.description && <p>{category.description}</p>}
                        </div>
                        <div className="category-actions">
                            <button className="btn btn-sm btn-outline" onClick={() => handleEdit(category)}>
                                ✏️ Edit
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(category.id)}>
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && !loading && (
                <div className="empty-state">
                    <p>No categories yet. Create your first category!</p>
                </div>
            )}

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingCategory ? 'Edit Category' : 'Create Category'}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Category Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Music, Sports, Technology"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description (Optional)</label>
                        <textarea
                            className="form-textarea"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of this category"
                            rows="3"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg">
                        {editingCategory ? 'Update Category' : 'Create Category'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default CategoryManager;
