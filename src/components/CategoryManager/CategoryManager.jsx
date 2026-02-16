import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory, updateCategory, deleteCategory } from '../../store/slices/categorySlice';
import Modal from '../Modal/Modal';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import './CategoryManager.css';

const CategoryManager = () => {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        iconUrl: '',
        parentCategory: ''
    });

    const dispatch = useDispatch();
    const { items: categories, loading } = useSelector((state) => state.categories);

    const handleCreate = () => {
        setEditingCategory(null);
        setFormData({ name: '', slug: '', description: '', iconUrl: '', parentCategory: '' });
        setShowModal(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug || '',
            description: category.description || '',
            iconUrl: category.iconUrl || '',
            parentCategory: category.parentCategory ? category.parentCategory.id : ''
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setCategoryToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (categoryToDelete) {
            await dispatch(deleteCategory(categoryToDelete));
            setCategoryToDelete(null);
        }
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        // Auto-generate slug only if crafting a new category or if we want to simple auto-fill behavior
        // For better UX during edit, we ideally only touch slug if it wasn't manually modified, but simplified here:
        // Only auto-gen slug if not editing an existing category (preserve existing slugs unless manually changed)
        if (!editingCategory) {
            const slug = generateSlug(name);
            setFormData(prev => ({ ...prev, name, slug }));
        } else {
            setFormData(prev => ({ ...prev, name }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            parentCategory: formData.parentCategory ? { id: formData.parentCategory } : null
        };

        if (editingCategory) {
            await dispatch(updateCategory({ id: editingCategory.id, data: payload }));
        } else {
            await dispatch(createCategory(payload));
        }
        setShowModal(false);
        setFormData({ name: '', slug: '', description: '', iconUrl: '', parentCategory: '' });
    };

    const availableParents = categories.filter(c => !editingCategory || c.id !== editingCategory.id);

    // Truncate description to 30 words
    const truncateDescription = (text, maxWords = 30) => {
        if (!text) return '';
        const words = text.split(' ');
        if (words.length <= maxWords) return text;
        return words.slice(0, maxWords).join(' ') + '...';
    };

    return (
        <div className="category-manager">
            <div className="manager-header">
                <h3>Event Categories</h3>
                <button className="btn btn-primary" onClick={handleCreate}>
                    Add Category
                </button>
            </div>

            {loading && <p>Loading categories...</p>}

            <div className="category-grid">
                {categories.map((category) => (
                    <div key={category.id} className="category-card card-glass">
                        <div className="category-info">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {category.iconUrl && <img src={category.iconUrl} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />}
                                <h4>{category.name}</h4>
                            </div>
                            <small style={{ color: '#666', display: 'block', marginBottom: '4px' }}>/{category.slug}</small>
                            {category.description && <p className="category-description">{truncateDescription(category.description)}</p>}
                            {category.parentCategory && (
                                <span className="badge" style={{ background: '#e0e7ff', color: '#4f46e5', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>
                                    Parent: {category.parentCategory.name}
                                </span>
                            )}
                        </div>
                        <div className="category-actions">
                            <button className="btn btn-sm btn-outline" onClick={() => handleEdit(category)}>
                                Edit
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(category.id)}>
                                Delete
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
                            onChange={handleNameChange} // Use custom handler
                            placeholder="e.g., Music, Sports, Technology"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Slug</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="URL-friendly identifier"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Icon URL</label>
                        <input
                            type="url"
                            className="form-input"
                            value={formData.iconUrl}
                            onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                            placeholder="https://example.com/icon.png"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Parent Category</label>
                        <select
                            className="form-input"
                            value={formData.parentCategory}
                            onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                        >
                            <option value="">None (Top Level)</option>
                            {availableParents.map(parent => (
                                <option key={parent.id} value={parent.id}>
                                    {parent.name}
                                </option>
                            ))}
                        </select>
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

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title="Delete Category"
                message="Are you sure you want to delete this category? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDanger={true}
            />
        </div>
    );
};

export default CategoryManager;
