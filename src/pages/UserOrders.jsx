import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ShoppingBag, Clock, CheckCircle, Trash2, X } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const UserOrders = () => {
    const { orders, user, users, deleteOrder } = useContext(AppContext);
    const [previewImage, setPreviewImage] = useState(null);

    const myOrders = orders.filter(o => o.customerId === (user?._id || user?.id));

    return (
        <div className="container mt-5 pt-5 min-vh-100">
            <div className="header mb-5">
                <h1 className="display-4 fw-bold text-gradient">My Orders</h1>
                <p className="text-muted">Track your artwork requests and purchases.</p>
            </div>

            <div className="row g-4">
                {myOrders.map(order => (
                    <div key={order._id} className="col-12 col-md-6">
                        <div className="glass p-4 rounded-4 border border-white border-opacity-10 h-100 shadow-lg group">
                            <div className="d-flex gap-4">
                                <img
                                    src={order.image}
                                    className="rounded-3 shadow-sm cursor-pointer transition-all hover-scale"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                    alt=""
                                    onClick={() => setPreviewImage(order.image)}
                                />
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h4 className="fw-bold mb-0">{order.productName}</h4>
                                            <div className="extra-small text-primary fw-bold mb-2">Artist: {users.find(u => u._id === order.creatorId)?.username || 'Art Void'}</div>
                                        </div>
                                        <div className="d-flex flex-column align-items-end gap-1">
                                            <span className={`badge rounded-pill ${order.type === 'service' ? 'bg-info bg-opacity-10 text-info' : 'bg-primary bg-opacity-10 text-primary'} px-3 py-1 extra-small uppercase fw-bold`}>
                                                {order.type === 'service' ? 'Request' : 'Order'}
                                            </span>
                                            {order.type === 'service' && (
                                                <span className={`badge rounded-pill ${order.status === 'Approved' ? 'bg-success' :
                                                    (order.status === 'Price Submitted' ? 'bg-info' : 'bg-warning')
                                                    } px-2 py-1 extra-small`}>
                                                    {order.status === 'Price Submitted' ? 'Price Negotiated' : order.status}
                                                </span>
                                            )}
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
                                                ) : (order.status === 'Price Submitted' ? (
                                                    <span className="text-info fw-bold d-flex align-items-center gap-2"><Clock size={16} /> Waiting for Admin Approval</span>
                                                ) : 'Request Processing...')}
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

            {/* Image Preview Modal */}
            <AnimatePresence>
                {previewImage && (
                    <div
                        className="fixed-top min-vh-100 d-flex align-items-center justify-content-center p-3 animate-fade-in"
                        style={{ backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 11000 }}
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
        </div>
    );
};

export default UserOrders;
