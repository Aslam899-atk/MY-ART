import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ShoppingBag, Clock, CheckCircle, Trash2, X, Eye } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import ItemPreview from '../components/ItemPreview';

const UserOrders = () => {
    const { orders, user, users, deleteOrder, toggleLike, toggleGalleryLike, likedIds } = useContext(AppContext);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const myOrders = orders.filter(o => {
        const isMine = o.customerId === (user?._id || user?.id);
        if (!isMine) return false;
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return o.productName?.toLowerCase().includes(q) || o.date?.toLowerCase().includes(q);
    });

    return (
        <div className="container mt-5 pt-5 min-vh-100">
            <div className="header mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-4">
                <div>
                    <h1 className="display-4 fw-bold text-gradient">My Orders</h1>
                    <p className="text-muted mb-0">Track your artwork requests and purchases.</p>
                </div>

                {/* Search Bar */}
                <div className="glass p-2 rounded-pill d-flex align-items-center gap-2 px-3 shadow-lg" style={{ minWidth: '300px', background: 'rgba(255,255,255,0.05)' }}>
                    <Search size={18} className="text-muted" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="form-control bg-transparent border-0 text-white shadow-none p-0 small"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="btn btn-link p-0 text-muted opacity-50">
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="row g-4">
                {myOrders.map(order => (
                    <div key={order._id} className="col-12 col-md-6">
                        <div className="glass p-4 rounded-4 border border-white border-opacity-10 h-100 shadow-lg group">
                            <div className="d-flex gap-4">
                                {order.image ? (
                                    <img
                                        src={order.image}
                                        className="rounded-3 shadow-sm cursor-pointer transition-all hover-scale"
                                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                        alt=""
                                        onClick={() => setSelectedOrder(order)}
                                    />
                                ) : (
                                    <div
                                        className="glass rounded-3 d-flex align-items-center justify-content-center cursor-pointer transition-all hover-scale"
                                        style={{ width: '120px', height: '120px' }}
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <ShoppingBag size={32} className="opacity-20" />
                                    </div>
                                )}
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h4 className="fw-bold mb-0">{order.productName}</h4>
                                            <div className="extra-small text-primary fw-bold mb-2">Artist: {users.find(u => (u._id || u.id) === order.creatorId)?.username || 'Art Void'}</div>
                                        </div>
                                        <div className="d-flex flex-column align-items-end gap-1">
                                            <span className={`badge rounded-pill ${order.type === 'service' ? 'bg-info bg-opacity-10 text-info' : 'bg-primary bg-opacity-10 text-primary'} px-3 py-1 extra-small uppercase fw-bold`}>
                                                {order.type === 'service' ? 'Request' : 'Order'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="small text-white opacity-50 mb-3">{order.date}</div>

                                    {order.price > 0 ? (
                                        <div className="h4 fw-bold text-primary mb-3">₹{order.price}</div>
                                    ) : (
                                        <div className="text-warning small italic mb-3 d-flex align-items-center gap-2">
                                            <Clock size={14} /> Waiting for price agreement...
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                        {order.type === 'product' ? (
                                            <div className="text-success small fw-bold d-flex align-items-center gap-2">
                                                <CheckCircle size={16} /> Order Finalized
                                            </div>
                                        ) : (
                                            <div className="small text-white-50 font-italic">
                                                {order.status === 'Approved' ? (
                                                    <span className="text-success fw-bold d-flex align-items-center gap-2"><CheckCircle size={16} /> Request Approved</span>
                                                ) : (
                                                    <span className="text-muted italic d-flex align-items-center gap-2">Request Processing...</span>
                                                )}
                                            </div>
                                        )}

                                        <button
                                            onClick={() => { if (window.confirm('Are you sure?')) deleteOrder(order._id || order.id); }}
                                            className="btn btn-sm text-danger opacity-50 hover-opacity-100 p-0 border-0"
                                            title="Delete/Cancel Order"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {myOrders.length === 0 && (
                    <div className="text-center py-5 w-100">
                        <ShoppingBag size={64} className="text-white opacity-10 mb-4" />
                        <h3 className="text-white opacity-40">No orders yet</h3>
                        <p className="text-muted">Browse the gallery or shop to find your next masterpiece.</p>
                    </div>
                )}
            </div>

            {/* Premium Preview Modal */}
            <ItemPreview
                item={selectedOrder ? {
                    ...selectedOrder,
                    title: selectedOrder.productName,
                    url: selectedOrder.image
                } : null}
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                isLiked={selectedOrder && likedIds.includes(selectedOrder.productId || selectedOrder.id)}
                toggleLike={() => {
                    const id = selectedOrder.productId || selectedOrder.id;
                    if (selectedOrder.type === 'product') toggleLike(id);
                    else toggleGalleryLike(id);
                }}
            />
        </div>
    );
};

export default UserOrders;
