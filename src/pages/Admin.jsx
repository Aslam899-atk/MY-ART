import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
    Package, MessageSquare, ShoppingBag, Plus, Trash2, Edit3, LogOut, X,
    CheckCircle, Upload, Mail, User, Phone, Settings, Lock, Heart,
    Image as ImageIcon, LayoutDashboard, Search, Users as UsersIcon,
    ChevronRight, Filter, ExternalLink, MoreVertical, Eye,
    AlertCircle, TrendingUp, DollarSign, Clock, BarChart3, Brush, Send
} from 'lucide-react';
import ItemPreview from '../components/ItemPreview';

const Admin = () => {
    const {
        products, addProduct, deleteProduct, updateProduct,
        galleryItems, addGalleryItem, deleteGalleryItem, updateGalleryItem,
        messages, deleteMessage, sendInternalMessage,
        orders, deleteOrder, updateOrderStatus, submitOrderPrice, approveOrderPrice, claimOrder,
        users, updateEmblosStatus,
        isAdmin, setIsAdmin, verifyAdminPassword,
        toggleLike, toggleGalleryLike, likedIds, user
    } = useContext(AppContext);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadType, setUploadType] = useState('shop'); // 'shop' or 'gallery'
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingGalleryItem, setEditingGalleryItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderFilter, setOrderFilter] = useState('all'); // 'all' or 'tasks'
    const [claimPrices, setClaimPrices] = useState({});
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
    const [deleteEmail, setDeleteEmail] = useState('');
    const [isDeletingUser, setIsDeletingUser] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState({ error: '', success: '' });
    const [emblosRate, setEmblosRate] = useState('');
    const [commissionRate, setCommissionRate] = useState('10');
    const [emblosRules, setEmblosRules] = useState('');
    const [isUpdatingConfig, setIsUpdatingConfig] = useState(false);
    const [commentModalItem, setCommentModalItem] = useState(null);
    const [messageTarget, setMessageTarget] = useState(null); // { id, name } or 'all_emblos'
    const [internalMsg, setInternalMsg] = useState('');
    const [isSendingInternal, setIsSendingInternal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { deleteUserByEmail, appSettings, updateAppSetting } = useContext(AppContext);

    useEffect(() => {
        if (appSettings.emblos_config) {
            setEmblosRate(appSettings.emblos_config.monthlyFee || '');
            setCommissionRate(appSettings.emblos_config.commissionRate || '10');
            setEmblosRules(appSettings.emblos_config.rules?.join('\n') || '');
        }
    }, [appSettings.emblos_config]);

    const navigate = useNavigate();

    // Statistics Calculation
    const stats = useMemo(() => {
        const totalVolume = orders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
        const adminEarnings = orders.reduce((sum, o) => sum + (Number(o.adminCommission) || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Pending Price').length;
        const totalLikes = products.reduce((sum, p) => sum + (p.likes || 0), 0) + galleryItems.reduce((sum, g) => sum + (g.likes || 0), 0);
        const pendingRequests = users?.filter(u => u.emblosAccess?.status === 'pending').length || 0;

        const emblosCount = users?.filter(u => u.role === 'emblos').length || 0;

        const totalRequests = orders.filter(o => !o.creatorId).length;

        return {
            revenue: totalVolume,
            adminEarnings: adminEarnings,
            pending: pendingOrders,
            likes: totalLikes,
            users: users?.length || 0,
            emblos: emblosCount,
            requests: pendingRequests,
            tasks: totalRequests,
            growth: '+12.5%'
        };
    }, [orders, products, galleryItems, users]);

    // Sidebar items update
    const menuItems = useMemo(() => [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'requests', label: 'Requests', icon: AlertCircle, count: stats.requests },
        { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length, tasks: stats.tasks },
        { id: 'products', label: 'Inventory', icon: Package, count: products.length },
        { id: 'gallery', label: 'Gallery', icon: ImageIcon, count: galleryItems.length },
        { id: 'messages', label: 'Inbox', icon: MessageSquare, count: messages.filter(m => !m.isInternal).length },
        { id: 'emblos', label: 'Artists (Emblos)', icon: Brush, count: users?.filter(u => u.role === 'emblos').length || 0 },
        { id: 'collectors', label: 'Art Collectors', icon: UsersIcon, count: users?.filter(u => u.role !== 'emblos').length || 0 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ], [stats, orders, products, galleryItems, messages, users]);

    // Enhanced Search & Filtering Logic
    const q = searchQuery.toLowerCase();

    const filteredUsers = useMemo(() => {
        const base = users.filter(u => u.role !== 'emblos');
        if (!q) return base;
        return base.filter(u =>
            u.username?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u._id?.toString().includes(q)
        );
    }, [users, q]);

    const filteredEmblos = useMemo(() => {
        const base = users.filter(u => u.role === 'emblos');
        if (!q) return base;
        return base.filter(u =>
            u.username?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u._id?.toString().includes(q)
        );
    }, [users, q]);

    const filteredOrders = useMemo(() => {
        let base = orders;
        // Filter based on role if not admin
        if (!isAdmin && user?.role === 'emblos') {
            const userId = (user._id || user.id)?.toString();
            base = orders.filter(o => {
                // Own assigned orders
                if (o.creatorId?.toString() === userId) return true;
                // Open external requests (no productId means it's not a shop/gallery item)
                if (!o.creatorId && !o.productId) return true;
                return false;
            });
        }
        if (!q) return base;
        return base.filter(o =>
            o.productName?.toLowerCase().includes(q) ||
            o.customer?.toLowerCase().includes(q) ||
            o.email?.toLowerCase().includes(q) ||
            o.phone?.toLowerCase().includes(q) ||
            o._id?.toString().includes(q)
        );
    }, [orders, q, isAdmin, user]);

    const filteredProducts = useMemo(() => {
        if (!q) return products;
        return products.filter(p =>
            p.name?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
        );
    }, [products, q]);

    const filteredGalleryItems = useMemo(() => {
        if (!q) return galleryItems;
        return galleryItems.filter(i =>
            i.title?.toLowerCase().includes(q) ||
            i.category?.toLowerCase().includes(q) ||
            i.medium?.toLowerCase().includes(q)
        );
    }, [galleryItems, q]);

    const filteredMessages = useMemo(() => {
        if (!q) return messages;
        return messages.filter(m =>
            m.name?.toLowerCase().includes(q) ||
            m.email?.toLowerCase().includes(q) ||
            m.message?.toLowerCase().includes(q)
        );
    }, [messages, q]);

    const filteredRequests = useMemo(() => {
        const base = users.filter(u => u.emblosAccess?.status === 'pending');
        if (!q) return base;
        return base.filter(u =>
            u.username?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q)
        );
    }, [users, q]);

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

    const handleDeleteUser = async (e) => {
        e.preventDefault();
        setDeleteStatus({ error: '', success: '' });
        setIsDeletingUser(true);

        const result = await deleteUserByEmail(deleteEmail);
        setIsDeletingUser(false);

        if (result.success) {
            setDeleteStatus({ error: '', success: 'User and all associated data deleted successfully' });
            setDeleteEmail('');
        } else {
            setDeleteStatus({ error: result.message || 'Deletion failed', success: '' });
        }
    };

    const handleUpdateEmblosConfig = async (e) => {
        e.preventDefault();
        setIsUpdatingConfig(true);
        const rulesArray = emblosRules.split('\n').filter(r => r.trim());
        await updateAppSetting('emblos_config', {
            monthlyFee: emblosRate,
            commissionRate: commissionRate,
            rules: rulesArray
        });
        setIsUpdatingConfig(false);
        alert('Configuration Updated Successfully!');
    };

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
                                            <div className="d-flex gap-1">
                                                {item.tasks > 0 && (
                                                    <span className="badge rounded-pill bg-danger text-white blink shadow-glow" style={{ fontSize: '0.65rem' }}>
                                                        {item.tasks} TASK
                                                    </span>
                                                )}
                                                <span className={`badge rounded-pill ${isActive ? 'bg-white text-primary' : 'bg-primary bg-opacity-10 text-primary'}`} style={{ fontSize: '0.7rem' }}>
                                                    {item.count}
                                                </span>
                                            </div>
                                        )}
                                    </button >
                                </li >
                            );
                        })}
                    </ul >
                </nav >

                <div className="p-4 border-top border-secondary border-opacity-10">
                    <button onClick={handleLogout} className="btn w-100 glass text-danger border-0 py-2 d-flex align-items-center gap-3 justify-content-center rounded-3">
                        <LogOut size={16} /> <span className="fw-bold small text-uppercase">Logout</span>
                    </button>
                </div>
            </aside >

            {/* Mobile Bottom Nav */}
            <nav className="d-lg-none fixed-bottom glass border-top border-secondary border-opacity-10 py-2 px-3 d-flex justify-content-between align-items-center h-navbar shadow-2xl" style={{ zIndex: 1000 }}>
                {
                    menuItems.slice(0, 5).map(item => {
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
                    })
                }
            </nav >

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
                        {/* Global Search Bar - Persistent Across Tabs */}
                        {activeTab !== 'dashboard' && activeTab !== 'settings' && (
                            <div className="glass p-2 rounded-pill d-flex align-items-center gap-2 px-3 shadow-lg" style={{ minWidth: '300px', background: 'rgba(255,255,255,0.03)' }}>
                                <Search size={16} className="text-muted" />
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab}...`}
                                    className="form-control bg-transparent border-0 text-white shadow-none p-0 small"
                                    style={{ fontSize: '0.85rem' }}
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="btn btn-link p-0 text-muted opacity-50 hover-opacity-100">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        )}

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
                                { label: 'Total Volume', value: `₹${stats.revenue}`, icon: DollarSign, color: 'primary', trend: '+5.4%' },
                                { label: 'Admin Commission', value: `₹${stats.adminEarnings}`, icon: TrendingUp, color: 'success', trend: 'Direct Profit' },
                                { label: 'Active Orders', value: stats.pending, icon: ShoppingBag, color: 'info', trend: 'In Progress' },
                                { label: 'Total Emblos', value: stats.emblos, icon: Brush, color: 'warning', trend: 'Verified' },
                                { label: 'Collectors', value: stats.users, icon: UsersIcon, color: 'danger', trend: stats.growth },
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
                                        {filteredRequests.map(u => (
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
                                                    <span className="badge bg-primary bg-opacity-10 text-primary">New Artist</span>
                                                </td>
                                                <td className="border-0 small opacity-70">
                                                    {u.emblosAccess?.message || 'No message'}
                                                </td>
                                                <td className="border-0 text-end">
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        <button onClick={() => updateEmblosStatus(u._id, { status: 'active' })} className="btn btn-success btn-sm rounded-pill px-4 fw-bold">Approve Artist</button>
                                                        <button onClick={() => updateEmblosStatus(u._id, { status: 'none' })} className="btn btn-outline-danger btn-sm rounded-pill px-4 fw-bold">Reject</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredRequests.length === 0 && (
                                            <tr><td colSpan="4" className="text-center py-5 opacity-30">No pending requests</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Motion.div>
                    )}

                    {activeTab === 'orders' && (
                        <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="d-flex flex-column gap-4">
                            {/* Orders / Task Center Toggle */}
                            <div className="d-flex gap-3 mb-2">
                                <button
                                    onClick={() => setOrderFilter('all')}
                                    className={`btn rounded-pill px-4 py-2 small fw-bold border-0 transition-all ${orderFilter === 'all' ? 'btn-primary shadow-glow' : 'glass text-white opacity-50'}`}
                                >
                                    All Orders
                                </button>
                                <button
                                    onClick={() => setOrderFilter('tasks')}
                                    className={`btn rounded-pill px-4 py-2 small fw-bold border-0 transition-all ${orderFilter === 'tasks' ? 'btn-primary shadow-glow' : 'glass text-white opacity-50'}`}
                                >
                                    <Clock size={16} className="me-2" /> Task Center (Requests)
                                </button>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-dark table-hover align-middle">
                                    <thead>
                                        <tr className="text-muted opacity-50 border-bottom border-secondary border-opacity-20 uppercase small">
                                            <th className="py-3 px-4 border-0">Item</th>
                                            <th className="py-3 px-4 border-0">Reference</th>
                                            <th className="py-3 px-4 border-0">Creator (Emblos)</th>
                                            <th className="py-3 px-4 border-0">Customer</th>
                                            <th className="py-3 px-4 border-0">Price</th>
                                            <th className="py-3 px-4 border-0">Est. Days</th>
                                            <th className="py-3 px-4 border-0">{isAdmin ? 'Commission' : 'Earning'}</th>
                                            <th className="py-3 px-4 border-0">Status</th>
                                            <th className="py-3 px-4 border-0 text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.filter(o => {
                                            if (orderFilter === 'tasks') return !o.creatorId;
                                            return true;
                                        }).map(o => (
                                            <tr key={o._id} className="border-bottom border-secondary border-opacity-10">
                                                <td className="py-4 px-4 border-0 small">
                                                    <div className="d-flex align-items-center gap-3">
                                                        {o.image ? (
                                                            <div className="position-relative group" onClick={() => setCommentModalItem({ ...o, title: o.productName, url: o.image, status: 'Drawing Reference' })}>
                                                                <img
                                                                    src={o.image}
                                                                    className="rounded-3 shadow-sm cursor-pointer transition-all hover-scale"
                                                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                                    alt=""
                                                                />
                                                                <div className="position-absolute top-50 start-50 translate-middle opacity-0 group-hover-opacity-100 transition-all pointer-events-none">
                                                                    <Eye size={20} className="text-white shadow-lg" />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="glass rounded-3 d-flex align-items-center justify-content-center cursor-pointer"
                                                                style={{ width: '60px', height: '60px' }}
                                                                onClick={() => setCommentModalItem({ ...o, title: o.productName, url: null })}
                                                            >
                                                                <ImageIcon size={20} className="opacity-20" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="fw-bold text-white fs-6">{o.productName}</div>
                                                            <div className="extra-small opacity-50">{o.date}</div>
                                                            {o.productId && <div className="extra-small text-primary fw-bold" style={{ fontSize: '0.6rem' }}>Shop Link: Active</div>}
                                                            {!o.productId && <div className="extra-small text-warning fw-bold" style={{ fontSize: '0.6rem' }}>External Request</div>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 border-0">
                                                    {o.image ? (
                                                        <button
                                                            onClick={() => setCommentModalItem({ ...o, title: o.productName, url: o.image, status: 'Drawing Reference' })}
                                                            className="btn btn-sm btn-primary py-1 px-3 rounded-pill extra-small fw-bold d-flex align-items-center gap-2"
                                                        >
                                                            <ImageIcon size={12} /> View Reference
                                                        </button>
                                                    ) : (
                                                        <span className="extra-small text-muted italic">No Image</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 border-0 small">
                                                    {o.creatorId ? (
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span className="fw-bold text-white">{users.find(u => (u._id || u.id) === o.creatorId)?.username || 'Unknown Artist'}</span>
                                                            {isAdmin && (
                                                                <button onClick={() => updateOrderStatus(o._id, null, false, true)} className="btn btn-link p-0 text-muted" title="Unassign">
                                                                    <X size={12} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex flex-column gap-2">
                                                            {o.productId ? (
                                                                <span className="fw-bold text-white small opacity-75">Art Void (Main)</span>
                                                            ) : (
                                                                <>
                                                                    <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3 py-1 fw-bold" style={{ width: 'fit-content', fontSize: '0.65rem' }}>OPEN REQUEST</span>
                                                                    <div className="d-flex flex-column gap-2">
                                                                        {(isAdmin || user?.role === 'emblos') && (
                                                                            <button
                                                                                onClick={() => {
                                                                                    const suggestedPrice = claimPrices[o._id] || "";
                                                                                    const price = window.prompt("Claim Order: Enter your price (₹)", suggestedPrice);
                                                                                    if (price && !isNaN(price)) {
                                                                                        const days = window.prompt("Claim Order: How many days will it take? (1 - 30)");
                                                                                        if (days && !isNaN(days)) {
                                                                                            const d = Number(days);
                                                                                            if (d >= 1 && d <= 30) {
                                                                                                claimOrder(o._id, price, d);
                                                                                            } else {
                                                                                                alert("Please enter a number between 1 and 30.");
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }}
                                                                                className="btn btn-primary btn-sm rounded-pill px-3 fw-bold shadow-glow"
                                                                            >
                                                                                Claim Order
                                                                            </button>
                                                                        )}

                                                                        {isAdmin && (
                                                                            <div className="mt-2 border-top border-secondary border-opacity-10 pt-2">
                                                                                <div className="extra-small text-muted mb-1">Admin: Force Assign</div>
                                                                                <select
                                                                                    className="form-select form-select-sm glass border-0 text-primary fw-bold"
                                                                                    style={{ width: '150px', fontSize: '0.7rem' }}
                                                                                    onChange={async (e) => {
                                                                                        if (e.target.value) {
                                                                                            const price = window.prompt("Force Assign: Enter Price (₹)", claimPrices[o._id] || "");
                                                                                            if (price && !isNaN(price)) {
                                                                                                const days = window.prompt("Force Assign: How many days for this artist? (1 - 30)");
                                                                                                if (days && !isNaN(days)) {
                                                                                                    await claimOrder(o._id, price, Number(days), e.target.value);
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    defaultValue=""
                                                                                >
                                                                                    <option value="" className="bg-dark">Select Artist...</option>
                                                                                    {users.filter(u => u.role === 'emblos').map(artist => (
                                                                                        <option key={artist._id} value={artist._id} className="bg-dark">
                                                                                            {artist.username}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 border-0">
                                                    <div className="d-flex flex-column">
                                                        <span className="text-white-50 small fw-medium">{o.customer || 'Guest'}</span>
                                                        <span className="text-muted small" style={{ fontSize: '0.65rem' }}>{o.phone}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 border-0">
                                                    {o.price ? (
                                                        <span className="text-primary fw-bold">₹{o.price}</span>
                                                    ) : (
                                                        <div className="input-group input-group-sm" style={{ maxWidth: '120px' }}>
                                                            <span className="input-group-text bg-transparent border-secondary border-opacity-20 text-primary">₹</span>
                                                            <input
                                                                type="number"
                                                                className="form-control glass border-secondary border-opacity-20 text-white"
                                                                placeholder="Price"
                                                                value={claimPrices[o._id] || ''}
                                                                onChange={(e) => setClaimPrices({ ...claimPrices, [o._id]: e.target.value })}
                                                            />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 border-0">
                                                    {o.estimatedDays ? (
                                                        <span className="badge bg-info bg-opacity-10 text-info">{o.estimatedDays} Days</span>
                                                    ) : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 border-0">
                                                    {o.price ? (
                                                        <span className={isAdmin ? 'text-danger' : 'text-success'}>
                                                            ₹{isAdmin ? (o.adminCommission || 0).toFixed(2) : (o.artistEarnings || 0).toFixed(2)}
                                                        </span>
                                                    ) : '-'}
                                                </td>
                                                <td className="py-4 px-4 border-0">
                                                    <select
                                                        className={`form-select form-select-sm glass border-0 text-white fw-bold ${(!isAdmin && o.creatorId?.toString() === (user?._id || user?.id)?.toString()) ? 'shadow-glow-blue' : ''}`}
                                                        style={{ width: '140px', fontSize: '0.75rem', cursor: 'pointer' }}
                                                        value={o.deliveryStatus || 'Pending'}
                                                        onChange={(e) => updateOrderStatus(o._id, e.target.value, true)}
                                                        disabled={!isAdmin && o.creatorId?.toString() !== (user?._id || user?.id)?.toString()}
                                                    >
                                                        <option value="Pending" className="bg-dark">⏳ Pending</option>
                                                        <option value="Shipped" className="bg-dark">🚚 Shipped</option>
                                                        <option value="Completed" className="bg-dark">✅ Completed</option>
                                                    </select>
                                                </td>
                                                <td className="py-4 px-4 border-0 text-end">
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        {o.status === 'Price Submitted' && isAdmin && (
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
                                {filteredProducts.map(p => (
                                    <div key={p._id || p.id} className="col-12 col-md-4 col-xl-3">
                                        <div className="glass rounded-4 overflow-hidden border-0 group transition-all hover-translate-y">
                                            <div className="position-relative cursor-pointer" style={{ height: '220px' }} onClick={() => setCommentModalItem(p)}>
                                                <img src={p.image} className="w-100 h-100 object-fit-cover transition-all group-hover-scale" alt="" />
                                                <div className="position-absolute top-0 end-0 p-3 d-flex gap-2 transition-all">
                                                    <button onClick={() => setCommentModalItem(p)} className="btn btn-sm btn-white rounded-circle shadow p-2" title="Comments"><MessageSquare size={16} /></button>
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
                            {filteredGalleryItems.map(item => (
                                <div key={item._id || item.id} className="col-6 col-md-3">
                                    <div className="glass rounded-4 overflow-hidden border-0 position-relative group cursor-pointer" style={{ height: '200px' }} onClick={() => setCommentModalItem(item)}>
                                        {item.type === 'video' ? (
                                            <video src={item.url} className="w-100 h-100 object-fit-cover" muted loop autoPlay playsInline />
                                        ) : (
                                            <img src={item.url} className="w-100 h-100 object-fit-cover transition-all group-hover-scale" alt="" />
                                        )}
                                        <div className="position-absolute top-0 end-0 p-2 d-flex gap-2 transition-all">
                                            <button onClick={() => setCommentModalItem(item)} className="btn btn-sm btn-white rounded-circle shadow p-2" title="Comments"><MessageSquare size={16} /></button>
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
                            {filteredMessages.map(m => {
                                const sender = m.senderId ? users.find(u => (u._id || u.id) === m.senderId) : null;
                                const senderName = sender ? sender.username : (m.name || 'System');

                                return (
                                    <div key={m._id || m.id} className="col-12">
                                        <div className="glass p-4 rounded-4 border-0">
                                            <div className="d-flex justify-content-between align-items-start mb-4">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="bg-primary bg-opacity-10 p-2 rounded-circle text-primary">
                                                        {m.isInternal ? <MessageSquare size={20} /> : <User size={20} />}
                                                    </div>
                                                    <div>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <h6 className="fw-bold mb-0 text-white">{senderName}</h6>
                                                            {m.isInternal && <span className="badge bg-primary bg-opacity-10 text-primary extra-small">Internal</span>}
                                                            {!m.isInternal && <span className="badge bg-success bg-opacity-10 text-success extra-small">Public Inquiry</span>}
                                                        </div>
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
                                                {m.email && <span>Email: {m.email}</span>}
                                                {m.phone && <span>Phone: {m.phone}</span>}
                                                {m.isInternal && m.receiverId === 'all_emblos' && <span className="text-primary fw-bold">Target: All Emblos Artists</span>}
                                                {m.isInternal && m.receiverId !== 'all_emblos' && (
                                                    <span className="text-primary fw-bold">Target: {users.find(u => (u._id || u.id) === m.receiverId)?.username || 'Direct Message'}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </Motion.div>
                    )}

                    {(activeTab === 'emblos' || activeTab === 'collectors') && (
                        <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-responsive">
                            <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                                <h5 className="fw-bold mb-0">{activeTab === 'emblos' ? 'Artist Registry' : 'Collector Database'}</h5>
                                {activeTab === 'emblos' && (
                                    <button
                                        onClick={() => setMessageTarget({ id: 'all_emblos', name: 'All Emblos Artists' })}
                                        className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-2"
                                    >
                                        <Send size={14} /> Global Broadcast
                                    </button>
                                )}
                            </div>
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
                                    {(activeTab === 'emblos' ? filteredEmblos : filteredUsers).map(u => (
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
                                                <div className="d-flex flex-column gap-1">
                                                    <span className={`badge bg-${u.isFrozen ? 'danger' : 'success'} bg-opacity-10 text-${u.isFrozen ? 'danger' : 'success'} d-inline-block`} style={{ width: 'fit-content' }}>
                                                        {u.isFrozen ? 'Frozen' : 'Active'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 border-0 text-end">
                                                <div className="d-flex gap-2 justify-content-end align-items-center">
                                                    {u.role === 'emblos' && (
                                                        <>
                                                            <button
                                                                onClick={() => setMessageTarget({ id: u._id || u.id, name: u.username })}
                                                                className="btn btn-sm glass text-primary border-0 rounded-circle p-2"
                                                                title="Message Artist"
                                                            >
                                                                <MessageSquare size={16} />
                                                            </button>

                                                            <div className="d-flex gap-2 align-items-center bg-white bg-opacity-5 p-1 px-2 rounded-pill shadow-sm border border-white border-opacity-5">
                                                                {u.isFrozen ? (
                                                                    <button
                                                                        onClick={() => updateEmblosStatus(u._id, { status: 'unfreeze' })}
                                                                        className="btn btn-sm btn-success rounded-pill extra-small px-3 py-1 fw-bold shadow-glow"
                                                                    >
                                                                        Unfreeze
                                                                    </button>
                                                                ) : (
                                                                    <div className="d-flex gap-1">
                                                                        <button
                                                                            onClick={() => { if (window.confirm(`Freeze access for ${u.username}?`)) updateEmblosStatus(u._id, { status: 'frozen' }); }}
                                                                            className="btn btn-sm btn-danger rounded-pill extra-small px-3 py-1 fw-bold"
                                                                        >
                                                                            Freeze
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}

                                                    {activeTab !== 'collectors' && (
                                                        <button onClick={() => setSelectedUser(u)} className="btn btn-sm glass text-white border-0" title="View Identity Details">
                                                            <Eye size={16} />
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={async () => {
                                                            if (window.confirm(`Are you sure you want to PERMANENTLY delete user "${u.username}" (${u.email}) and all their artworks? This cannot be undone.`)) {
                                                                const res = await deleteUserByEmail(u.email);
                                                                if (!res.success) alert(res.message);
                                                            }
                                                        }}
                                                        className="btn btn-sm btn-outline-danger rounded-circle p-2"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(activeTab === 'emblos' ? filteredEmblos : filteredUsers).length === 0 && (
                                        <tr><td colSpan="4" className="text-center py-5 opacity-30 small">No {activeTab} found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </Motion.div>
                    )}

                    {activeTab === 'settings' && (
                        <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="row">
                            <div className="col-12">
                                <section className="glass p-5 rounded-4 border-0 shadow-lg border-danger-subtle">
                                    <h4 className="fw-bold mb-4 d-flex align-items-center gap-3 text-danger">
                                        <Trash2 size={20} /> Danger Zone
                                    </h4>
                                    <p className="text-muted small mb-4">Request account termination by entering the associated Gmail address. This action is irreversible.</p>
                                    <form onSubmit={handleDeleteUser}>
                                        <div className="mb-4">
                                            <label className="small fw-bold text-muted text-uppercase mb-2 d-block">User Gmail Address</label>
                                            <div className="input-group glass rounded-4 border-0 overflow-hidden">
                                                <span className="input-group-text bg-transparent border-0 text-white-50 ps-4"><Mail size={16} /></span>
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="user@gmail.com"
                                                    className="form-control bg-transparent border-0 text-white py-3"
                                                    value={deleteEmail}
                                                    onChange={e => setDeleteEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex gap-3">
                                            <button
                                                type="submit"
                                                disabled={isDeletingUser}
                                                className="btn btn-danger flex-grow-1 py-3 rounded-4 fw-bold shadow-lg border-0 transition-all hover-translate-y d-flex align-items-center justify-content-center gap-2"
                                            >
                                                {isDeletingUser && <span className="spinner-border spinner-border-sm" role="status"></span>}
                                                {isDeletingUser ? 'Processing...' : 'Delete Account'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteEmail('')}
                                                className="btn glass px-4 py-3 rounded-4 fw-bold border-0 transition-all hover-bg-white-5"
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                        {deleteStatus.success && (
                                            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-success small fw-bold">
                                                <CheckCircle size={16} className="me-2" /> {deleteStatus.success}
                                            </Motion.div>
                                        )}
                                        {deleteStatus.error && (
                                            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-danger small fw-bold">
                                                <AlertCircle size={16} className="me-2" /> {deleteStatus.error}
                                            </Motion.div>
                                        )}
                                    </form>
                                </section>
                            </div>

                            <div className="col-12 col-md-6 mt-4">
                                <section className="glass p-5 rounded-4 border-0 shadow-lg">
                                    <h4 className="fw-bold mb-4 d-flex align-items-center gap-3">
                                        <Brush size={20} className="text-primary" /> Emblos Configuration
                                    </h4>
                                    <form onSubmit={handleUpdateEmblosConfig}>
                                        <div className="row g-3 mb-4">
                                            <div className="col-12 col-md-6">
                                                <label className="small fw-bold text-muted text-uppercase mb-2 d-block">Monthly Entry Fee (₹)</label>
                                                <div className="input-group glass rounded-4 border-0 overflow-hidden">
                                                    <span className="input-group-text bg-transparent border-0 text-primary ps-4">₹</span>
                                                    <input
                                                        type="number"
                                                        placeholder="e.g. 0"
                                                        className="form-control bg-transparent border-0 text-white py-3"
                                                        value={emblosRate}
                                                        onChange={e => setEmblosRate(e.target.value)}
                                                    />
                                                </div>
                                                <p className="extra-small text-muted mt-1 ps-1">Set to 0 if only commission based.</p>
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="small fw-bold text-muted text-uppercase mb-2 d-block">Admin Commission (%)</label>
                                                <div className="input-group glass rounded-4 border-0 overflow-hidden">
                                                    <span className="input-group-text bg-transparent border-0 text-success ps-4">%</span>
                                                    <input
                                                        required
                                                        type="number"
                                                        placeholder="e.g. 10"
                                                        className="form-control bg-transparent border-0 text-white py-3"
                                                        value={commissionRate}
                                                        onChange={e => setCommissionRate(e.target.value)}
                                                    />
                                                </div>
                                                <p className="extra-small text-muted mt-1 ps-1">Percentage taken from every order.</p>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="small fw-bold text-muted text-uppercase mb-2 d-block">Access Rules (One per line)</label>
                                            <textarea
                                                rows="5"
                                                placeholder="Enter rules here..."
                                                className="form-control bg-dark border-0 text-white py-3 px-4 rounded-4"
                                                style={{ background: 'rgba(255,255,255,0.03) !important', resize: 'none' }}
                                                value={emblosRules}
                                                onChange={e => setEmblosRules(e.target.value)}
                                            />
                                        </div>
                                        <button type="submit" disabled={isUpdatingConfig} className="btn btn-primary w-100 py-3 rounded-4 fw-bold shadow-lg border-0 transition-all hover-translate-y d-flex align-items-center justify-content-center gap-2">
                                            {isUpdatingConfig && <span className="spinner-border spinner-border-sm" role="status"></span>}
                                            {isUpdatingConfig ? 'Updating...' : 'Save Configuration'}
                                        </button>
                                    </form>
                                </section>
                            </div>
                        </Motion.div>
                    )}
                </AnimatePresence>

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

                {/* Artist Detail Dashboard Modal */}
                <AnimatePresence>
                    {selectedUser && (
                        <div className="fixed-top min-vh-100 d-flex align-items-center justify-content-center p-0 p-md-3" style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1200, overflowY: 'auto' }}>
                            <Motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                className="glass w-100 h-100 h-md-auto rounded-md-5 border-0 shadow-2xl overflow-hidden d-flex flex-column"
                                style={{ maxWidth: '1000px', maxHeight: '95vh' }}
                            >
                                {/* Modal Header */}
                                <div className="p-4 border-bottom border-secondary border-opacity-10 d-flex justify-content-between align-items-center sticky-top bg-dark" style={{ zIndex: 10 }}>
                                    <div className="d-flex align-items-center gap-3">
                                        <img src={selectedUser.avatar || '/icon.png'} className="rounded-circle border border-primary p-1" style={{ width: '50px', height: '50px', objectFit: 'cover' }} alt="" />
                                        <div>
                                            <h4 className="fw-bold mb-0 text-white">{selectedUser.username} <span className="badge bg-primary bg-opacity-10 text-primary extra-small">{selectedUser.role?.toUpperCase()}</span></h4>
                                            <div className="extra-small text-muted">{selectedUser.email}</div>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedUser(null)} className="btn text-white-50 p-2 hover-bg-white-5 rounded-circle border-0 transition-all"><X size={24} /></button>
                                </div>

                                {/* Delete Message Box - Black BG, White Text */}
                                <div className="p-4 border-bottom border-danger border-opacity-20" style={{ background: '#000000' }}>
                                    <div className="d-flex flex-column gap-3">
                                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-4">
                                            <div className="d-flex align-items-start gap-3 flex-grow-1">
                                                <div className="bg-primary bg-opacity-10 p-3 rounded-4 text-primary mt-1">
                                                    <MessageSquare size={24} />
                                                </div>
                                                <div className="w-100">
                                                    <div className="d-flex align-items-center gap-2 mb-2">
                                                        <h6 className="fw-bold mb-0" style={{ color: '#ffffff' }}>Identity Insight & Action</h6>
                                                        <span className="badge bg-white bg-opacity-10 text-white extra-small px-2 py-1 rounded-pill">Priority Context</span>
                                                    </div>
                                                    <div className="glass p-3 rounded-4 border-0 mb-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                        <p className="mb-0 small" style={{ color: '#ffffff', opacity: 0.9, lineHeight: '1.6' }}>
                                                            {selectedUser.emblosAccess?.message || "This user is registered as a regular collector. No specific request message was submitted during registration."}
                                                        </p>
                                                    </div>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        <span className="extra-small text-muted">Action:</span>
                                                        {!showDeleteConfirm ? (
                                                            <button
                                                                onClick={() => setShowDeleteConfirm(true)}
                                                                className="btn btn-link p-0 text-danger extra-small text-decoration-none fw-bold hover-scale"
                                                            >
                                                                Initiate Termination Request
                                                            </button>
                                                        ) : (
                                                            <div className="d-flex align-items-center gap-2">
                                                                <span className="extra-small text-danger fw-bold blink">Confirm Termination?</span>
                                                                <button
                                                                    onClick={async () => {
                                                                        const res = await deleteUserByEmail(selectedUser.email);
                                                                        if (res.success) {
                                                                            alert('✅ Identity Purged Successfully');
                                                                            setSelectedUser(null);
                                                                            setShowDeleteConfirm(false);
                                                                        } else {
                                                                            alert('❌ Error: ' + res.message);
                                                                            setShowDeleteConfirm(false);
                                                                        }
                                                                    }}
                                                                    className="btn btn-danger btn-xs py-1 px-3 rounded-pill extra-small fw-bold"
                                                                >
                                                                    YES, DELETE
                                                                </button>
                                                                <button
                                                                    onClick={() => setShowDeleteConfirm(false)}
                                                                    className="btn btn-link p-0 text-white extra-small text-decoration-none"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex flex-column gap-2" style={{ minWidth: '200px' }}>
                                                <div className="glass p-3 rounded-4 border-0 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                                    <div className="extra-small text-white-50 text-uppercase tracking-widest mb-1">Access Level</div>
                                                    <div className={`fw-bold ${selectedUser.role === 'emblos' ? 'text-primary' : 'text-success'}`}>
                                                        {selectedUser.role?.toUpperCase() || 'COLLECTOR'}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setMessageTarget({ id: selectedUser._id || selectedUser.id, name: selectedUser.username })}
                                                    className="btn btn-primary w-100 py-2 rounded-4 fw-bold extra-small d-flex align-items-center justify-content-center gap-2 shadow-lg border-0"
                                                >
                                                    <Send size={14} /> Send Direct Msg
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Body */}
                                <div className="p-4 p-md-5 overflow-auto custom-scrollbar">
                                    {/* Stats Cards */}
                                    <div className="row g-4 mb-5">
                                        {[
                                            {
                                                label: 'Total Likes',
                                                value: (products.filter(p => p.creatorId === selectedUser._id).reduce((sum, p) => sum + (p.likes || 0), 0) +
                                                    galleryItems.filter(g => g.creatorId === selectedUser._id).reduce((sum, g) => sum + (g.likes || 0), 0)),
                                                icon: Heart, color: 'danger'
                                            },
                                            {
                                                label: 'Total Orders',
                                                value: orders.filter(o => o.creatorId === selectedUser._id || o.creatorId === selectedUser.id).length,
                                                icon: ShoppingBag, color: 'success'
                                            },
                                            {
                                                label: 'Total Artworks',
                                                value: (products.filter(p => p.creatorId === selectedUser._id || p.creatorId === selectedUser.id).length +
                                                    galleryItems.filter(g => g.creatorId === selectedUser._id || g.creatorId === selectedUser.id).length),
                                                icon: ImageIcon, color: 'primary'
                                            },
                                        ].map((stat, idx) => (
                                            <div key={idx} className="col-12 col-md-4">
                                                <div className="glass p-4 rounded-4 border-0 h-100 bg-opacity-5">
                                                    <div className={`bg-${stat.color} bg-opacity-10 p-2 rounded-3 text-${stat.color} d-inline-block mb-3`}>
                                                        <stat.icon size={20} />
                                                    </div>
                                                    <h3 className="h2 fw-bold mb-0 text-white">{stat.value}</h3>
                                                    <p className="text-muted small mb-0 mt-1">{stat.label}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Artworks Section */}
                                    <div className="mb-5">
                                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                            <ImageIcon size={20} className="text-primary" /> Artist's Gallery & Inventory
                                        </h5>
                                        <div className="row g-3">
                                            {[...products.filter(p => p.creatorId === selectedUser._id), ...galleryItems.filter(g => g.creatorId === selectedUser._id)].map((item, idx) => (
                                                <div key={idx} className="col-6 col-md-3">
                                                    <div className="glass rounded-4 overflow-hidden position-relative group" style={{ height: '150px' }}>
                                                        <img
                                                            src={item.image || item.url}
                                                            className="w-100 h-100 object-fit-cover shadow-lg pointer"
                                                            alt=""
                                                            onClick={() => setCommentModalItem(item)}
                                                        />
                                                        <div className="position-absolute top-0 start-0 m-2">
                                                            <span className={`badge ${item.status === 'active' ? 'bg-success' : 'bg-warning'} extra-small`}>{item.status}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {products.filter(p => p.creatorId === selectedUser._id).length === 0 && galleryItems.filter(g => g.creatorId === selectedUser._id).length === 0 && (
                                                <div className="col-12 text-center py-4 text-muted small">No artworks found for this artist.</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Orders Section */}
                                    <div>
                                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                            <ShoppingBag size={20} className="text-success" /> Artist's Orders
                                        </h5>
                                        <div className="table-responsive">
                                            <table className="table table-dark table-hover align-middle border-0">
                                                <thead>
                                                    <tr className="text-muted extra-small uppercase">
                                                        <th className="border-0">Product</th>
                                                        <th className="border-0 text-end">Price</th>
                                                        <th className="border-0 text-end">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.filter(o => o.creatorId === selectedUser._id).map(order => (
                                                        <tr key={order._id} className="border-bottom border-white border-opacity-5">
                                                            <td className="border-0 py-3">
                                                                <div className="d-flex align-items-center gap-2">
                                                                    {order.image ? (
                                                                        <img
                                                                            src={order.image}
                                                                            className="rounded-circle cursor-pointer"
                                                                            style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                                                            alt=""
                                                                            onClick={() => setCommentModalItem({ ...order, title: order.productName, url: order.image })}
                                                                        />
                                                                    ) : (
                                                                        <div
                                                                            className="glass rounded-circle d-flex align-items-center justify-content-center cursor-pointer"
                                                                            style={{ width: '30px', height: '30px' }}
                                                                            onClick={() => setCommentModalItem({ ...order, title: order.productName, url: null })}
                                                                        >
                                                                            <ImageIcon size={12} className="opacity-20" />
                                                                        </div>
                                                                    )}
                                                                    <div className="fw-bold extra-small">{order.productName}</div>
                                                                </div>
                                                            </td>
                                                            <td className="border-0 text-end extra-small">
                                                                {order.price ? <span className="text-primary fw-bold">₹{order.price}</span> : 'N/A'}
                                                            </td>
                                                            <td className="border-0 text-end">
                                                                <span className={`badge ${order.status === 'Approved' ? 'bg-success' : 'bg-warning'} extra-small`}>
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {orders.filter(o => o.creatorId === (selectedUser._id || selectedUser.id)).length === 0 && (
                                                        <tr><td colSpan="3" className="text-center py-4 text-muted small">No orders attributed to this artist.</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </Motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Premium Preview Modal now handled by ItemPreview at the end */}

                {/* Internal Messaging Modal */}
                <AnimatePresence>
                    {messageTarget && (
                        <div className="fixed-top min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ background: 'rgba(0,0,0,0.9)', zIndex: 13000 }}>
                            <Motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="glass p-4 p-md-5 rounded-5 border border-white border-opacity-10 w-100"
                                style={{ maxWidth: '500px' }}
                            >
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h3 className="h5 fw-bold mb-1 text-gradient">Send Message</h3>
                                        <p className="extra-small text-muted mb-0">Target: <span className="text-primary">{messageTarget.name}</span></p>
                                    </div>
                                    <button onClick={() => setMessageTarget(null)} className="btn text-white-50 p-0 border-0"><X size={24} /></button>
                                </div>

                                <textarea
                                    className="form-control glass border-0 text-white p-4 rounded-4 mb-4"
                                    rows="5"
                                    placeholder="Type your message to the artist(s) here..."
                                    style={{ background: 'rgba(255,255,255,0.03) !important', resize: 'none' }}
                                    value={internalMsg}
                                    onChange={(e) => setInternalMsg(e.target.value)}
                                />

                                <button
                                    onClick={async () => {
                                        if (!internalMsg.trim()) return;
                                        setIsSendingInternal(true);
                                        await sendInternalMessage({
                                            receiverId: messageTarget.id,
                                            senderId: 'admin',
                                            message: internalMsg,
                                            name: 'System Admin'
                                        });
                                        setIsSendingInternal(false);
                                        setInternalMsg('');
                                        setMessageTarget(null);
                                        alert("Message Transmitted Successfully.");
                                    }}
                                    disabled={isSendingInternal || !internalMsg.trim()}
                                    className="btn btn-primary w-100 py-3 rounded-4 fw-bold shadow-lg border-0 d-flex align-items-center justify-content-center gap-2"
                                >
                                    {isSendingInternal ? (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    ) : (
                                        <><Send size={18} /> Transmit Message</>
                                    )}
                                </button>
                            </Motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>

            {/* Premium Preview Modal */}
            <ItemPreview
                item={commentModalItem}
                isOpen={!!commentModalItem}
                onClose={() => setCommentModalItem(null)}
                isLiked={commentModalItem && likedIds.includes(commentModalItem._id || commentModalItem.id)}
                toggleLike={() => {
                    const id = commentModalItem._id || commentModalItem.id;
                    if (products.find(p => (p._id || p.id) === id)) toggleLike(id);
                    else toggleGalleryLike(id);
                }}
            />
        </div >
    );
};

export default Admin;
