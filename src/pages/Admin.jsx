import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Package, MessageSquare, ShoppingBag, Plus, Trash2, Edit3, LogOut, X, CheckCircle, Upload, MapPin, Phone, Mail, User, Settings, Lock, Heart } from 'lucide-react';

const Admin = () => {
    const { products, addProduct, deleteProduct, updateProduct, messages, deleteMessage, orders, deleteOrder, isAdmin, setIsAdmin, adminPassword, changePassword } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('products');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', price: '', category: '', image: '' });
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
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingProduct) {
            updateProduct({ ...formData, id: editingProduct.id, price: Number(formData.price) });
        } else {
            addProduct({ ...formData, price: Number(formData.price) });
        }
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({ name: '', price: '', category: '', image: '' });
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setFormData({ name: product.name, price: product.price, category: product.category || 'Artwork', image: product.image });
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem' }}>Admin <span style={{ color: 'var(--primary)' }}>Control</span></h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your inventory, messages and orders from one place.</p>
                </div>
                <button onClick={handleLogout} className="glass" style={{ padding: '0.75rem 1.5rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button onClick={() => setActiveTab('products')} className={`glass ${activeTab === 'products' ? 'btn-primary' : ''}`} style={{ flex: 1, minWidth: '150px', padding: '1rem', border: activeTab === 'products' ? 'none' : '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'white' }}>
                    <Package size={20} /> Products
                </button>
                <button onClick={() => setActiveTab('messages')} className={`glass ${activeTab === 'messages' ? 'btn-primary' : ''}`} style={{ flex: 1, minWidth: '150px', padding: '1rem', border: activeTab === 'messages' ? 'none' : '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'white' }}>
                    <MessageSquare size={20} /> Messages ({messages.length})
                </button>
                <button onClick={() => setActiveTab('orders')} className={`glass ${activeTab === 'orders' ? 'btn-primary' : ''}`} style={{ flex: 1, minWidth: '150px', padding: '1rem', border: activeTab === 'orders' ? 'none' : '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'white' }}>
                    <ShoppingBag size={20} /> Orders ({orders.length})
                </button>
                <button onClick={() => setActiveTab('settings')} className={`glass ${activeTab === 'settings' ? 'btn-primary' : ''}`} style={{ flex: 1, minWidth: '150px', padding: '1rem', border: activeTab === 'settings' ? 'none' : '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'white' }}>
                    <Settings size={20} /> Settings
                </button>
            </div>

            <div className="glass animate-fade-in" style={{ padding: '2rem' }}>
                {activeTab === 'products' && (
                    <div style={{ overflowX: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3>Product Inventory</h3>
                            <button onClick={() => { setIsModalOpen(true); setEditingProduct(null); setFormData({ name: '', price: '', category: '', image: '' }); }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Plus size={18} /> Add Art
                            </button>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '1rem' }}>Art</th>
                                    <th style={{ padding: '1rem' }}>Price</th>
                                    <th style={{ padding: '1rem' }}>Likes</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                        <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', background: `url(${p.image}) center/cover`, borderRadius: '8px' }}></div>
                                            {p.name}
                                        </td>
                                        <td style={{ padding: '1rem' }}>${p.price}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent)' }}>
                                                <Heart size={14} fill="var(--accent)" /> {p.likes || 0}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => openEdit(p)} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '4px' }}><Edit3 size={16} /></button>
                                                <button onClick={() => deleteProduct(p.id)} style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent)', padding: '0.5rem', borderRadius: '4px' }}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        {/* SECTION 1: GENERAL INQUIRIES */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', color: 'var(--primary)' }}>
                                    <Mail size={24} />
                                </div>
                                <h3 style={{ margin: 0 }}>General Inquiries</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {messages.filter(m => !m.type || m.type === 'inquiry').length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)' }}>No inquiries yet.</p>
                                ) : (
                                    messages.filter(m => !m.type || m.type === 'inquiry').map(m => (
                                        <div key={m.id} className="glass" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <div>
                                                    <strong style={{ fontSize: '1.1rem' }}>{m.name}</strong>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0' }}>{m.email}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{m.date}</p>
                                                </div>
                                                <button onClick={() => deleteMessage(m.id)} style={{ background: 'transparent', color: 'var(--accent)' }}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            <p style={{ color: '#e2e8f0', lineHeight: '1.6' }}>{m.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* SECTION 2: SERVICE / ORDER REQUESTS */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ padding: '0.5rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '8px', color: 'var(--accent)' }}>
                                    <ShoppingBag size={24} />
                                </div>
                                <h3 style={{ margin: 0 }}>Service / Order Requests</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {messages.filter(m => m.type === 'service').length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)' }}>No service requests yet.</p>
                                ) : (
                                    messages.filter(m => m.type === 'service').map(m => (
                                        <div key={m.id} className="glass" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
                                                        <User size={20} color="var(--primary)" />
                                                    </div>
                                                    <div>
                                                        <strong style={{ fontSize: '1.1rem' }}>{m.name}</strong>
                                                        <p style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{m.date}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => deleteMessage(m.id)} style={{ background: 'transparent', color: 'var(--accent)' }}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                                    <Phone size={16} color="var(--primary)" />
                                                    <span>{m.phone}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                                    <Mail size={16} color="var(--primary)" />
                                                    <span>{m.email}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', gridColumn: '1 / -1' }}>
                                                    <MapPin size={16} color="var(--primary)" />
                                                    <span>{m.address}</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                <div>
                                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>COMMENT / DETAILS</label>
                                                    <p style={{ color: '#e2e8f0', lineHeight: '1.6' }}>{m.message}</p>
                                                </div>
                                                {m.image && (
                                                    <div>
                                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>SHOWCASE IMAGE</label>
                                                        <img src={m.image} alt="Showcase" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '12px', border: '1px solid var(--glass-border)' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div>
                        <h3>Recent Orders</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                            {orders.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No orders yet.</p> : orders.map(o => (
                                <div key={o.id} className="glass" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{o.productName}</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Order ID: #{o.id} | {o.date}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ fontWeight: '800', fontSize: '1.3rem' }}>${o.price}</div>
                                            <button onClick={() => deleteOrder(o.id)} style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent)', border: 'none', padding: '0.6rem', borderRadius: '10px' }}>
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                                            <User size={18} color="var(--primary)" />
                                            <div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Customer</div>
                                                {o.customer}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                                            <Phone size={18} color="var(--primary)" />
                                            <div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Phone</div>
                                                {o.phone}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                                            <Mail size={18} color="var(--primary)" />
                                            <div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Gmail</div>
                                                {o.email}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', gridColumn: '1 / -1' }}>
                                            <MapPin size={18} color="var(--primary)" />
                                            <div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Shipping Address</div>
                                                {o.address}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div style={{ maxWidth: '500px' }}>
                        <h3>Admin Settings</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Update your security preferences.</p>

                        <form onSubmit={handlePassChange} className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    required
                                    type="password"
                                    placeholder="New Admin Password"
                                    value={newPass}
                                    onChange={e => setNewPass(e.target.value)}
                                    style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ padding: '1rem', fontWeight: 'bold' }}>Update Password</button>
                            {passUpdateStatus && (
                                <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                    <CheckCircle size={16} /> {passUpdateStatus}
                                </div>
                            )}
                        </form>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2>{editingProduct ? 'Edit Art' : 'Add New Art'}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', color: 'var(--text-muted)' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <input
                                required
                                placeholder="Artwork Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                            />
                            <input
                                required
                                type="number"
                                placeholder="Price"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                            />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Image Source</label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <label className="glass" style={{ flex: 1, padding: '1rem', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: '1px dashed var(--primary)' }}>
                                        <Upload size={18} /> Upload from PC
                                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                    </label>
                                </div>
                                {formData.image && (
                                    <div style={{ marginTop: '1rem', position: 'relative' }}>
                                        <img src={formData.image} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <button type="button" onClick={() => setFormData({ ...formData, image: '' })} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.25rem', borderRadius: '50%' }}><X size={16} /></button>
                                    </div>
                                )}
                                <input
                                    placeholder="Or paste Image URL"
                                    value={formData.image && formData.image.startsWith('data:') ? '' : formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                />
                            </div>

                            <button type="submit" className="btn-primary" style={{ padding: '1rem' }}>
                                {editingProduct ? 'Update Artwork' : 'Add to Collection'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
