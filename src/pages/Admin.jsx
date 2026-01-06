import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, MessageSquare, ShoppingBag, Plus, Trash2, Edit3, LogOut, X, CheckCircle, Upload, Mail, User, Settings, Lock, Heart, Image as ImageIcon } from 'lucide-react';
// Cloudinary is used instead of Firebase Storage
// import { storage } from '../firebase';
// import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const Admin = () => {
    const { products, addProduct, deleteProduct, updateProduct, galleryItems, addGalleryItem, deleteGalleryItem, messages, deleteMessage, orders, deleteOrder, isAdmin, setIsAdmin, changePassword } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('products');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadType, setUploadType] = useState('shop'); // 'shop' or 'gallery'
    const [editingProduct, setEditingProduct] = useState(null);

    // Shop Form Data
    const [formData, setFormData] = useState({ name: '', price: '', image: '', description: '' });
    // Gallery Form Data
    const [galleryFormData, setGalleryFormData] = useState({ title: '', image: '', type: 'image' });

    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [newPass, setNewPass] = useState('');
    const [passUpdateStatus, setPassUpdateStatus] = useState('');
    const navigate = useNavigate();

    if (!isAdmin) return <Navigate to="/login" />;

    const handleLogout = () => {
        setIsAdmin(false);
        navigate('/');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                if (uploadType === 'shop') {
                    setFormData({ ...formData, image: reader.result });
                } else {
                    setGalleryFormData({ ...galleryFormData, image: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        setUploadProgress(0);

        try {
            let imageUrl = uploadType === 'shop' ? formData.image : galleryFormData.image;

            if (imageFile) {
                if (imageFile) {
                    const formData = new FormData();
                    formData.append('file', imageFile);
                    formData.append('upload_preset', 'hnefpiqg'); // Your Cloudinary Upload Preset
                    formData.append('cloud_name', 'dw7wcsate'); // Your Cloud Name

                    // Determine resource type (image or video)
                    const resourceType = imageFile.type.includes('video') ? 'video' : 'image';

                    // Cloudinary Upload URL
                    const response = await fetch(`https://api.cloudinary.com/v1_1/dw7wcsate/${resourceType}/upload`, {
                        method: 'POST',
                        body: formData
                    });

                    const data = await response.json();

                    if (data.secure_url) {
                        imageUrl = data.secure_url;
                    } else {
                        throw new Error("Cloudinary upload failed");
                    }
                }
            }

            if (uploadType === 'shop') {
                const productData = {
                    ...formData,
                    image: imageUrl,
                    price: formData.price ? Number(formData.price) : 0,
                };

                if (editingProduct) {
                    await updateProduct({ ...productData, id: editingProduct.id });
                } else {
                    await addProduct(productData);
                }
            } else {
                // Gallery Upload
                await addGalleryItem({
                    title: '',
                    url: imageUrl,
                    type: imageFile?.type?.includes('video') ? 'video' : 'image'
                });
            }

            setIsModalOpen(false);
            setEditingProduct(null);
            setFormData({ name: '', price: '', image: '', description: '' });
            setGalleryFormData({ title: '', image: '', type: 'image' });
            setImageFile(null);
            setUploadProgress(0);
        } catch (error) {
            console.error("Upload failed:", error);
            if (error.code === 'storage/retry-limit-exceeded') {
                alert("Upload took too long! Please check your internet connection and try again.");
            } else {
                alert(`Upload failed: ${error.message || "Unknown error"}. Check console for details.`);
            }
        } finally {
            setIsUploading(false);
        }
    };

    const openEdit = (product) => {
        setUploadType('shop');
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description || ''
        });
        setIsModalOpen(true);
    };

    const handlePassChange = (e) => {
        e.preventDefault();
        changePassword(newPass);
        setPassUpdateStatus('Password updated successfully!');
        setNewPass('');
        setTimeout(() => setPassUpdateStatus(''), 3000);
    };

    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-4">
                <div>
                    <h1 className="display-4 fw-bold">Admin <span style={{ color: 'var(--primary)' }}>Control</span></h1>
                    <p className="text-muted mb-0">Manage your inventory, messages and orders from one place.</p>
                </div>
                <button onClick={handleLogout} className="btn glass text-danger border-0 px-4 py-2 d-flex align-items-center gap-2 rounded-3 shadow-sm">
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <div className="row g-3 mb-4">
                {[
                    { id: 'products', icon: Package, label: 'Shop Items', count: products.length },
                    { id: 'gallery', icon: ImageIcon, label: 'Gallery', count: galleryItems.length },
                    { id: 'messages', icon: MessageSquare, label: 'Messages', count: messages.length },
                    { id: 'orders', icon: ShoppingBag, label: 'Orders', count: orders.length },
                    { id: 'settings', icon: Settings, label: 'Settings' }
                ].map(tab => (
                    <div key={tab.id} className="col-6 col-md-3">
                        <button
                            onClick={() => setActiveTab(tab.id)}
                            className={`btn w-100 py-3 d-flex align-items-center justify-content-center gap-2 rounded-4 border-0 transition-all ${activeTab === tab.id ? 'btn-primary shadow' : 'glass text-white opacity-75'}`}
                        >
                            <tab.icon size={20} />
                            <span className="d-none d-sm-inline">{tab.label}</span>
                            {tab.count !== undefined && <span className="badge bg-white text-dark rounded-pill ms-1">{tab.count}</span>}
                        </button>
                    </div>
                ))}
            </div>

            <div className="glass p-4 p-md-5 animate-fade-in border-0 shadow-lg">
                {activeTab === 'products' && (
                    <div className="table-responsive">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="h4 fw-bold mb-0">Shop Inventory</h3>
                            <button onClick={() => { setIsModalOpen(true); setUploadType('shop'); setEditingProduct(null); setFormData({ name: '', price: '', image: '', description: '' }); }} className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-3 border-0">
                                <Plus size={18} /> <span className="d-none d-sm-inline">Add Product</span>
                            </button>
                        </div>
                        <table className="table table-dark table-hover align-middle border-0">
                            <thead>
                                <tr className="text-muted border-bottom border-secondary">
                                    <th className="py-3 px-4 border-0">Art</th>
                                    <th className="py-3 px-4 border-0">Price</th>
                                    <th className="py-3 px-4 border-0">Likes</th>
                                    <th className="py-3 px-4 border-0 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} className="border-bottom border-secondary border-opacity-10">
                                        <td className="py-3 px-4 border-0">
                                            <div className="d-flex align-items-center gap-3">
                                                <img
                                                    src={p.image}
                                                    alt={p.name}
                                                    className="rounded-2"
                                                    style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                                                />
                                                <span className="fw-medium">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 border-0 fw-bold text-primary">${p.price}</td>
                                        <td className="py-3 px-4 border-0">
                                            <div className="d-flex align-items-center gap-2 text-danger">
                                                <Heart size={14} fill="var(--accent)" /> {p.likes || 0}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 border-0 text-end">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button onClick={() => openEdit(p)} className="btn btn-sm glass text-primary border-0 p-2"><Edit3 size={16} /></button>
                                                <button onClick={() => deleteProduct(p.id)} className="btn btn-sm glass text-danger border-0 p-2"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="h4 fw-bold mb-0">Gallery Portfolio</h3>
                            <button onClick={() => { setIsModalOpen(true); setUploadType('gallery'); setGalleryFormData({ title: '', image: '', type: 'image' }); }} className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-3 border-0">
                                <Plus size={18} /> <span className="d-none d-sm-inline">Add to Gallery</span>
                            </button>
                        </div>
                        <div className="row g-3">
                            {galleryItems.map(item => (
                                <div key={item.id} className="col-6 col-md-3">
                                    <div className="position-relative group overflow-hidden rounded-3" style={{ height: '200px' }}>
                                        {item.type === 'video' ? (
                                            <video src={item.url} className="w-100 h-100 object-fit-cover" muted />
                                        ) : (
                                            <img src={item.url} alt={item.title} className="w-100 h-100 object-fit-cover" />
                                        )}
                                        <div className="position-absolute top-0 end-0 p-2">
                                            <button onClick={() => deleteGalleryItem(item.id)} className="btn btn-sm bg-danger text-white border-0 shadow"><Trash2 size={16} /></button>
                                        </div>
                                        <div className="position-absolute bottom-0 start-0 p-2 w-100 bg-dark bg-opacity-50">
                                            <small className="text-white fw-bold truncate">{item.title || 'Untitled'}</small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="d-flex flex-column gap-5">
                        {/* Messages content reused */}
                        <div className="text-muted">Inquiries shown here... (Same as before)</div>
                        <div className="row g-3">
                            {messages.map(m => (
                                <div key={m.id} className="col-12">
                                    <div className="glass p-4 rounded-4 position-relative">
                                        <button onClick={() => deleteMessage(m.id)} className="btn btn-sm text-danger position-absolute top-0 end-0 m-3"><Trash2 size={16} /></button>
                                        <div className="fw-bold">{m.name} <span className="text-muted fw-normal">({m.email})</span></div>
                                        <p className="mb-0 mt-2">{m.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div>
                        <h3 className="h4 fw-bold mb-4">Recent Orders</h3>
                        <div className="d-flex flex-column gap-4">
                            {orders.map(o => (
                                <div key={o.id} className="glass p-4 border-0 rounded-4">
                                    <div className="d-flex align-items-center gap-3">
                                        {o.image && (
                                            <img
                                                src={o.image}
                                                alt={o.productName}
                                                className="rounded-3"
                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                            />
                                        )}
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <h5 className="fw-bold mb-1">{o.productName}</h5>
                                                <button onClick={() => deleteOrder(o.id)} className="btn btn-sm glass text-danger border-0 p-2"><Trash2 size={16} /></button>
                                            </div>
                                            <div className="small text-muted">Customer: {o.customer} | {o.phone}</div>
                                            <div className="small text-muted mt-1 text-truncate" style={{ maxWidth: '300px' }}>{o.address}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div style={{ maxWidth: '500px' }}>
                        <h3 className="h4 fw-bold mb-2">Admin Settings</h3>
                        <form onSubmit={handlePassChange} className="glass p-4 border-0 rounded-4">
                            <label className="small fw-bold text-muted text-uppercase mb-2">New Admin Password</label>
                            <input
                                required
                                type="password"
                                className="form-control bg-dark border-0 text-white py-3 rounded-3 mb-3"
                                style={{ background: 'rgba(0,0,0,0.2) !important' }}
                                value={newPass}
                                onChange={e => setNewPass(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary w-100 py-3 fw-bold border-0 rounded-3">Update Password</button>
                            {passUpdateStatus && <div className="mt-3 text-success small">{passUpdateStatus}</div>}
                        </form>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="d-flex align-items-center justify-content-center px-3 position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.85)', zIndex: 2000 }}>
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass p-4 p-md-5 position-relative w-100 overflow-auto"
                        style={{ maxWidth: '550px', maxHeight: '90vh' }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="h4 fw-bold mb-0">
                                {uploadType === 'shop'
                                    ? (editingProduct ? 'Edit Shop Item' : 'Add Shop Item')
                                    : 'Add to Gallery'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="btn text-muted p-0 border-0"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">

                            {uploadType === 'shop' ? (
                                <>
                                    <div className="d-flex flex-column gap-2">
                                        <label className="small fw-bold text-muted text-uppercase">Art Name (H1)</label>
                                        <input
                                            required
                                            placeholder="e.g. Moonlight Sonata"
                                            className="form-control bg-dark border-0 text-white py-3 rounded-3"
                                            style={{ background: 'rgba(0,0,0,0.2) !important' }}
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="d-flex flex-column gap-2">
                                        <label className="small fw-bold text-muted text-uppercase">Detail (Paragraph)</label>
                                        <textarea
                                            required
                                            rows="4"
                                            placeholder="Describe the artwork details..."
                                            className="form-control bg-dark border-0 text-white py-3 rounded-3"
                                            style={{ background: 'rgba(0,0,0,0.2) !important', resize: 'none' }}
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="d-flex flex-column gap-2">
                                        <label className="small fw-bold text-muted text-uppercase">Price ($) <span className="text-secondary fw-normal">(Optional)</span></label>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="form-control bg-dark border-0 text-white py-3 rounded-3"
                                            style={{ background: 'rgba(0,0,0,0.2) !important' }}
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="d-flex flex-column gap-2">
                                    <div className="alert alert-info border-0 bg-primary bg-opacity-10 text-primary small mt-2">
                                        Gallery uploads support Images and Videos. No title required.
                                    </div>
                                </div>
                            )}

                            <div className="d-flex flex-column gap-2">
                                <label className="small fw-bold text-muted text-uppercase">Source File</label>
                                <div className="d-flex flex-column gap-3">
                                    <label className="btn glass border-0 text-white py-4 rounded-3 d-flex flex-column align-items-center justify-content-center gap-2 border-dashed" style={{ border: '2px dashed rgba(255,255,255,0.1) !important' }}>
                                        <div className="bg-primary bg-opacity-10 p-2 rounded-circle"><Upload size={24} className="text-primary" /></div>
                                        <span className="fw-medium">Click to upload Image or Video</span>
                                        <input type="file" accept="image/*,video/*" onChange={handleImageUpload} className="d-none" />
                                    </label>

                                    {(uploadType === 'shop' ? formData.image : galleryFormData.image) && (
                                        <div className="position-relative">
                                            <div className="bg-dark rounded-3 p-2 text-center text-muted small">File Selected</div>
                                            <button type="button" onClick={() => setImageFile(null)} className="btn btn-sm btn-dark position-absolute top-0 end-0 m-2 rounded-circle shadow"><X size={16} /></button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button type="submit" disabled={isUploading} className="btn btn-primary py-3 rounded-3 fw-bold border-0 mt-2 d-flex align-items-center justify-content-center gap-2 shadow">
                                {isUploading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        {imageFile ? `Uploading ${uploadProgress}%` : 'Saving...'}
                                    </>
                                ) : (
                                    'Upload to Collection'
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Admin;
