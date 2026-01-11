import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, MessageSquare, ShoppingBag, Plus, Trash2, Edit3, LogOut, X, CheckCircle, Upload, Mail, User, Phone, Settings, Lock, Heart, Image as ImageIcon } from 'lucide-react';
// Cloudinary is used instead of Firebase Storage
// import { storage } from '../firebase';
// import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const Admin = () => {
    const { products, addProduct, deleteProduct, updateProduct, galleryItems, addGalleryItem, deleteGalleryItem, messages, deleteMessage, orders, deleteOrder, isAdmin, setIsAdmin, changePassword, verifyAdminPassword } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('products');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadType, setUploadType] = useState('shop'); // 'shop' or 'gallery'
    const [editingProduct, setEditingProduct] = useState(null);

    // Admin Login State (Inline)
    const [adminLogin, setAdminLogin] = useState({ username: '', password: '' });
    const [adminAuthError, setAdminAuthError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

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

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setIsVerifying(true);
        setAdminAuthError('');
        const isValid = await verifyAdminPassword(adminLogin.username, adminLogin.password);
        setIsVerifying(false);

        if (isValid) {
            setIsAdmin(true);
        } else {
            setAdminAuthError('Invalid Credentials');
        }
    };

    if (!isAdmin) {
        return (
            <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', paddingTop: '6rem' }}>
                <div className="glass p-5 rounded-5 shadow-lg w-100" style={{ maxWidth: '450px' }}>
                    <div className="text-center mb-5">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 text-primary">
                            <Lock size={32} />
                        </div>
                        <h1 className="h3 fw-bold mb-0">Admin Access</h1>
                    </div>

                    {adminAuthError && <div className="alert alert-danger py-2 small border-0 bg-danger bg-opacity-10 text-danger mb-4">{adminAuthError}</div>}

                    <form onSubmit={handleAdminLogin} className="d-flex flex-column gap-3">
                        <div className="d-flex flex-column gap-2">
                            <label className="small fw-bold text-muted text-uppercase ms-1">Username</label>
                            <input
                                type="text"
                                required
                                className="form-control bg-dark border-0 text-white py-3 px-4 rounded-3"
                                style={{ background: 'rgba(0,0,0,0.2) !important' }}
                                value={adminLogin.username}
                                onChange={e => setAdminLogin({ ...adminLogin, username: e.target.value })}
                            />
                        </div>
                        <div className="d-flex flex-column gap-2">
                            <label className="small fw-bold text-muted text-uppercase ms-1">Password</label>
                            <input
                                type="password"
                                required
                                className="form-control bg-dark border-0 text-white py-3 px-4 rounded-3"
                                style={{ background: 'rgba(0,0,0,0.2) !important', letterSpacing: '0.1em' }}
                                value={adminLogin.password}
                                onChange={e => setAdminLogin({ ...adminLogin, password: e.target.value })}
                            />
                        </div>

                        <button type="submit" disabled={isVerifying} className="btn btn-primary w-100 py-3 rounded-3 fw-bold mt-3 shadow">
                            {isVerifying ? 'Verifying...' : 'Access Dashboard'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

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
                                    <tr key={p._id || p.id} className="border-bottom border-secondary border-opacity-10">
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
                                        <td className="py-3 px-4 border-0 fw-bold text-primary">₹{p.price}</td>
                                        <td className="py-3 px-4 border-0">
                                            <div className="d-flex align-items-center gap-2 text-danger">
                                                <Heart size={14} fill="var(--accent)" /> {p.likes || 0}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 border-0 text-end">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button onClick={() => openEdit(p)} className="btn btn-sm glass text-primary border-0 p-2"><Edit3 size={16} /></button>
                                                <button onClick={() => deleteProduct(p._id || p.id)} className="btn btn-sm glass text-danger border-0 p-2"><Trash2 size={16} /></button>
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
                                <div key={item._id || item.id} className="col-6 col-md-3">
                                    <div className="position-relative group overflow-hidden rounded-3" style={{ height: '200px' }}>
                                        {item.type === 'video' ? (
                                            <video src={item.url} className="w-100 h-100 object-fit-cover" muted />
                                        ) : (
                                            <img src={item.url} alt={item.title} className="w-100 h-100 object-fit-cover" />
                                        )}
                                        <div className="position-absolute top-0 end-0 p-2">
                                            <button onClick={() => deleteGalleryItem(item._id || item.id)} className="btn btn-sm bg-danger text-white border-0 shadow"><Trash2 size={16} /></button>
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
                    <div className="d-flex flex-column gap-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h3 className="h4 fw-bold mb-0">Inbox</h3>
                            <div className="text-muted small">{messages.length} messages total</div>
                        </div>
                        <div className="row g-4">
                            {messages.map(m => (
                                <div key={m._id || m.id} className="col-12">
                                    <div className="glass p-4 rounded-4 position-relative border-0 shadow-sm">
                                        <button onClick={() => deleteMessage(m._id || m.id)} className="btn btn-sm text-danger position-absolute top-0 end-0 m-3 hover-scale"><Trash2 size={18} /></button>

                                        <div className="d-flex flex-column flex-md-row gap-4">
                                            {m.image && (
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={m.image}
                                                        alt="Reference"
                                                        className="rounded-3 shadow-sm"
                                                        style={{ width: '150px', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
                                                        onClick={() => window.open(m.image, '_blank')}
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-grow-1">
                                                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                                                    <span className="badge border-0 rounded-pill px-3 py-2 bg-secondary">
                                                        General Inquiry
                                                    </span>
                                                    <span className="text-muted small">{m.date}</span>
                                                </div>

                                                <div className="row g-3">
                                                    <div className="col-12 col-md-6">
                                                        <div className="d-flex align-items-center gap-2 mb-1">
                                                            <User size={14} className="text-primary" />
                                                            <span className="fw-bold text-white">{m.name}</span>
                                                        </div>
                                                        <div className="d-flex align-items-center gap-2 small text-muted">
                                                            <Mail size={14} />
                                                            <a href={`mailto:${m.email}`} className="text-muted text-decoration-none hover-primary">{m.email}</a>
                                                        </div>
                                                        {m.phone && (
                                                            <div className="d-flex align-items-center gap-2 small text-muted mt-1">
                                                                <Phone size={14} />
                                                                <a href={`tel:${m.phone}`} className="text-muted text-decoration-none hover-primary">{m.phone}</a>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {m.address && (
                                                        <div className="col-12 col-md-6">
                                                            <div className="small fw-bold text-muted text-uppercase mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Address</div>
                                                            <div className="small text-white-50">{m.address}</div>
                                                        </div>
                                                    )}

                                                    <div className="col-12 mt-3 pt-3 border-top border-secondary border-opacity-10">
                                                        <div className="small fw-bold text-muted text-uppercase mb-2" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                                                            Message
                                                        </div>
                                                        <p className="mb-0 text-white-50" style={{ whiteSpace: 'pre-wrap' }}>{m.message}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <div className="col-12 text-center py-5">
                                    <div className="text-muted opacity-50 mb-3"><MessageSquare size={64} /></div>
                                    <div className="h5 text-muted">No messages yet.</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="d-flex flex-column gap-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h3 className="h4 fw-bold mb-0">Active Orders</h3>
                            <div className="text-muted small">{orders.length} orders total</div>
                        </div>
                        <div className="row g-4">
                            {orders.map(o => (
                                <div key={o._id || o.id} className="col-12">
                                    <div className="glass p-4 rounded-4 position-relative border-0 shadow-sm">
                                        <button onClick={() => deleteOrder(o._id || o.id)} className="btn btn-sm text-danger position-absolute top-0 end-0 m-3 hover-scale"><Trash2 size={18} /></button>

                                        <div className="d-flex flex-column flex-md-row gap-4">
                                            {o.image && (
                                                <div className="flex-shrink-0">
                                                    <div className="small fw-bold text-muted text-uppercase mb-1" style={{ fontSize: '0.6rem', letterSpacing: '0.05em' }}>
                                                        {o.type === 'service' ? 'Reference Image' : 'Product Image'}
                                                    </div>
                                                    <img
                                                        src={o.image}
                                                        alt={o.productName}
                                                        className="rounded-3 shadow-sm"
                                                        style={{ width: '120px', height: '120px', objectFit: 'cover', cursor: 'pointer' }}
                                                        onClick={() => window.open(o.image, '_blank')}
                                                        title="Click to view full image"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <div>
                                                        <h5 className="fw-bold mb-0 text-primary">{o.productName}</h5>
                                                        <div className="d-flex align-items-center gap-2 mt-1">
                                                            <span className={`badge border-0 rounded-pill px-2 py-1 small ${o.type === 'service' ? 'bg-info bg-opacity-25 text-info' : 'bg-success bg-opacity-25 text-success'}`} style={{ fontSize: '0.7rem' }}>
                                                                {o.type === 'service' ? 'Custom Request' : 'Product Order'}
                                                            </span>
                                                            <span className="text-muted small">Placed on {o.date || 'unknown date'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row g-3">
                                                    <div className="col-12 col-md-6">
                                                        <div className="d-flex align-items-center gap-2 mb-1">
                                                            <User size={14} className="text-primary" />
                                                            <span className="fw-bold text-white">{o.customer || 'Guest User'}</span>
                                                        </div>
                                                        {o.phone && (
                                                            <div className="d-flex align-items-center gap-2 small text-muted">
                                                                <Phone size={14} />
                                                                <a href={`tel:${o.phone}`} className="text-muted text-decoration-none hover-primary">{o.phone}</a>
                                                            </div>
                                                        )}
                                                        {o.email && (
                                                            <div className="d-flex align-items-center gap-2 small text-muted mt-1">
                                                                <Mail size={14} />
                                                                <a href={`mailto:${o.email}`} className="text-muted text-decoration-none hover-primary">{o.email}</a>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <div className="small fw-bold text-muted text-uppercase mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Shipping Address</div>
                                                        <div className="small text-white-50">{o.address || 'No address provided'}</div>
                                                    </div>

                                                    {o.notes && (
                                                        <div className="col-12 mt-3 pt-3 border-top border-secondary border-opacity-10">
                                                            <div className="small fw-bold text-muted text-uppercase mb-2" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                                                                {o.type === 'service' ? 'Request Info / Service Details' : 'Design Notes / Comments'}
                                                            </div>
                                                            <p className="mb-0 text-white-50 small" style={{ whiteSpace: 'pre-wrap' }}>{o.notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {orders.length === 0 && (
                                <div className="col-12 text-center py-5">
                                    <div className="text-muted opacity-50 mb-3"><ShoppingBag size={64} /></div>
                                    <div className="h5 text-muted">No orders yet.</div>
                                </div>
                            )}
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
                                        <label className="small fw-bold text-muted text-uppercase">Price (₹) <span className="text-secondary fw-normal">(Optional)</span></label>
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
                                        <div className="position-relative rounded-3 overflow-hidden" style={{ height: '150px' }}>
                                            {(uploadType === 'gallery' && galleryFormData.type === 'video') || (imageFile?.type?.includes('video')) ? (
                                                <video src={uploadType === 'shop' ? formData.image : galleryFormData.image} className="w-100 h-100 object-fit-cover" muted />
                                            ) : (
                                                <img src={uploadType === 'shop' ? formData.image : galleryFormData.image} alt="Preview" className="w-100 h-100 object-fit-cover" />
                                            )}
                                            <div className="position-absolute top-0 end-0 m-2 d-flex gap-2">
                                                <div className="badge bg-dark bg-opacity-75 backdrop-blur shadow-sm">Current Preview</div>
                                                <button type="button" onClick={() => {
                                                    setImageFile(null);
                                                    if (uploadType === 'shop') setFormData({ ...formData, image: '' });
                                                    else setGalleryFormData({ ...galleryFormData, image: '' });
                                                }} className="btn btn-sm btn-danger rounded-circle shadow-sm p-1"><X size={14} /></button>
                                            </div>
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
                                    editingProduct ? 'Update Product' : 'Upload to Collection'
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
