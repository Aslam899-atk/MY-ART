import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
    Package, MessageSquare, ShoppingBag, Plus, Trash2, Edit3, LogOut, X,
    CheckCircle, Upload, Mail, User, Phone, Settings, Lock, Heart,
    Image as ImageIcon, LayoutDashboard, Search, Users as UsersIcon,
    ChevronRight, Filter, ExternalLink, MoreVertical, Eye,
    AlertCircle, TrendingUp, DollarSign, Clock, BarChart3
} from 'lucide-react';

const Admin = () => {
    const {
        products, addProduct, deleteProduct, updateProduct,
        galleryItems, addGalleryItem, deleteGalleryItem, updateGalleryItem,
        messages, deleteMessage,
        orders, deleteOrder, updateOrderStatus,
        users, isAdmin, setIsAdmin, changePassword, verifyAdminPassword
    } = useContext(AppContext);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadType, setUploadType] = useState('shop'); // 'shop' or 'gallery'
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingGalleryItem, setEditingGalleryItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Admin Login State
    const [_uploadProgress, setUploadProgress] = useState(0);
    const [adminLogin, setAdminLogin] = useState({ username: '', password: '' });
    const [adminAuthError, setAdminAuthError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({ name: '', price: '', image: '', description: '', category: '', medium: '' });
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [newPass, setNewPass] = useState('');
    const [passUpdateStatus, setPassUpdateStatus] = useState('');

    const navigate = useNavigate();

    // Statistics Calculation
    const stats = useMemo(() => {
        const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'Pending').length;
        const totalLikes = products.reduce((sum, p) => sum + (p.likes || 0), 0) + galleryItems.reduce((sum, g) => sum + (g.likes || 0), 0);

        return {
            revenue: totalRevenue,
            pending: pendingOrders,
            likes: totalLikes,
            users: users?.length || 0,
            growth: '+12.5%' // Hardcoded for aesthetics
        };
    }, [orders, products, galleryItems, users]);

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setIsVerifying(true);
        setAdminAuthError('');
        const isValid = await verifyAdminPassword(adminLogin.username, adminLogin.password);
        setIsVerifying(false);

        if (isValid) {
            setIsAdmin(true);
        } else {
            setAdminAuthError('Invalid Access Key');
        }
    };

    if (!isAdmin) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center px-3" style={{ background: '#0a0a0a', paddingTop: '14rem', paddingBottom: '2rem' }}>
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-5 rounded-5 shadow-lg w-100 border border-secondary border-opacity-10"
                    style={{ maxWidth: '400px' }}
                >
                    <div className="text-center mb-5">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 text-primary">
                            <Lock size={32} />
                        </div>
                        <h1 className="h3 fw-bold mb-1 text-white">Console Access</h1>
                        <p className="text-muted small">Enter your credentials to manage Art Void</p>
                    </div>

                    {adminAuthError && (
                        <Motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="alert alert-danger py-2 small border-0 bg-danger bg-opacity-10 text-danger mb-4 text-center"
                        >
                            <AlertCircle size={14} className="me-2" />
                            {adminAuthError}
                        </Motion.div>
                    )}

                    <form onSubmit={handleAdminLogin} className="d-flex flex-column gap-3">
                        <div className="form-group">
                            <label className="small fw-bold text-muted text-uppercase mb-2 ms-1" style={{ letterSpacing: '0.05em' }}>Username</label>
                            <input
                                type="text"
                                required
                                className="form-control bg-dark border-0 text-white py-3 px-4 rounded-4"
                                style={{ background: 'rgba(255,255,255,0.03) !important' }}
                                value={adminLogin.username}
                                onChange={e => setAdminLogin({ ...adminLogin, username: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="small fw-bold text-muted text-uppercase mb-2 ms-1" style={{ letterSpacing: '0.05em' }}>Password</label>
                            <input
                                type="password"
                                required
                                className="form-control bg-dark border-0 text-white py-3 px-4 rounded-4"
                                style={{ background: 'rgba(255,255,255,0.03) !important', letterSpacing: '0.2em' }}
                                value={adminLogin.password}
                                onChange={e => setAdminLogin({ ...adminLogin, password: e.target.value })}
                            />
                        </div>

                        <button type="submit" disabled={isVerifying} className="btn btn-primary w-100 py-3 rounded-4 fw-bold mt-3 shadow-lg transition-all hover-translate-y">
                            {isVerifying ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            ) : null}
                            {isVerifying ? 'Authenticating...' : 'Access Dashboard'}
                        </button>
                    </form>
                </Motion.div>
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
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        setUploadProgress(0);

        try {
            let imageUrl = formData.image;

            if (imageFile) {
                const cloudData = new FormData();
                cloudData.append('file', imageFile);
                cloudData.append('upload_preset', 'hnefpiqg');
                cloudData.append('cloud_name', 'dw7wcsate');

                const resourceType = imageFile.type.includes('video') ? 'video' : 'image';
                const response = await fetch(`https://api.cloudinary.com/v1_1/dw7wcsate/${resourceType}/upload`, {
                    method: 'POST',
                    body: cloudData
                });

                const data = await response.json();
                if (data.secure_url) {
                    imageUrl = data.secure_url;
                } else {
                    throw new Error("Upload failed");
                }
            }

            if (uploadType === 'shop') {
                const productData = {
                    ...formData,
                    image: imageUrl,
                    price: Number(formData.price) || 0,
                };

                if (editingProduct) {
                    await updateProduct({ ...productData, id: editingProduct.id || editingProduct._id });
                } else {
                    await addProduct(productData);
                }
            } else {
                let itemType = 'image';
                if (imageFile) {
                    itemType = imageFile.type.includes('video') ? 'video' : 'image';
                } else if (editingGalleryItem) {
                    itemType = editingGalleryItem.type;
                } else if (formData.image?.includes('.mp4')) {
                    itemType = 'video';
                }

                const galleryData = {
                    title: formData.name || 'Untitled Artwork',
                    url: imageUrl,
                    type: itemType,
                    category: formData.category || 'Other',
                    medium: formData.medium || 'Handcrafted',
                    description: formData.description || ''
                };

                if (editingGalleryItem) {
                    await updateGalleryItem({ ...galleryData, id: editingGalleryItem.id || editingGalleryItem._id });
                } else {
                    await addGalleryItem(galleryData);
                }
            }

            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error(error);
            alert("Action failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setEditingGalleryItem(null);
        setFormData({ name: '', price: '', image: '', description: '', category: '', medium: '' });
        setImageFile(null);
    };

    const handlePassChange = async (e) => {
        e.preventDefault();
        await changePassword(newPass);
        setPassUpdateStatus('Credential updated successfully');
        setNewPass('');
        setTimeout(() => setPassUpdateStatus(''), 3000);
    };

    // Sidebar items
    const menuItems = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length + messages.filter(m => m.type === 'service').length },
        { id: 'products', label: 'Inventory', icon: Package, count: products.length },
        { id: 'gallery', label: 'Gallery', icon: ImageIcon, count: galleryItems.length },
        { id: 'messages', label: 'Inbox', icon: MessageSquare, count: messages.filter(m => m.type !== 'service').length },
        { id: 'users', label: 'Users', icon: UsersIcon, count: users?.length || 0 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="d-flex min-vh-100" style={{ background: '#050505', color: '#fff' }}>

            {/* Desktop Sidebar */}
            <aside className="d-none d-lg-flex flex-column glass border-0 border-end border-secondary border-opacity-10 position-sticky shadow-sm" style={{ width: '280px', zIndex: 1010, top: '8.5rem', overflow: 'visible' }}>
                <div className="p-4 mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary rounded-3 p-2 shadow-lg shadow-primary-50">
                            <ImageIcon size={24} className="text-white" />
                        </div>
                        <h2 className="h5 fw-bold mb-0 text-white" style={{ letterSpacing: '-0.5px' }}>Art Void <span className="text-primary">Admin</span></h2>
                    </div>
                </div>

                <nav className="flex-grow-1 px-3">
                    <div className="text-muted small fw-bold text-uppercase mb-3 px-3" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>Main Menu</div>
                    <ul className="list-unstyled d-flex flex-column gap-1">
                        {menuItems.map(item => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => setActiveTab(item.id)}
                                        className={`btn w-100 text-start d-flex align-items-center justify-content-between px-3 py-2 rounded-3 border-0 transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary-20' : 'text-white-50 hover-bg-white-5'}`}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <Icon size={18} opacity={isActive ? 1 : 0.6} />
                                            <span className="fw-medium">{item.label}</span>
                                        </div>
                                        {item.count > 0 && (
                                            <span className={`badge rounded-pill ${isActive ? 'bg-white text-primary' : 'bg-white bg-opacity-10 text-white-50'}`} style={{ fontSize: '0.7rem' }}>
                                                {item.count}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-top border-secondary border-opacity-10">
                    <button onClick={handleLogout} className="btn w-100 glass text-danger border-0 py-2 d-flex align-items-center gap-3 justify-content-center rounded-3">
                        <LogOut size={16} /> <span className="fw-bold small text-uppercase">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="d-lg-none fixed-bottom glass border-top border-secondary border-opacity-10 py-2 px-3 d-flex justify-content-between align-items-center h-navbar shadow-2xl" style={{ zIndex: 1000 }}>
                {menuItems.slice(0, 5).map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`btn border-0 p-2 rounded-3 d-flex flex-column align-items-center gap-1 transition-all ${isActive ? 'text-primary' : 'text-white-50'}`}
                        >
                            <Icon size={20} />
                            <span style={{ fontSize: '0.6rem' }} className="fw-bold text-uppercase">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Main Content Area */}
            <main className="flex-grow-1 p-3 p-lg-5" style={{ paddingTop: '14rem', paddingBottom: '100px' }}>

                {/* Header */}
                <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-5 sticky-top py-4 px-lg-0" style={{ top: '8.5rem', background: '#050505', zIndex: 1000 }}>
                    <div>
                        <h1 className="display-6 fw-bold mb-1">
                            {menuItems.find(m => m.id === activeTab)?.label}
                        </h1>
                        <p className="text-muted small mb-0">System configuration and resource management</p>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        {['products', 'gallery'].includes(activeTab) && (
                            <button
                                onClick={() => { setUploadType(activeTab === 'products' ? 'shop' : 'gallery'); setIsModalOpen(true); resetForm(); }}
                                className="btn btn-primary px-4 py-2 rounded-3 fw-bold d-flex align-items-center gap-2 border-0 shadow-lg"
                            >
                                <Plus size={18} /> New {activeTab === 'products' ? 'Item' : 'Artwork'}
                            </button>
                        )}
                        <div className="d-flex align-items-center gap-2 glass p-2 rounded-3 border-0">
                            <div className="bg-success rounded-circle shadow-success" style={{ width: '8px', height: '8px' }}></div>
                            <span className="small text-white-50 fw-bold">System Live</span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Overview */}
                <AnimatePresence mode="wait">
                    {activeTab === 'dashboard' && (
                        <Motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="row g-4"
                        >
                            {/* Stat Cards */}
                            {[
                                { label: 'Total Revenue', value: `₹${stats.revenue}`, icon: DollarSign, color: 'primary', trend: '+5.4%' },
                                { label: 'Active Orders', value: stats.pending, icon: ShoppingBag, color: 'success', trend: 'Critical' },
                                { label: 'Engagement', value: stats.likes, icon: Heart, color: 'danger', trend: '+18%' },
                                { label: 'Art Collectors', value: stats.users, icon: UsersIcon, color: 'info', trend: stats.growth },
                            ].map((stat, idx) => (
                                <div key={idx} className="col-12 col-md-6 col-xl-3">
                                    <div className="glass p-4 rounded-4 border-0 h-100 transition-all hover-translate-y">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className={`bg-${stat.color} bg-opacity-10 p-2 rounded-3 text-${stat.color}`}>
                                                <stat.icon size={20} />
                                            </div>
                                            <span className={`badge bg-${stat.color} bg-opacity-10 text-${stat.color} rounded-pill`} style={{ fontSize: '0.65rem' }}>{stat.trend}</span>
                                        </div>
                                        <h3 className="h2 fw-bold mb-0 text-white">{stat.value}</h3>
                                        <p className="text-muted small mb-0 mt-1">{stat.label}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Recent Orders Chart / Placeholder */}
                            <div className="col-12 col-xl-8">
                                <div className="glass p-4 rounded-4 border-0 h-100">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="h5 fw-bold mb-0">Order Analytics</h4>
                                        <button className="btn btn-sm glass border-0 text-white-50"><BarChart3 size={16} /></button>
                                    </div>
                                    <div className="bg-dark rounded-4 p-5 d-flex flex-column align-items-center justify-content-center border border-secondary border-opacity-10" style={{ height: '300px' }}>
                                        <TrendingUp size={48} className="text-primary mb-3 opacity-20" />
                                        <p className="text-muted small">Sales growth visualizer will appear here as you accumulate more data.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Log */}
                            <div className="col-12 col-xl-4">
                                <div className="glass p-4 rounded-4 border-0 h-100">
                                    <h4 className="h5 fw-bold mb-4">Recent Activity</h4>
                                    <div className="d-flex flex-column gap-4">
                                        {[...orders, ...messages].slice(0, 5).map((log, i) => (
                                            <div key={i} className="d-flex gap-3">
                                                <div className="mt-1">
                                                    <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                                                </div>
                                                <div>
                                                    <p className="small mb-0 text-white fw-medium">
                                                        {log.customer || log.name} {log.productName ? 'placed an order' : 'sent a message'}
                                                    </p>
                                                    <span className="text-muted" style={{ fontSize: '0.65rem' }}>{log.date || 'Just now'}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {orders.length === 0 && messages.length === 0 && (
                                            <div className="text-center py-5 text-muted small">No recent activity</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Motion.div>
                    )}

                    {activeTab === 'orders' && (
                        <Motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="d-flex flex-column gap-4"
                        >
                            <div className="glass p-2 rounded-3 d-flex align-items-center gap-2 px-3 border-0">
                                <Search size={18} className="text-muted" />
                                <input
                                    type="text"
                                    placeholder="Search orders, phone or customers..."
                                    className="form-control bg-transparent border-0 text-white p-2"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="table-responsive">
                                <table className="table table-dark table-hover align-middle">
                                    <thead>
                                        <tr className="text-muted opacity-50 border-bottom border-secondary border-opacity-20">
                                            <th className="py-3 px-4 border-0">Resource</th>
                                            <th className="py-3 px-4 border-0">Customer</th>
                                            <th className="py-3 px-4 border-0">Contact</th>
                                            <th className="py-3 px-4 border-0">Status</th>
                                            <th className="py-3 px-4 border-0 text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            ...orders.map(o => ({ ...o, _isOrder: true })),
                                            ...messages.filter(m => m.type === 'service').map(m => ({
                                                ...m,
                                                productName: 'Service Request',
                                                customer: m.name,
                                                notes: m.message,
                                                _isMessage: true,
                                                type: 'service'
                                            }))
                                        ]
                                            .filter(o =>
                                                o.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                o.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                o.phone?.includes(searchQuery)
                                            )
                                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                            .map(o => (
                                                <tr key={o._id || o.id} className="border-bottom border-secondary border-opacity-10">
                                                    <td className="py-4 px-4 border-0">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="position-relative">
                                                                <img
                                                                    src={o.image}
                                                                    className="rounded-3 shadow-sm border border-secondary border-opacity-20"
                                                                    style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                                                                    alt=""
                                                                />
                                                                <div className={`position-absolute bottom-0 end-0 rounded-circle border border-dark ${o.type === 'service' ? 'bg-info' : 'bg-primary'}`} style={{ width: '10px', height: '10px' }}></div>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                <span className="fw-bold text-white small">{o.productName}</span>
                                                                <span className="text-muted" style={{ fontSize: '0.65rem' }}>ID: {(o._id || o.id).slice(-6).toUpperCase()}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 border-0">
                                                        <div className="d-flex flex-column">
                                                            <span className="text-white-50 small fw-medium">{o.customer || o.name || 'Anonymous'}</span>
                                                            <span className="text-muted truncate d-inline-block small" style={{ maxWidth: '150px', fontSize: '0.65rem' }}>{o.address || 'No Address'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 border-0">
                                                        <div className="d-flex flex-column gap-1">
                                                            <a href={`tel:${o.phone}`} className="text-primary text-decoration-none small d-flex align-items-center gap-2">
                                                                <Phone size={12} /> {o.phone || 'N/A'}
                                                            </a>
                                                            <span className="text-muted" style={{ fontSize: '0.65rem' }}>{o.date}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 border-0">
                                                        <select
                                                            value={o.status || 'Pending'}
                                                            onChange={(e) => o._isOrder && updateOrderStatus(o._id || o.id, e.target.value)}
                                                            className={`form-select form-select-sm border-0 rounded-pill px-3 py-1 fw-bold ${o.status === 'Completed' ? 'bg-success bg-opacity-10 text-success' :
                                                                o.status === 'Shipped' ? 'bg-info bg-opacity-10 text-info' :
                                                                    'bg-warning bg-opacity-10 text-warning'
                                                                }`}
                                                            style={{ width: 'auto', fontSize: '0.65rem' }}
                                                            disabled={o._isMessage}
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Completed">Completed</option>
                                                        </select>
                                                    </td>
                                                    <td className="py-4 px-4 border-0 text-end">
                                                        <div className="d-flex gap-2 justify-content-end">
                                                            <button onClick={() => window.open(o.image, '_blank')} className="btn btn-sm glass text-white-50 border-0 p-2"><Eye size={16} /></button>
                                                            <button
                                                                onClick={() => o._isMessage ? deleteMessage(o._id || o.id) : deleteOrder(o._id || o.id)}
                                                                className="btn btn-sm glass text-danger border-0 p-2"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </Motion.div>
                    )}

                    {activeTab === 'products' && (
                        <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="row g-4">
                                {products.map(p => (
                                    <div key={p._id || p.id} className="col-12 col-md-4 col-xl-3">
                                        <div className="glass rounded-4 overflow-hidden border-0 group transition-all hover-translate-y">
                                            <div className="position-relative" style={{ height: '220px' }}>
                                                <img src={p.image} className="w-100 h-100 object-fit-cover transition-all group-hover-scale" alt="" />
                                                <div className="position-absolute top-0 end-0 p-3 d-flex gap-2 transition-all">
                                                    <button onClick={() => {
                                                        setUploadType('shop');
                                                        setEditingProduct(p);
                                                        setFormData({ name: p.name, price: p.price, image: p.image, description: p.description || '', category: '', medium: '' });
                                                        setIsModalOpen(true);
                                                    }} className="btn btn-sm btn-white rounded-circle shadow p-2" title="Edit"><Edit3 size={16} /></button>
                                                    <button onClick={() => {
                                                        if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                                            deleteProduct(p._id || p.id);
                                                        }
                                                    }} className="btn btn-sm btn-danger rounded-circle shadow p-2" title="Delete"><Trash2 size={16} /></button>
                                                </div>
                                                <div className="position-absolute bottom-0 start-0 p-3 w-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                                                    <div className="badge bg-white text-dark rounded-pill shadow-sm">₹{p.price}</div>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h5 className="fw-bold text-white mb-1 truncate">{p.name}</h5>
                                                <div className="d-flex align-items-center gap-2 text-white-50 small">
                                                    <Heart size={14} fill="#ff4d4d" className="text-danger" /> {p.likes || 0} Appreciations
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Motion.div>
                    )}

                    {activeTab === 'gallery' && (
                        <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="row g-3">
                            {galleryItems.map(item => (
                                <div key={item._id || item.id} className="col-6 col-md-3">
                                    <div className="glass rounded-4 overflow-hidden border-0 position-relative group" style={{ height: '200px' }}>
                                        {item.type === 'video' ? (
                                            <video src={item.url} className="w-100 h-100 object-fit-cover" muted loop autoPlay playsInline />
                                        ) : (
                                            <img src={item.url} className="w-100 h-100 object-fit-cover transition-all group-hover-scale" alt="" />
                                        )}
                                        <div className="position-absolute top-0 end-0 p-2 d-flex gap-2 transition-all">
                                            <button onClick={() => {
                                                setUploadType('gallery');
                                                setEditingGalleryItem(item);
                                                setFormData({
                                                    name: item.title,
                                                    price: '',
                                                    image: item.url,
                                                    description: item.description || '',
                                                    category: item.category || 'Other',
                                                    medium: item.medium || 'Handcrafted'
                                                });
                                                setIsModalOpen(true);
                                            }} className="btn btn-sm btn-white rounded-circle shadow p-2" title="Edit"><Edit3 size={16} /></button>
                                            <button onClick={() => {
                                                if (window.confirm(`Are you sure you want to delete this artwork?`)) {
                                                    deleteGalleryItem(item._id || item.id);
                                                }
                                            }} className="btn btn-sm btn-danger rounded-circle shadow p-2" title="Delete"><Trash2 size={16} /></button>
                                        </div>
                                        <div className="position-absolute bottom-0 start-0 p-2 w-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <span className="text-white-50 small truncate" style={{ maxWidth: '70%', fontSize: '0.65rem' }}>{item.title}</span>
                                                <div className="d-flex align-items-center gap-1 text-danger" style={{ fontSize: '0.65rem' }}>
                                                    <Heart size={10} fill="currentColor" />
                                                    <span className="fw-bold text-white">{item.likes || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Motion.div>
                    )}

                    {activeTab === 'messages' && (
                        <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="row g-4">
                            {messages.filter(m => m.type !== 'service').map(m => (
                                <div key={m._id || m.id} className="col-12">
                                    <div className="glass p-4 rounded-4 border-0">
                                        <div className="d-flex justify-content-between align-items-start mb-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold mb-0 text-white">{m.name}</h6>
                                                    <span className="text-muted small">{m.date}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => deleteMessage(m._id || m.id)} className="btn text-danger p-0 border-0"><Trash2 size={18} /></button>
                                        </div>
                                        <div className="bg-white bg-opacity-5 p-4 rounded-4 border border-secondary border-opacity-10">
                                            <p className="mb-0 text-white-50" style={{ whiteSpace: 'pre-wrap' }}>{m.message}</p>
                                        </div>
                                        <div className="mt-4 d-flex flex-wrap gap-4">
                                            <a href={`mailto:${m.email}`} className="text-white-50 text-decoration-none small d-flex align-items-center gap-2 hover-primary transition-all">
                                                <Mail size={14} className="text-primary" /> {m.email}
                                            </a>
                                            {m.phone && (
                                                <a href={`tel:${m.phone}`} className="text-white-50 text-decoration-none small d-flex align-items-center gap-2 hover-primary transition-all">
                                                    <Phone size={14} className="text-primary" /> {m.phone}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Motion.div>
                    )}

                    {activeTab === 'users' && (
                        <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-responsive">
                            <table className="table table-dark table-hover align-middle">
                                <thead>
                                    <tr className="text-muted small text-uppercase border-bottom border-secondary border-opacity-10">
                                        <th className="py-3 px-4 border-0">Identity</th>
                                        <th className="py-3 px-4 border-0">Platform</th>
                                        <th className="py-3 px-4 border-0">Engagement</th>
                                        <th className="py-3 px-4 border-0">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from(new Map(users?.map(u => [u.email || u.id, u])).values()).map(u => (
                                        <tr key={u._id || u.id} className="border-bottom border-secondary border-opacity-10">
                                            <td className="py-4 px-4 border-0">
                                                <div className="d-flex align-items-center gap-3">
                                                    {u.avatar ? (
                                                        <img src={u.avatar} className="rounded-circle" style={{ width: '40px', height: '40px' }} alt="" />
                                                    ) : (
                                                        <div className="bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                            <User size={20} className="text-white-50" />
                                                        </div>
                                                    )}
                                                    <div className="d-flex flex-column">
                                                        <span className="text-white fw-bold small">{u.username || 'Art Collector'}</span>
                                                        <span className="text-muted small" style={{ fontSize: '0.65rem' }}>{u.email || 'Private Account'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 border-0">
                                                <span className={`badge rounded-pill px-3 py-2 ${u.googleId ? 'bg-primary bg-opacity-10 text-primary' : 'bg-secondary bg-opacity-10 text-white-50'}`} style={{ fontSize: '0.65rem' }}>
                                                    {u.googleId ? 'Google verified' : 'Local system'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 border-0">
                                                <div className="d-flex align-items-center gap-2 text-danger small">
                                                    <Heart size={14} fill="currentColor" /> {(u.likedProducts?.length || 0) + (u.likedGallery?.length || 0)}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 border-0 text-muted small">
                                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Motion.div>
                    )}

                    {activeTab === 'settings' && (
                        <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="row">
                            <div className="col-12 col-md-6">
                                <section className="glass p-5 rounded-4 border-0 shadow-lg">
                                    <h4 className="fw-bold mb-4 d-flex align-items-center gap-3">
                                        <Lock size={20} className="text-primary" /> Admin Security
                                    </h4>
                                    <form onSubmit={handlePassChange}>
                                        <div className="mb-4">
                                            <label className="small fw-bold text-muted text-uppercase mb-2 d-block">Set New Access Gateway Key</label>
                                            <input
                                                required
                                                type="password"
                                                placeholder="••••••••••••"
                                                className="form-control bg-dark border-0 text-white py-3 px-4 rounded-4"
                                                style={{ background: 'rgba(255,255,255,0.03) !important', letterSpacing: '0.3em' }}
                                                value={newPass}
                                                onChange={e => setNewPass(e.target.value)}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100 py-3 rounded-4 fw-bold shadow-lg border-0 transition-all hover-translate-y">Update Credentials</button>
                                        {passUpdateStatus && (
                                            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-success small fw-bold">
                                                <CheckCircle size={16} className="me-2" /> {passUpdateStatus}
                                            </Motion.div>
                                        )}
                                    </form>
                                </section>
                            </div>
                        </Motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Modal - Common for Product and Gallery uploads */}
            {isModalOpen && (
                <div className="fixed-top min-vh-100 d-flex align-items-center justify-content-center p-3 animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1050 }}>
                    <Motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass p-5 rounded-5 border border-secondary border-opacity-10 w-100 shadow-2xl"
                        style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h2 className="h4 fw-bold mb-0">
                                {uploadType === 'shop' ? (editingProduct ? 'Edit Inventory' : 'Add to Shop') : (editingGalleryItem ? 'Edit Artwork' : 'Gallery Upload')}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="btn text-white-50 p-2 hover-bg-white-5 rounded-circle border-0 transition-all"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">

                            <div className="d-flex flex-column gap-4">
                                <div>
                                    <label className="small fw-bold text-muted text-uppercase mb-2 d-block" style={{ letterSpacing: '0.05em' }}>Artwork Label</label>
                                    <input
                                        required
                                        placeholder="Enter title..."
                                        className="form-control bg-dark border-0 text-white py-3 px-4 rounded-4"
                                        style={{ background: 'rgba(255,255,255,0.03) !important' }}
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                {uploadType === 'gallery' && (
                                    <div className="row g-3">
                                        <div className="col-12 col-md-6">
                                            <label className="small fw-bold text-muted text-uppercase mb-2 d-block" style={{ letterSpacing: '0.05em' }}>Category</label>
                                            <select
                                                required
                                                className="form-select bg-dark border-0 text-white py-3 px-4 rounded-4"
                                                style={{ background: 'rgba(255,255,255,0.03) !important' }}
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="Painting">Painting</option>
                                                <option value="Pencil Drawing">Pencil Drawing</option>
                                                <option value="Calligraphy">Calligraphy</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="small fw-bold text-muted text-uppercase mb-2 d-block" style={{ letterSpacing: '0.05em' }}>Medium</label>
                                            <input
                                                required
                                                placeholder="e.g. Graphite on Paper"
                                                className="form-control bg-dark border-0 text-white py-3 px-4 rounded-4"
                                                style={{ background: 'rgba(255,255,255,0.03) !important' }}
                                                value={formData.medium}
                                                onChange={e => setFormData({ ...formData, medium: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {uploadType === 'shop' && (
                                    <>
                                        <div>
                                            <label className="small fw-bold text-muted text-uppercase mb-2 d-block">Retail Price (₹)</label>
                                            <div className="input-group glass rounded-4 border-0 overflow-hidden">
                                                <span className="input-group-text bg-transparent border-0 text-primary ps-4">₹</span>
                                                <input
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="form-control bg-transparent border-0 text-white py-3"
                                                    value={formData.price}
                                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="small fw-bold text-muted text-uppercase mb-2 d-block">Public Description</label>
                                            <textarea
                                                required={uploadType === 'shop'}
                                                rows="3"
                                                placeholder="Artistic vision, materials, or context..."
                                                className="form-control bg-dark border-0 text-white py-3 px-4 rounded-4"
                                                style={{ background: 'rgba(255,255,255,0.03) !important', resize: 'none' }}
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="small fw-bold text-muted text-uppercase mb-2 d-block">Visual Resource</label>
                                    <div className="d-flex flex-column gap-3">
                                        <label className="d-flex flex-column align-items-center justify-content-center p-5 rounded-5 cursor-pointer transition-all hover-translate-y" style={{ border: '2px dashed rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
                                            <div className="bg-primary bg-opacity-10 p-3 rounded-pill mb-3 text-primary shadow-lg shadow-primary-10">
                                                <Upload size={24} />
                                            </div>
                                            <span className="fw-bold small text-white-50">Drag & Drop or Multi-Select</span>
                                            <span className="text-muted extra-small mt-1">Images or MP4 Videos supported</span>
                                            <input type="file" accept="image/*,video/*" onChange={handleImageUpload} className="d-none" />
                                        </label>

                                        {formData.image && (
                                            <Motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="position-relative rounded-4 overflow-hidden shadow-2xl" style={{ height: '200px' }}>
                                                {(imageFile?.type?.includes('video') || (editingGalleryItem?.type === 'video')) ? (
                                                    <video src={formData.image} className="w-100 h-100 object-fit-cover" muted controls autoPlay loop playsInline />
                                                ) : (
                                                    <img src={formData.image} className="w-100 h-100 object-fit-cover" alt="" />
                                                )}
                                                <div className="position-absolute top-0 end-0 m-2">
                                                    <button type="button" onClick={() => resetForm()} className="btn btn-sm btn-danger rounded-circle p-2 shadow-lg"><X size={14} /></button>
                                                </div>
                                            </Motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={isUploading} className="btn btn-primary py-3 rounded-4 fw-bold border-0 mt-4 shadow-xl transition-all hover-translate-y">
                                {isUploading ? (
                                    <div className="d-flex align-items-center justify-content-center gap-3">
                                        <span className="spinner-border spinner-border-sm" role="status"></span>
                                        <span>Transmitting Data...</span>
                                    </div>
                                ) : (
                                    (editingProduct || editingGalleryItem) ? 'Commit Changes' : 'Initialize Resource'
                                )}
                            </button>
                        </form>
                    </Motion.div>
                </div>
            )}
        </div>
    );
};

export default Admin;
