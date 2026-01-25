import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
    Package, MessageSquare, ShoppingBag, Plus, Trash2, Edit3, LogOut, X,
    CheckCircle, Upload, Mail, User, Phone, Settings, Lock, Heart,
    Image as ImageIcon, LayoutDashboard, Search, Users as UsersIcon,
    ChevronRight, Filter, ExternalLink, MoreVertical, Eye,
    AlertCircle, TrendingUp, DollarSign, Clock, BarChart3, Brush
} from 'lucide-react';

const Admin = () => {
    const {
        products, addProduct, deleteProduct, updateProduct,
        galleryItems, addGalleryItem, deleteGalleryItem, updateGalleryItem,
        messages, deleteMessage, sendInternalMessage,
        orders, deleteOrder, updateOrderStatus, submitOrderPrice, approveOrderPrice,
        users, updateEmblosStatus,
        isAdmin, setIsAdmin, changePassword, verifyAdminPassword
    } = useContext(AppContext);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadType, setUploadType] = useState('shop'); // 'shop' or 'gallery'
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingGalleryItem, setEditingGalleryItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [msgInput, setMsgInput] = useState('');
    const [planMonths, setPlanMonths] = useState('1');

    // Admin Login State
    const [_uploadProgress, setUploadProgress] = useState(0);
    // ... existing admin auth logic ...
    const [adminLogin, setAdminLogin] = useState({ username: '', password: '' });
    const [adminAuthError, setAdminAuthError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    // Form Data
    // ... existing form data state ...
    const [formData, setFormData] = useState({ name: '', price: '', image: '', description: '', category: '', medium: '' });
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [newPass, setNewPass] = useState('');
    const [passUpdateStatus, setPassUpdateStatus] = useState('');

    const navigate = useNavigate();

    // Statistics Calculation
    const stats = useMemo(() => {
        const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Pending Price').length;
        const totalLikes = products.reduce((sum, p) => sum + (p.likes || 0), 0) + galleryItems.reduce((sum, g) => sum + (g.likes || 0), 0);
        const pendingRequests = users?.filter(u => u.emblosAccess?.status === 'pending').length || 0;

        const emblosCount = users?.filter(u => u.role === 'emblos').length || 0;

        return {
            revenue: totalRevenue,
            pending: pendingOrders,
            likes: totalLikes,
            users: users?.length || 0,
            emblos: emblosCount,
            requests: pendingRequests,
            growth: '+12.5%'
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
            <div className="min-vh-100 d-flex align-items-center justify-content-center px-3 text-center" style={{ background: '#0a0a0a', paddingBottom: '2rem' }}>
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
                    status: 'active' // Admin uploads are active by default
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
                    description: formData.description || '',
                    status: 'active' // Admin uploads are active by default
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
        { id: 'requests', label: 'Requests', icon: AlertCircle, count: stats.requests },
        { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length },
        { id: 'products', label: 'Inventory', icon: Package, count: products.length },
        { id: 'gallery', label: 'Gallery', icon: ImageIcon, count: galleryItems.length },
        { id: 'messages', label: 'Inbox', icon: MessageSquare, count: messages.filter(m => !m.isInternal).length },
        { id: 'users', label: 'Users', icon: UsersIcon, count: users?.length || 0 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="d-flex min-vh-100" style={{ background: '#050505', color: '#fff' }}>

            {/* Desktop Sidebar */}
            <aside className="d-none d-lg-flex flex-column glass border-0 border-end border-secondary border-opacity-10 position-sticky shadow-sm sidebar-hide-scrollbar" style={{ width: '20%', minWidth: '260px', zIndex: 1010, top: '8rem', overflowY: 'auto', height: 'calc(100vh - 8rem)' }}>
                <div className="p-4 mb-4 text-center">
                    <img src="/icon.png" style={{ width: '60px', height: '60px', borderRadius: '15px' }} className="mb-3" />
                    <h2 className="h5 fw-bold mb-0 text-white" style={{ letterSpacing: '-0.5px' }}>Art Void <span className="text-primary">Admin</span></h2>
                </div>

                <nav className="flex-grow-1 px-3">
                    <ul className="list-unstyled d-flex flex-column gap-1">
                        {menuItems.map(item => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => setActiveTab(item.id)}
                                        className={`btn w-100 text-start d-flex align-items-center justify-content-between px-3 py-2 rounded-3 border-0 transition-all ${isActive ? 'bg-primary text-white shadow-lg' : 'text-white-50 hover-bg-white-5'}`}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <Icon size={18} />
                                            <span className="fw-medium small">{item.label}</span>
                                        </div>
                                        {item.count > 0 && (
                                            <span className={`badge rounded-pill ${isActive ? 'bg-white text-primary' : 'bg-danger text-white'}`} style={{ fontSize: '0.7rem' }}>
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
            <main className="flex-grow-1 p-3 p-lg-5" style={{ paddingTop: '12rem', paddingBottom: '100px' }}>

                {/* Header */}
                <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-5 sticky-top py-4 px-0" style={{ top: '8rem', background: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1000 }}>
                    <div>
                        <h1 className="display-6 fw-bold mb-1">
                            {menuItems.find(m => m.id === activeTab)?.label}
                        </h1>
                        <p className="text-muted small mb-0">Manage your art marketplace and users</p>
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
                                { label: 'Total Emblos', value: stats.emblos, icon: Brush, color: 'warning', trend: 'Active' },
                                { label: 'Art Collectors', value: stats.users, icon: UsersIcon, color: 'info', trend: stats.growth },
                            ].map((stat, idx) => (
                                <div key={idx} className="col-12 col-md-6 col-xl">
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
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center h-75 opacity-20 flex-column gap-3">
                                        <BarChart3 size={48} />
                                        <span className="small fw-bold text-uppercase tracking-widest">Growth Metrics Coming Soon</span>
                                    </div>
                                </div>
                            </div>
                        </Motion.div>
                    )}

                    {activeTab === 'requests' && (
                        <Motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="glass p-4 rounded-4 border-0"
                        >
                            <h5 className="fw-bold mb-4">Pending Emblos Requests</h5>
                            <div className="table-responsive">
                                <table className="table table-dark table-hover align-middle">
                                    <thead>
                                        <tr className="text-muted small uppercase">
                                            <th className="border-0">User</th>
                                            <th className="border-0">Plan</th>
                                            <th className="border-0">Message</th>
                                            <th className="border-0 text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users?.filter(u => u.emblosAccess?.status === 'pending').map(u => (
                                            <tr key={u._id} className="border-bottom border-white border-opacity-5">
                                                <td className="border-0 py-3">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <img src={u.avatar || '/icon.png'} className="rounded-circle" style={{ width: '40px', height: '40px' }} alt="" />
                                                        <div>
                                                            <div className="fw-bold small">{u.username}</div>
                                                            <div className="extra-small opacity-50">{u.email}</div>
                                                            <div className="extra-small opacity-50 text-primary">{u.phone}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="border-0">
                                                    <span className="badge bg-primary bg-opacity-10 text-primary">{u.emblosAccess?.plan} Month(s)</span>
                                                </td>
                                                <td className="border-0 small opacity-70">
                                                    {u.emblosAccess?.message || 'No message'}
                                                </td>
                                                <td className="border-0 text-end">
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        <select className="form-select form-select-sm glass border-0 w-auto" value={planMonths} onChange={(e) => setPlanMonths(e.target.value)}>
                                                            <option value="1">1 Mo</option>
                                                            <option value="3">3 Mo</option>
                                                            <option value="6">6 Mo</option>
                                                        </select>
                                                        <button onClick={() => updateEmblosStatus(u._id, { status: 'active', months: planMonths })} className="btn btn-success btn-sm rounded-pill px-3 fw-bold">Accept</button>
                                                        <button onClick={() => updateEmblosStatus(u._id, { status: 'none' })} className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold">Reject</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {users?.filter(u => u.emblosAccess?.status === 'pending').length === 0 && (
                                            <tr><td colSpan="4" className="text-center py-5 opacity-30">No pending requests</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Motion.div>
                    )}

                    {activeTab === 'orders' && (
                        <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="d-flex flex-column gap-4">
                            <div className="table-responsive">
                                <table className="table table-dark table-hover align-middle">
                                    <thead>
                                        <tr className="text-muted opacity-50 border-bottom border-secondary border-opacity-20 uppercase small">
                                            <th className="py-3 px-4 border-0">Item</th>
                                            <th className="py-3 px-4 border-0">Creator (Emblos)</th>
                                            <th className="py-3 px-4 border-0">Customer</th>
                                            <th className="py-3 px-4 border-0">Price</th>
                                            <th className="py-3 px-4 border-0">Status</th>
                                            <th className="py-3 px-4 border-0 text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(o => (
                                            <tr key={o._id} className="border-bottom border-secondary border-opacity-10">
                                                <td className="py-4 px-4 border-0 small">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <img src={o.image} className="rounded-2 shadow-sm" style={{ width: '40px', height: '40px', objectFit: 'cover' }} alt="" />
                                                        <div>
                                                            <div className="fw-bold text-white">{o.productName}</div>
                                                            <div className="extra-small opacity-50">{o.date}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 border-0 small">
                                                    {users.find(u => u._id === o.creatorId)?.username || 'Admin'}
                                                </td>
                                                <td className="py-4 px-4 border-0">
                                                    <div className="d-flex flex-column">
                                                        <span className="text-white-50 small fw-medium">{o.customer || 'Guest'}</span>
                                                        <span className="text-muted small" style={{ fontSize: '0.65rem' }}>{o.phone}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 border-0">
                                                    {o.price ? <span className="text-primary fw-bold">₹{o.price}</span> : <span className="text-warning small italic">Waiting for Emblos</span>}
                                                </td>
                                                <td className="py-4 px-4 border-0">
                                                    <span className={`badge rounded-pill px-3 py-1 ${o.status === 'Approved' ? 'bg-success' : 'bg-warning'} bg-opacity-10 text-${o.status === 'Approved' ? 'success' : 'warning'}`}>
                                                        {o.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 border-0 text-end">
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        {o.status === 'Price Submitted' && (
                                                            <button onClick={() => approveOrderPrice(o._id)} className="btn btn-sm btn-primary rounded-pill px-3">Approve Price</button>
                                                        )}
                                                        <button onClick={() => { if (window.confirm('Delete order?')) deleteOrder(o._id) }} className="btn btn-sm glass text-danger border-0 p-2"><Trash2 size={16} /></button>
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
                                                <div className="position-absolute top-0 start-0 p-3">
                                                    <div className={`badge ${p.status === 'active' ? 'bg-success' : (p.status === 'frozen' ? 'bg-danger' : 'bg-warning')} rounded-pill`}>{p.status}</div>
                                                </div>
                                                <div className="position-absolute bottom-0 start-0 p-3 w-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                                                    <div className="badge bg-white text-dark rounded-pill shadow-sm">₹{p.price}</div>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h5 className="fw-bold text-white mb-1 truncate">{p.name}</h5>
                                                <div className="d-flex align-items-center gap-2 text-white-50 small">
                                                    <User size={12} /> {users.find(u => u._id === p.creatorId)?.username || 'Admin'}
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
                                            <button onClick={() => { if (window.confirm(`Are you sure you want to delete this artwork?`)) deleteGalleryItem(item._id || item.id); }} className="btn btn-sm btn-danger rounded-circle shadow p-2" title="Delete"><Trash2 size={16} /></button>
                                        </div>
                                        <div className="position-absolute top-0 start-0 p-2">
                                            <div className={`badge ${item.status === 'active' ? 'bg-success' : (item.status === 'frozen' ? 'bg-danger' : 'bg-warning')} rounded-pill`} style={{ fontSize: '0.6rem' }}>{item.status}</div>
                                        </div>
                                        <div className="position-absolute bottom-0 start-0 p-2 w-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <span className="text-white-50 small truncate" style={{ maxWidth: '70%', fontSize: '0.65rem' }}>{item.title}</span>
                                                <div className="d-flex align-items-center gap-1 text-danger" style={{ fontSize: '0.65rem' }}>
                                                    <Heart size={10} fill="currentColor" /> <span className="fw-bold text-white">{item.likes || 0}</span>
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
                            {messages.filter(m => !m.isInternal).map(m => (
                                <div key={m._id || m.id} className="col-12">
                                    <div className="glass p-4 rounded-4 border-0">
                                        <div className="d-flex justify-content-between align-items-start mb-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary"><User size={20} /></div>
                                                <div>
                                                    <h6 className="fw-bold mb-0 text-white">{m.name}</h6>
                                                    <span className="text-muted small">{m.date}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => deleteMessage(m._id || m.id)} className="btn text-danger p-0 border-0"><Trash2 size={18} /></button>
                                        </div>
                                        <div className="bg-white bg-opacity-5 p-4 rounded-4 border border-secondary border-opacity-10">
                                            <div className="d-flex flex-column gap-3">
                                                {m.image && (
                                                    <img src={m.image} className="rounded-3 shadow-sm" style={{ width: '100px', height: '100px', objectFit: 'cover' }} alt="" />
                                                )}
                                                <p className="mb-0 text-white-50" style={{ whiteSpace: 'pre-wrap' }}>{m.message}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 d-flex flex-wrap gap-4 small opacity-70">
                                            <span>Email: {m.email}</span>
                                            <span>Phone: {m.phone}</span>
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
                                        <th className="py-3 px-4 border-0">Role</th>
                                        <th className="py-3 px-4 border-0">Status</th>
                                        <th className="py-3 px-4 border-0 text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users?.map(u => (
                                        <tr key={u._id} className="border-bottom border-secondary border-opacity-10">
                                            <td className="py-4 px-4 border-0">
                                                <div className="d-flex align-items-center gap-3">
                                                    <img src={u.avatar || '/icon.png'} className="rounded-circle" style={{ width: '40px', height: '40px' }} alt="" />
                                                    <div className="d-flex flex-column">
                                                        <span className="text-white fw-bold small">{u.username}</span>
                                                        <span className="text-muted small" style={{ fontSize: '0.65rem' }}>{u.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 border-0">
                                                <span className={`badge rounded-pill ${u.role === 'emblos' ? 'bg-primary' : 'bg-secondary'} bg-opacity-10 text-${u.role === 'emblos' ? 'primary' : 'muted'} small`}>
                                                    {u.role?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 border-0">
                                                <span className={`badge bg-${u.isFrozen ? 'danger' : 'success'} bg-opacity-10 text-${u.isFrozen ? 'danger' : 'success'}`}>
                                                    {u.isFrozen ? 'Frozen' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 border-0 text-end">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <button onClick={() => setSelectedUser(u)} className="btn btn-sm glass text-white border-0"><Eye size={16} /></button>
                                                    {u.role === 'emblos' && (
                                                        <button
                                                            onClick={() => updateEmblosStatus(u._id, { status: u.isFrozen ? 'unfreeze' : 'frozen' })}
                                                            className={`btn btn-sm ${u.isFrozen ? 'btn-success' : 'btn-danger'} rounded-pill`}
                                                        >
                                                            {u.isFrozen ? 'Unfreeze' : 'Freeze'}
                                                        </button>
                                                    )}
                                                </div>
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
            {
                isModalOpen && (
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
                                        <label className="small fw-bold text-muted text-uppercase mb-2 d-block">Choose Picture / Video</label>
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
                )
            }
        </div >
    );
};

export default Admin;
