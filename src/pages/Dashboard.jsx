import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import {
    LayoutDashboard,
    Image as ImageIcon,
    ShoppingBag,
    MessageSquare,
    AlertCircle,
    CheckCircle,
    Clock,
    DollarSign,
    ExternalLink
} from 'lucide-react';
import LazyImage from '../components/LazyImage';

const Dashboard = () => {
    const {
        user,
        products,
        galleryItems,
        orders,
        messages,
        submitOrderPrice,
        sendInternalMessage,
        addProduct,
        addGalleryItem
    } = useContext(AppContext);

    const [activeTab, setActiveTab] = useState('overview');
    const [priceInput, setPriceInput] = useState({});
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFormData, setUploadFormData] = useState({
        title: '',
        description: '',
        category: 'Painting',
        medium: '',
        type: 'image',
        url: ''
    });
    const [isUploading, setIsUploading] = useState(false);

    // Filter relevant data
    const myProducts = products.filter(p => p.creatorId === (user?._id || user?.id));
    const myGallery = galleryItems.filter(g => g.creatorId === (user?._id || user?.id));
    const myOrders = orders.filter(o => o.creatorId === (user?._id || user?.id));
    const myMessages = messages.filter(m => m.receiverId === (user?._id || user?.id) && m.isInternal);

    const isFrozen = user?.isFrozen;

    const handlePriceSubmit = async (orderId) => {
        const price = priceInput[orderId];
        if (!price) return;
        await submitOrderPrice(orderId, price);
        setPriceInput({ ...priceInput, [orderId]: '' });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (isFrozen) return alert("Account frozen. Cannot upload.");
        setIsUploading(true);
        try {
            // In a real app, use Cloudinary here. For now, we use the URL directly
            // or assume user provides a URL for simplicity in this demo form.
            // If we had imageFile state here, we'd do the same as Admin.jsx.
            await addGalleryItem({
                ...uploadFormData,
                status: 'pending' // Always pending for Emblos
            });
            setIsUploadModalOpen(false);
            setUploadFormData({ title: '', description: '', category: 'Painting', medium: '', type: 'image', url: '' });
            alert("Uploaded successfully! Waiting for Admin approval.");
        } catch (err) {
            alert("Upload failed.");
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
                        <div className="d-flex align-items-center gap-2 text-danger small bg-danger bg-opacity-10 p-3 rounded-4">
                            <AlertCircle size={20} />
                            <div>
                                <div className="fw-bold">Payment Expired</div>
                                <div>Contact Admin to unfreeze.</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isUploadModalOpen && (
                <div className="fixed-top min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ background: 'rgba(0,0,0,0.9)', zIndex: 11000 }}>
                    <div className="glass p-5 rounded-5 border border-white border-opacity-10 w-100" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0 text-gradient">Upload New Artwork</h4>
                            <button onClick={() => setIsUploadModalOpen(false)} className="btn text-white-50"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleUpload} className="d-flex flex-column gap-4">
                            <div>
                                <label className="small fw-bold opacity-50 mb-2">Title</label>
                                <input required className="form-control glass border-0 text-white" value={uploadFormData.title} onChange={e => setUploadFormData({ ...uploadFormData, title: e.target.value })} />
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <label className="small fw-bold opacity-50 mb-2">Category</label>
                                    <select className="form-select glass border-0 text-white" value={uploadFormData.category} onChange={e => setUploadFormData({ ...uploadFormData, category: e.target.value })}>
                                        <option value="Painting" className="bg-dark">Painting</option>
                                        <option value="Pencil Drawing" className="bg-dark">Pencil Drawing</option>
                                        <option value="Calligraphy" className="bg-dark">Calligraphy</option>
                                        <option value="Other" className="bg-dark">Other</option>
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className="small fw-bold opacity-50 mb-2">Medium</label>
                                    <input required className="form-control glass border-0 text-white" placeholder="e.g. Oil on Canvas" value={uploadFormData.medium} onChange={e => setUploadFormData({ ...uploadFormData, medium: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="small fw-bold opacity-50 mb-2">Resource URL</label>
                                <input required className="form-control glass border-0 text-white" placeholder="https://..." value={uploadFormData.url} onChange={e => setUploadFormData({ ...uploadFormData, url: e.target.value })} />
                            </div>
                            <div>
                                <label className="small fw-bold opacity-50 mb-2">Description</label>
                                <textarea className="form-control glass border-0 text-white" rows="3" value={uploadFormData.description} onChange={e => setUploadFormData({ ...uploadFormData, description: e.target.value })} />
                            </div>
                            <button type="submit" disabled={isUploading} className="btn btn-primary py-3 rounded-pill fw-bold shadow-glow border-0">
                                {isUploading ? 'Uploading...' : 'Submit for Approval'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="row g-4">
                {/* Sidebar Navigation */}
                <div className="col-lg-3">
                    <div className="glass p-3 rounded-4 border border-white border-opacity-10 position-sticky" style={{ top: '100px' }}>
                        <button onClick={() => setActiveTab('overview')} className={`btn w-100 text-start rounded-3 py-3 mb-2 d-flex align-items-center gap-3 ${activeTab === 'overview' ? 'btn-primary shadow-glow' : 'glass text-white opacity-70 border-0'}`}>
                            <LayoutDashboard size={18} /> Overview
                        </button>
                        <button onClick={() => setActiveTab('inventory')} className={`btn w-100 text-start rounded-3 py-3 mb-2 d-flex align-items-center gap-3 ${activeTab === 'inventory' ? 'btn-primary shadow-glow' : 'glass text-white opacity-70 border-0'}`}>
                            <ImageIcon size={18} /> My Artworks
                        </button>
                        <button onClick={() => setActiveTab('orders')} className={`btn w-100 text-start rounded-3 py-3 mb-2 d-flex align-items-center gap-3 ${activeTab === 'orders' ? 'btn-primary shadow-glow' : 'glass text-white opacity-70 border-0'}`}>
                            <ShoppingBag size={18} /> Orders
                            {myOrders.filter(o => o.status === 'Pending Price').length > 0 &&
                                <span className="badge bg-danger ms-auto">{myOrders.filter(o => o.status === 'Pending Price').length}</span>
                            }
                        </button>
                        <button onClick={() => setActiveTab('messages')} className={`btn w-100 text-start rounded-3 py-3 d-flex align-items-center gap-3 ${activeTab === 'messages' ? 'btn-primary shadow-glow' : 'glass text-white opacity-70 border-0'}`}>
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
                                {[...myProducts, ...myGallery].map((item, idx) => (
                                    <div key={idx} className="col-md-4">
                                        <div className="glass rounded-4 overflow-hidden position-relative group" style={{ height: '200px' }}>
                                            <LazyImage src={item.url || item.image} className="w-100 h-100 object-fit-cover shadow-lg" />
                                            <div className="position-absolute bottom-0 start-0 w-100 p-2 glass border-0 text-truncate small fw-bold">
                                                {item.title || item.name}
                                            </div>
                                            <div className={`position-absolute top-0 end-0 m-2 badge ${item.status === 'active' ? 'bg-success' : (item.status === 'frozen' ? 'bg-danger' : 'bg-warning')}`}>
                                                {item.status}
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
                                        {myOrders.map(order => (
                                            <tr key={order._id} className="border-bottom border-white border-opacity-5">
                                                <td className="border-0 py-3">
                                                    <div className="fw-bold small">{order.productName}</div>
                                                    <div className="extra-small opacity-50">{order.date}</div>
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
                                                    {!order.price && (
                                                        <button
                                                            onClick={() => handlePriceSubmit(order._id)}
                                                            className="btn btn-primary btn-sm rounded-pill px-3 fw-bold"
                                                        >
                                                            Set Price
                                                        </button>
                                                    )}
                                                    {order.status === 'Approved' && (
                                                        <CheckCircle size={18} className="text-success" />
                                                    )}
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
                                <div key={msg._id} className="glass p-4 rounded-4 mb-3 border-0 bg-opacity-10 position-relative">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="p-2 bg-primary bg-opacity-20 rounded-circle"><User size={16} /></div>
                                            <span className="fw-bold">Admin</span>
                                        </div>
                                        <span className="extra-small opacity-50">{msg.date}</span>
                                    </div>
                                    <p className="mb-0 small">{msg.message}</p>
                                </div>
                            ))}
                            {myMessages.length === 0 && (
                                <div className="text-center py-5 text-white opacity-30 border border-white border-opacity-5 rounded-4">
                                    <MessageSquare size={48} className="mb-3 opacity-20" />
                                    <div>No messages from admin yet</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
