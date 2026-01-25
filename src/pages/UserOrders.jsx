import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShoppingBag, Clock, CheckCircle, AlertCircle, Phone } from 'lucide-react';

const UserOrders = () => {
    const { orders, user } = useContext(AppContext);

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
                        <div className="glass p-4 rounded-4 border border-white border-opacity-10 h-100 shadow-lg">
                            <div className="d-flex gap-4">
                                <img src={order.image} className="rounded-3 shadow-sm" style={{ width: '100px', height: '100px', objectFit: 'cover' }} alt="" />
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <h4 className="fw-bold mb-1">{order.productName}</h4>
                                        <span className={`badge rounded-pill ${order.status === 'Approved' ? 'bg-success' : 'bg-warning'} px-3 py-1 small`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="small text-white opacity-50 mb-3">{order.date}</div>

                                    {order.price ? (
                                        <div className="h4 fw-bold text-primary mb-3">₹{order.price}</div>
                                    ) : (
                                        <div className="text-warning small italic mb-3 d-flex align-items-center gap-2">
                                            <Clock size={14} /> Waiting for price agreement...
                                        </div>
                                    )}

                                    {order.status !== 'Approved' && (
                                        <div className="alert bg-white bg-opacity-5 border-0 small text-white-50 p-2 mb-0">
                                            The creator will contact you to agree on the price.
                                        </div>
                                    )}
                                    {order.status === 'Approved' && (
                                        <div className="text-success small fw-bold d-flex align-items-center gap-2 mt-2">
                                            <CheckCircle size={16} /> Order Finalized
                                        </div>
                                    )}
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
        </div>
    );
};

export default UserOrders;
