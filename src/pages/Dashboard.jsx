import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Image as ImageIcon,
    ShoppingBag,
    MessageSquare,
    AlertCircle,
    CheckCircle,
    Clock,
    DollarSign,
    ExternalLink,
    Plus,
    X,
    User,
    Upload,
    Package,
    ClipboardList,
    Trash2,
    Eye
} from 'lucide-react';
import LazyImage from '../components/LazyImage';
import ItemPreview from '../components/ItemPreview';

const Dashboard = () => {
    const {
        user,
        products,
        galleryItems,
        orders,
        messages,
        submitOrderPrice,
        approveOrderPrice,
        claimOrder,
        sendInternalMessage,
        addProduct,
        addGalleryItem,
        deleteProduct,
        deleteGalleryItem,
        updateOrderStatus,
        updateProduct,
        updateGalleryItem,
        toggleLike,
        toggleGalleryLike,
        likedIds,
        isLoadingAuth
    } = useContext(AppContext);

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    // Protection & Init
    useEffect(() => {
        if (!isLoadingAuth && (!user || user.role !== 'emblos')) {
            navigate('/');
        }
    }, [user, isLoadingAuth, navigate]);
    const [priceInput, setPriceInput] = useState({});
    const [orderFilter, setOrderFilter] = useState('All');
    const [previewImage, setPreviewImage] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadType, setUploadType] = useState('gallery'); // 'gallery' or 'shop'
    const [uploadFormData, setUploadFormData] = useState({
        title: '',
        description: '',
        category: 'Painting',
        medium: '',
        price: '',
        image: '' // This will store preview URL or Cloudinary URL
    });
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [commentModalItem, setCommentModalItem] = useState(null);

    // Filter relevant data
    const userId = user?._id || user?.id;
    const myProducts = products.filter(p => p.creatorId === userId);
    const myGallery = galleryItems.filter(g => g.creatorId === userId);
    const myOrders = orders.filter(o => o.creatorId === userId || o.customerId === userId);
    const publicTasks = orders.filter(o => o.type === 'service' && !o.creatorId);
    const myMessages = messages.filter(m => m.receiverId === userId || m.senderId === userId);

    const isFrozen = user?.isFrozen;

    const handlePriceSubmit = async (orderId) => {
        const price = priceInput[orderId];
        if (!price) return;
        await submitOrderPrice(orderId, price);
        setPriceInput({ ...priceInput, [orderId]: '' });
    };

    const handleClaimTask = async (orderId) => {
        if (isFrozen) return alert("Account frozen.");

        const price = window.prompt("ഈ വർക്കിനായി നിങ്ങൾ ഉദ്ദേശിക്കുന്ന Price (₹) എത്രയാണ്?");
        if (!price || isNaN(price)) {
            return alert("ദയവായി ഒരു സാധുവായ തുക നൽകുക.");
        }

        const res = await claimOrder(orderId, price);
        if (res.success) {
            alert("Task Claimed! കസ്റ്റമർക്ക് ഇപ്പോൾ പ്രൈസ് കാണാൻ സാധിക്കും. കസ്റ്റമർ കൺഫേം ചെയ്താൽ ലിസ്റ്റ് പബ്ലിക് ആകും.");
        } else {
            alert("Claim Failed. Please try again.");
        }
    };
    const handleStatusChange = async (orderId, newStatus) => {
        await updateOrderStatus(orderId, { status: newStatus });
        // Refresh local data – simple reload for demo purposes
        window.location.reload();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadFormData({ ...uploadFormData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (isFrozen) return alert("Account frozen. Cannot upload.");
        setIsUploading(true);
        try {
            let finalImageUrl = uploadFormData.image;

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
                    finalImageUrl = data.secure_url;
                } else {
                    throw new Error("Upload failed");
                }
            }

            if (uploadType === 'gallery') {
                const itemType = imageFile?.type?.includes('video') ? 'video' : 'image';
                await addGalleryItem({
                    title: uploadFormData.title,
                    description: uploadFormData.description,
                    category: uploadFormData.category,
                    medium: uploadFormData.medium,
                    url: finalImageUrl,
                    type: itemType,
                    status: 'pending'
                });
            } else {
                await addProduct({
                    name: uploadFormData.title,
                    description: uploadFormData.description,
                    price: Number(uploadFormData.price) || 0,
                    image: finalImageUrl,
                    status: 'pending'
                });
            }

            setIsUploadModalOpen(false);
            setUploadFormData({ title: '', description: '', category: 'Painting', medium: '', price: '', image: '' });
            setImageFile(null);
            alert("Sent for Admin Approval! Your work will be public once approved.");
        } catch (err) {
            console.error(err);
            alert("Upload failed. Please check your connection.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="container mt-5 pt-5 min-vh-100">
            {/* ... banner ... */}
            <div className={`glass p-4 rounded-4 mb-4 border border-white border-opacity-10 d-flex flex-wrap align-items-center justify-content-between gap-3 ${isFrozen ? 'border-danger' : 'border-success'}`}>
                {/* banner content */}
                <div className="d-flex align-items-center gap-3">
                    <img src={user?.avatar} className="rounded-circle border border-2 border-primary" style={{ width: '60px', height: '60px' }} alt="" />
                    <div>
                        <h4 className="fw-bold mb-1 text-gradient">{user?.username}</h4>
                        <span className={`badge rounded-pill ${isFrozen ? 'bg-danger' : 'bg-success'} px-3 py-1`}>
                            {isFrozen ? 'Account Frozen' : 'Active Emblos'}
                        </span>
                    </div>
                </div>
                <div className="d-flex gap-3 align-items-center">
                    {!isFrozen && (
                        <button onClick={() => setIsUploadModalOpen(true)} className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-glow d-flex align-items-center gap-2">
                            <Plus size={18} /> New Upload
                        </button>
                    )}
                    {isFrozen && (
                        <div className="d-flex align-items-center gap-3 text-danger bg-danger bg-opacity-10 p-4 rounded-4 w-100">
                            <AlertCircle size={32} />
                            <div>
                                <div className="fw-bold h5 mb-1">Account Frozen</div>
                                <div className="small opacity-75">നിങ്ങളുടെ സബ്സ്ക്രിപ്ഷൻ കാലാവധി കഴിഞ്ഞിരിക്കുന്നു. പഴയ വർക്കുകൾ ഇപ്പോൾ പബ്ലിക് സൈറ്റിൽ കാണില്ല.</div>
                                <div className="small fw-bold mt-1">Contact Admin to activate again.</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isUploadModalOpen && (
                <div className="fixed-top min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ background: 'rgba(0,0,0,0.92)', zIndex: 11000 }}>
                    <div className="glass p-5 rounded-5 border border-white border-opacity-10 w-100 shadow-2xl" style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h2 className="h4 fw-bold mb-0 text-gradient">New Creation</h2>
                            <button onClick={() => setIsUploadModalOpen(false)} className="btn text-white-50 p-2 rounded-circle hover-glass"><X size={24} /></button>
                        </div>

                        {/* Type Toggle */}
                        <div className="d-flex gap-2 p-2 glass rounded-4 mb-5 border-0">
                            <button onClick={() => setUploadType('gallery')} className={`btn flex-grow-1 rounded-3 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 border-0 ${uploadType === 'gallery' ? 'btn-primary shadow-glow' : 'text-white-50'}`}>
                                <ImageIcon size={18} /> Gallery Artwork
                            </button>
                            <button onClick={() => setUploadType('shop')} className={`btn flex-grow-1 rounded-3 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 border-0 ${uploadType === 'shop' ? 'btn-primary shadow-glow' : 'text-white-50'}`}>
                                <Package size={18} /> Shop Product
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="d-flex flex-column gap-4">
                            <div>
                                <label className="small fw-bold opacity-50 mb-2 uppercase tracking-widest">{uploadType === 'gallery' ? 'Artwork' : 'Product'} Title</label>
                                <input required placeholder="Enter title..." className="form-control glass border-0 text-white py-3" value={uploadFormData.title} onChange={e => setUploadFormData({ ...uploadFormData, title: e.target.value })} />
                            </div>

                            {uploadType === 'gallery' ? (
                                <div className="row g-3">
                                    <div className="col-6">
                                        <label className="small fw-bold opacity-50 mb-2 uppercase tracking-widest">Category</label>
                                        <select className="form-select glass border-0 text-white py-3" value={uploadFormData.category} onChange={e => setUploadFormData({ ...uploadFormData, category: e.target.value })}>
                                            <option value="Painting" className="bg-dark">Painting</option>
                                            <option value="Pencil Drawing" className="bg-dark">Pencil Drawing</option>
                                            <option value="Calligraphy" className="bg-dark">Calligraphy</option>
                                            <option value="Other" className="bg-dark">Other</option>
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="small fw-bold opacity-50 mb-2 uppercase tracking-widest">Medium</label>
                                        <input required className="form-control glass border-0 text-white py-3" placeholder="e.g. Oil on Canvas" value={uploadFormData.medium} onChange={e => setUploadFormData({ ...uploadFormData, medium: e.target.value })} />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="small fw-bold opacity-50 mb-2 uppercase tracking-widest">Price (₹)</label>
                                    <div className="input-group glass rounded-3 border-0 overflow-hidden">
                                        <span className="input-group-text bg-transparent border-0 text-primary ps-3 small fw-bold">₹</span>
                                        <input type="number" required placeholder="0.00" className="form-control bg-transparent border-0 text-white py-3 shadow-none" value={uploadFormData.price} onChange={e => setUploadFormData({ ...uploadFormData, price: e.target.value })} />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="small fw-bold opacity-50 mb-2 uppercase tracking-widest">Description</label>
                                <textarea className="form-control glass border-0 text-white py-3" rows="3" placeholder="Tell us about this creation..." value={uploadFormData.description} onChange={e => setUploadFormData({ ...uploadFormData, description: e.target.value })} />
                            </div>

                            <div>
                                <label className="small fw-bold opacity-50 mb-2 uppercase tracking-widest">Choose Picture / Video</label>
                                <div className="d-flex flex-column gap-3">
                                    <label className="d-flex flex-column align-items-center justify-content-center p-5 rounded-5 cursor-pointer transition-all hover-glass border-2 border-dashed border-secondary border-opacity-20" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        <div className="bg-primary bg-opacity-10 p-3 rounded-pill mb-3 text-primary shadow-lg"><Upload size={24} /></div>
                                        <span className="fw-bold small text-white-50">Drag & Drop or Multi-Select</span>
                                        <span className="text-muted extra-small mt-1">Images or MP4 Videos supported</span>
                                        <input type="file" required={!uploadFormData.image} accept="image/*,video/*" onChange={handleImageUpload} className="d-none" />
                                    </label>

                                    {uploadFormData.image && (
                                        <div className="position-relative rounded-4 overflow-hidden border border-white border-opacity-10 shadow-2xl" style={{ height: '220px' }}>
                                            {imageFile?.type?.includes('video') ? (
                                                <video src={uploadFormData.image} className="w-100 h-100 object-fit-cover" muted controls autoPlay loop playsInline />
                                            ) : (
                                                <img src={uploadFormData.image} className="w-100 h-100 object-fit-cover" alt="" />
                                            )}
                                            <div className="position-absolute top-0 end-0 m-3">
                                                <button type="button" onClick={() => { setImageFile(null); setUploadFormData({ ...uploadFormData, image: '' }); }} className="btn btn-sm btn-danger rounded-circle p-2 shadow-lg"><X size={14} /></button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button type="submit" disabled={isUploading} className="btn btn-primary py-4 rounded-4 fw-bold shadow-glow border-0 mt-3 d-flex align-items-center justify-content-center gap-2">
                                {isUploading ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm" role="status"></div>
                                        <span>Transmitting to Server...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} /> Submit for Approval
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="row g-4">
                {/* Sidebar Navigation */}
                <div className="col-lg-3">
                    <div className="glass p-3 rounded-4 border border-white border-opacity-10 position-sticky d-flex flex-lg-column gap-2 overflow-x-auto overflow-lg-visible no-scrollbar" style={{ top: '100px', zIndex: 100 }}>
                        <button onClick={() => setActiveTab('overview')} className={`btn text-nowrap text-start rounded-3 py-3 d-flex align-items-center gap-3 flex-shrink-0 ${activeTab === 'overview' ? 'btn-primary shadow-glow' : 'glass text-white opacity-70 border-0'} ${window.innerWidth < 992 ? 'px-4' : 'w-100'}`}>
                            <LayoutDashboard size={18} /> Overview
                        </button>
                        <button onClick={() => setActiveTab('inventory')} className={`btn text-nowrap text-start rounded-3 py-3 d-flex align-items-center gap-3 flex-shrink-0 ${activeTab === 'inventory' ? 'btn-primary shadow-glow' : 'glass text-white opacity-70 border-0'} ${window.innerWidth < 992 ? 'px-4' : 'w-100'}`}>
                            <ImageIcon size={18} /> My Artworks
                        </button>
                        <button onClick={() => setActiveTab('orders')} className={`btn text-nowrap text-start rounded-3 py-3 d-flex align-items-center gap-3 flex-shrink-0 ${activeTab === 'orders' ? 'btn-primary shadow-glow' : 'glass text-white opacity-70 border-0'} ${window.innerWidth < 992 ? 'px-4' : 'w-100'}`}>
                            <ShoppingBag size={18} /> Orders
                            {myOrders.filter(o => o.status === 'Pending Price').length > 0 &&
                                <span className="badge bg-danger ms-auto">{myOrders.filter(o => o.status === 'Pending Price').length}</span>
                            }
                        </button>
                        <button onClick={() => setActiveTab('tasks')} className={`btn text-nowrap text-start rounded-3 py-3 d-flex align-items-center gap-3 flex-shrink-0 ${activeTab === 'tasks' ? 'btn-primary shadow-glow' : 'glass text-white opacity-70 border-0'} ${window.innerWidth < 992 ? 'px-4' : 'w-100'}`}>
                            <ClipboardList size={18} /> Task Center
                            {publicTasks.length > 0 && <span className="badge bg-primary ms-auto">{publicTasks.length}</span>}
                        </button>
                        <button onClick={() => setActiveTab('messages')} className={`btn text-nowrap text-start rounded-3 py-3 d-flex align-items-center gap-3 flex-shrink-0 ${activeTab === 'messages' ? 'btn-primary shadow-glow' : 'glass text-white opacity-70 border-0'} ${window.innerWidth < 992 ? 'px-4' : 'w-100'}`}>
                            <MessageSquare size={18} /> Admin Inbox
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="col-lg-9">
                    {activeTab === 'overview' && (
                        <div className="row g-4">
                            <div className="col-md-4">
                                <div className="glass p-4 rounded-4 text-center">
                                    <div className="h3 fw-bold text-primary">{myGallery.length + myProducts.length}</div>
                                    <div className="small text-white opacity-50 uppercase tracking-widest">Total Uploads</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="glass p-4 rounded-4 text-center">
                                    <div className="h3 fw-bold text-success">{myOrders.length}</div>
                                    <div className="small text-white opacity-50 uppercase tracking-widest">Total Orders</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="glass p-4 rounded-4 text-center">
                                    <div className="h3 fw-bold text-accent">
                                        ₹{myOrders.reduce((sum, o) => sum + (o.price || 0), 0)}
                                    </div>
                                    <div className="small text-white opacity-50 uppercase tracking-widest">Total Earnings</div>
                                </div>
                            </div>

                            <div className="col-12 mt-4">
                                <div className="glass p-4 rounded-4 border border-white border-opacity-10">
                                    <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                        <Clock size={20} className="text-primary" /> Recent Activity
                                    </h5>
                                    {myOrders.slice(0, 5).map(order => (
                                        <div key={order._id} className="d-flex align-items-center justify-content-between p-3 border-bottom border-white border-opacity-5 mb-2 rounded-3 hover-glass transition-all">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="p-2 glass rounded-3 text-primary"><ShoppingBag size={16} /></div>
                                                <div>
                                                    <div className="fw-bold small">New order for {order.productName}</div>
                                                    <div className="extra-small opacity-50">from {order.customer}</div>
                                                </div>
                                            </div>
                                            <span className={`badge ${order.status === 'Approved' ? 'bg-success' : 'bg-warning'} small`}>{order.status}</span>
                                        </div>
                                    ))}
                                    {myOrders.length === 0 && (
                                        <div className="text-center py-5 text-white opacity-30">No recent activity</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'inventory' && (
                        <div className="glass p-4 rounded-4">
                            <h5 className="fw-bold mb-4">My Uploaded Items</h5>
                            {isFrozen && <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger mb-4">Your account is frozen. All your items are hidden from public.</div>}
                            <div className="row g-3">
                                {[...myProducts.map(p => ({ ...p, itemType: 'product' })), ...myGallery.map(g => ({ ...g, itemType: 'gallery' }))].map((item, idx) => (
                                    <div key={idx} className="col-md-4">
                                        <div className="glass rounded-4 overflow-hidden position-relative group" style={{ height: '200px' }}>
                                            {(item.type === 'video' || (item.url || item.image)?.includes('.mp4')) ? (
                                                <video src={item.url || item.image} className="w-100 h-100 object-fit-cover" muted loop autoPlay playsInline />
                                            ) : (
                                                <LazyImage src={item.url || item.image} className="w-100 h-100 object-fit-cover shadow-lg" />
                                            )}

                                            <div className="position-absolute top-0 start-0 m-2 d-flex gap-2" style={{ zIndex: 5 }}>
                                                <div className={`badge ${item.status === 'active' ? 'bg-success' : (item.status === 'frozen' ? 'bg-danger' : 'bg-warning')}`}>
                                                    {item.status}
                                                </div>
                                            </div>

                                            <div className="position-absolute top-0 end-0 m-2 opacity-0 group-hover-opacity-100 transition-all d-flex gap-2" style={{ zIndex: 5 }}>
                                                <button
                                                    onClick={() => setCommentModalItem(item)}
                                                    className="btn btn-primary btn-sm rounded-circle p-2 shadow-lg"
                                                    title="View Full Preview"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm(`Are you sure you want to delete "${item.title || item.name}"?`)) {
                                                            if (item.itemType === 'product') {
                                                                await deleteProduct(item._id || item.id);
                                                            } else {
                                                                await deleteGalleryItem(item._id || item.id);
                                                            }
                                                        }
                                                    }}
                                                    className="btn btn-danger btn-sm rounded-circle p-2 shadow-lg"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            <div className="position-absolute bottom-0 start-0 w-100 p-2 glass border-0 text-truncate small fw-bold" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                                {item.title || item.name}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {myGallery.length === 0 && myProducts.length === 0 && (
                                    <div className="text-center py-5 w-100 text-white opacity-30">No items found</div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="glass p-4 rounded-4">
                            <h5 className="fw-bold mb-4">Customer Orders</h5>
                            <div className="table-responsive">
                                <table className="table table-dark table-hover align-middle border-0">
                                    <thead>
                                        <tr className="text-muted small uppercase">
                                            <th className="border-0">Product</th>
                                            <th className="border-0">Customer</th>
                                            <th className="border-0">Agreed Price</th>
                                            <th className="border-0">Status</th>
                                            <th className="border-0">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myOrders
                                            .filter(order => orderFilter === 'All' || order.status === orderFilter)
                                            .map(order => (
                                                <tr key={order._id} className="border-bottom border-white border-opacity-5">
                                                    <td className="border-0 py-3">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <img
                                                                src={order.image}
                                                                className="rounded-3 shadow-sm cursor-pointer transition-all hover-scale"
                                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                alt=""
                                                                onClick={() => setPreviewImage(order.image)}
                                                            />
                                                            <div>
                                                                <div className="fw-bold small">{order.productName}</div>
                                                                <div className="extra-small opacity-50">{order.date}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="border-0 small">
                                                        <div>{order.customer}</div>
                                                        <div className="extra-small opacity-50">{order.phone}</div>
                                                    </td>
                                                    <td className="border-0">
                                                        {order.price ? (
                                                            <span className="fw-bold text-primary">₹{order.price}</span>
                                                        ) : (
                                                            <div className="d-flex align-items-center gap-2">
                                                                <input
                                                                    type="number"
                                                                    placeholder="Enter Price"
                                                                    className="form-control form-control-sm glass border-0"
                                                                    style={{ width: '100px' }}
                                                                    value={priceInput[order._id] || ''}
                                                                    onChange={(e) => setPriceInput({ ...priceInput, [order._id]: e.target.value })}
                                                                />
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="border-0">
                                                        <span className={`badge ${order.status === 'Approved' ? 'bg-success' : (order.status === 'Price Submitted' ? 'bg-info' : 'bg-warning')} small`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="border-0">
                                                        {/* Price submit */}
                                                        {!order.price && (
                                                            <button
                                                                onClick={() => handlePriceSubmit(order._id)}
                                                                className="btn btn-primary btn-sm rounded-pill px-3 fw-bold"
                                                            >
                                                                Set Price
                                                            </button>
                                                        )}
                                                        {/* Status transitions */}
                                                        {order.status === 'Pending' && (
                                                            <button
                                                                onClick={() => handleStatusChange(order._id, 'Shipped')}
                                                                className="btn btn-outline-info btn-sm ms-2"
                                                            >
                                                                Mark Shipped
                                                            </button>
                                                        )}
                                                        {order.status === 'Shipped' && (
                                                            <button
                                                                onClick={() => handleStatusChange(order._id, 'Completed')}
                                                                className="btn btn-outline-success btn-sm ms-2"
                                                            >
                                                                Mark Completed
                                                            </button>
                                                        )}
                                                        {order.status === 'Approved' && <CheckCircle size={18} className="text-success" />}
                                                    </td>
                                                </tr>
                                            ))}
                                        {myOrders.length === 0 && (
                                            <tr><td colSpan="5" className="text-center py-5 border-0 text-white opacity-30">No orders yet</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'messages' && (
                        <div className="glass p-4 rounded-4">
                            <h5 className="fw-bold mb-4">Messages from Admin</h5>
                            {myMessages.map(msg => (
                                <div key={msg._id} className={`glass p-4 rounded-4 mb-3 border-0 bg-opacity-10 position-relative ${msg.isInternal ? 'border-start border-primary border-4' : ''}`}>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className={`p-2 ${msg.isInternal ? 'bg-primary' : 'bg-success'} bg-opacity-20 rounded-circle`}>
                                                {msg.isInternal ? <User size={16} className="text-primary" /> : <MessageSquare size={16} className="text-success" />}
                                            </div>
                                            <div>
                                                <span className="fw-bold">{msg.isInternal ? 'Admin' : (msg.name || 'Customer')}</span>
                                                {!msg.isInternal && <div className="extra-small text-muted">{msg.email} | {msg.phone}</div>}
                                            </div>
                                        </div>
                                        <span className="extra-small opacity-50">{msg.date}</span>
                                    </div>
                                    <div className="d-flex gap-3">
                                        {msg.image && (
                                            <img src={msg.image} className="rounded-3 shadow-sm" style={{ width: '60px', height: '60px', objectFit: 'cover' }} alt="" />
                                        )}
                                        <p className="mb-0 small flex-grow-1">{msg.message}</p>
                                    </div>
                                </div>
                            ))}
                            {myMessages.length === 0 && (
                                <div className="text-center py-5 text-white opacity-30 border border-white border-opacity-5 rounded-4">
                                    <MessageSquare size={48} className="mb-3 opacity-20" />
                                    <div>No messages yet</div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'tasks' && (
                        <div className="glass p-4 rounded-4">
                            <h5 className="fw-bold mb-4">Task Center (Public Requests)</h5>
                            <p className="text-muted small mb-4">These are custom requests from the contact page. Any artist can claim these to start a commission.</p>
                            <div className="table-responsive">
                                <table className="table table-dark table-hover align-middle border-0">
                                    <thead>
                                        <tr className="text-muted small uppercase">
                                            <th className="border-0">Reference Image</th>
                                            <th className="border-0">Request</th>
                                            <th className="border-0">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {publicTasks.map(task => (
                                            <tr key={task._id} className="border-bottom border-white border-opacity-5">
                                                <td className="py-3 border-0">
                                                    {task.image ? (
                                                        <img
                                                            src={task.image}
                                                            className="rounded-3 shadow-sm cursor-pointer transition-all hover-scale"
                                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                            alt=""
                                                            onClick={() => setPreviewImage(task.image)}
                                                        />
                                                    ) : (
                                                        <div className="glass rounded-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}><ImageIcon size={20} className="opacity-20" /></div>
                                                    )}
                                                </td>
                                                <td className="border-0">
                                                    <div className="fw-bold small">{task.productName}</div>
                                                    <div className="extra-small opacity-50 mb-2">{task.date}</div>
                                                    <div className="small opacity-75">{task.notes}</div>
                                                </td>
                                                <td className="border-0">
                                                    <button onClick={() => handleClaimTask(task._id)} className="btn btn-primary btn-sm rounded-pill px-4 fw-bold shadow-glow border-0">Claim Task</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {publicTasks.length === 0 && (
                                            <tr><td colSpan="3" className="text-center py-5 border-0 text-white opacity-30">No public requests available</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Preview Modal */}
            <AnimatePresence>
                {previewImage && (
                    <div
                        className="fixed-top min-vh-100 d-flex align-items-center justify-content-center p-3 animate-fade-in"
                        style={{ backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 12000 }}
                        onClick={() => setPreviewImage(null)}
                    >
                        <Motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="position-relative"
                            style={{ maxWidth: '90vw', maxHeight: '90vh' }}
                        >
                            <img src={previewImage} className="rounded-4 img-fluid shadow-2xl" style={{ maxHeight: '85vh' }} alt="" />
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="position-absolute top-0 end-0 m-3 btn btn-dark bg-black bg-opacity-50 text-white rounded-circle p-2 border-0"
                            >
                                <X size={24} />
                            </button>
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Premium Preview Modal */}
            <ItemPreview
                item={commentModalItem}
                isOpen={!!commentModalItem}
                onClose={() => setCommentModalItem(null)}
                isLiked={commentModalItem && likedIds.includes(commentModalItem._id || commentModalItem.id)}
                toggleLike={() => {
                    const id = commentModalItem._id || commentModalItem.id;
                    if (commentModalItem.itemType === 'product') toggleLike(id);
                    else toggleGalleryLike(id);
                }}
            />
        </div>
    );
};

export default Dashboard;
