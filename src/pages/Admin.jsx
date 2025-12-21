import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, MessageSquare, ShoppingBag, Plus, Trash2, Edit3, LogOut, X, CheckCircle, Upload, MapPin, Phone, Mail, User, Settings, Lock, Heart } from 'lucide-react';
import { storage } from '../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const Admin = () => {
    const { products, addProduct, deleteProduct, updateProduct, messages, deleteMessage, orders, deleteOrder, isAdmin, setIsAdmin, adminPassword, changePassword } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('products');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', price: '', image: '' });
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
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
                const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);

                imageUrl = await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setUploadProgress(Math.round(progress));
                        },
                        (error) => {
                            console.error(error);
                            reject(error);
                        },
                        async () => {
                            const url = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve(url);
                        }
                    );
                });
            }

            const productData = {
                ...formData,
                image: imageUrl,
                price: formData.price ? Number(formData.price) : 0, // Ensure price is valid
            };

            if (editingProduct) {
                await updateProduct({ ...productData, id: editingProduct.id });
            } else {
                await addProduct(productData);
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            setFormData({ name: '', price: '', image: '' });
            setImageFile(null);
            setUploadProgress(0);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            image: product.image,
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
                    { id: 'products', icon: Package, label: 'Products', count: products.length },
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
                            <h3 className="h4 fw-bold mb-0">Product Inventory</h3>
                            <button onClick={() => { setIsModalOpen(true); setEditingProduct(null); setFormData({ name: '', price: '', image: '' }); }} className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-3 border-0">
                                <Plus size={18} /> <span className="d-none d-sm-inline">Add Art</span>
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
                                    <tr key={p.id} className="border-bottom border-secondary border-opacity-10">
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
                                        <td className="py-3 px-4 border-0 fw-bold text-primary">${p.price}</td>
                                        <td className="py-3 px-4 border-0">
                                            <div className="d-flex align-items-center gap-2 text-danger">
                                                <Heart size={14} fill="var(--accent)" /> {p.likes || 0}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 border-0 text-end">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button onClick={() => openEdit(p)} className="btn btn-sm glass text-primary border-0 p-2"><Edit3 size={16} /></button>
                                                <button onClick={() => deleteProduct(p.id)} className="btn btn-sm glass text-danger border-0 p-2"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="d-flex flex-column gap-5">
                        <section>
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary"><Mail size={24} /></div>
                                <h3 className="h4 fw-bold mb-0">General Inquiries</h3>
                            </div>
                            <div className="row g-3">
                                {messages.filter(m => !m.type || m.type === 'inquiry').length === 0 ? (
                                    <div className="col-12"><p className="text-muted">No inquiries yet.</p></div>
                                ) : (
                                    messages.filter(m => !m.type || m.type === 'inquiry').map(m => (
                                        <div key={m.id} className="col-12">
                                            <div className="glass p-4 border-0 rounded-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div className="d-flex gap-3">
                                                        <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}><User size={20} className="text-muted" /></div>
                                                        <div>
                                                            <div className="fw-bold">{m.name}</div>
                                                            <div className="small text-muted">{m.email}</div>
                                                            <div className="text-primary smaller mt-1" style={{ fontSize: '0.7rem' }}>{m.date}</div>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => deleteMessage(m.id)} className="btn text-danger p-2 border-0 opacity-75 hover-opacity-100"><Trash2 size={18} /></button>
                                                </div>
                                                <p className="text-light-muted mb-0 lh-lg">{m.message}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        <section>
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="bg-danger bg-opacity-10 p-2 rounded-3 text-danger"><ShoppingBag size={24} /></div>
                                <h3 className="h4 fw-bold mb-0">Service / Order Requests</h3>
                            </div>
                            <div className="row g-4">
                                {messages.filter(m => m.type === 'service').length === 0 ? (
                                    <div className="col-12"><p className="text-muted">No service requests yet.</p></div>
                                ) : (
                                    messages.filter(m => m.type === 'service').map(m => (
                                        <div key={m.id} className="col-12">
                                            <div className="glass p-4 border-0 rounded-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                <div className="d-flex justify-content-between align-items-start mb-4">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="bg-primary bg-opacity-20 p-2 rounded-3"><User size={24} className="text-primary" /></div>
                                                        <div>
                                                            <div className="fw-bold fs-5">{m.name}</div>
                                                            <div className="small text-primary">{m.date}</div>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => deleteMessage(m.id)} className="btn text-danger p-2 border-0"><Trash2 size={18} /></button>
                                                </div>

                                                <div className="row g-3 p-3 bg-black bg-opacity-25 rounded-4 mb-4">
                                                    <div className="col-12 col-md-4 d-flex align-items-center gap-2 small">
                                                        <Phone size={16} className="text-primary" /> <span>{m.phone}</span>
                                                    </div>
                                                    <div className="col-12 col-md-4 d-flex align-items-center gap-2 small">
                                                        <Mail size={16} className="text-primary" /> <span>{m.email}</span>
                                                    </div>
                                                    <div className="col-12 d-flex align-items-center gap-2 small">
                                                        <MapPin size={16} className="text-primary" /> <span>{m.address}</span>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label className="smaller text-muted text-uppercase fw-bold mb-2 d-block">Message / Details</label>
                                                    <p className="text-light-muted mb-0">{m.message}</p>
                                                </div>

                                                {m.image && (
                                                    <div>
                                                        <label className="smaller text-muted text-uppercase fw-bold mb-2 d-block">Reference Image</label>
                                                        <img src={m.image} alt="Reference" className="img-fluid rounded-4 border border-secondary border-opacity-25" style={{ maxHeight: '400px' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div>
                        <h3 className="h4 fw-bold mb-4">Recent Orders</h3>
                        <div className="d-flex flex-column gap-4">
                            {orders.length === 0 ? <p className="text-muted">No orders yet.</p> : orders.map(o => (
                                <div key={o.id} className="glass p-4 border-0 rounded-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start mb-4 gap-3">
                                        <div>
                                            <h4 className="h5 fw-bold text-primary mb-1">{o.productName}</h4>
                                            <p className="smaller text-muted mb-0">Order ID: <span className="text-white opacity-75">#{o.id}</span> | {o.date}</p>
                                        </div>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="h4 fw-bold mb-0">${o.price}</div>
                                            <button onClick={() => deleteOrder(o.id)} className="btn btn-sm glass text-danger border-0 p-2"><Trash2 size={20} /></button>
                                        </div>
                                    </div>

                                    <div className="row g-4 p-4 bg-black bg-opacity-25 rounded-4">
                                        {[
                                            { icon: User, label: 'Customer', value: o.customer },
                                            { icon: Phone, label: 'Phone', value: o.phone },
                                            { icon: Mail, label: 'Email', value: o.email },
                                            { icon: MapPin, label: 'Shipping Address', value: o.address, full: true }
                                        ].map((item, i) => (
                                            <div key={i} className={`col-12 ${item.full ? '' : 'col-md-4'} d-flex align-items-start gap-3`}>
                                                <div className="text-primary bg-primary bg-opacity-10 p-2 rounded-3"><item.icon size={18} /></div>
                                                <div>
                                                    <div className="smaller text-muted fw-bold text-uppercase">{item.label}</div>
                                                    <div className="text-light-muted">{item.value}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div style={{ maxWidth: '500px' }}>
                        <h3 className="h4 fw-bold mb-2">Admin Settings</h3>
                        <p className="text-muted mb-5">Update your security and app preferences.</p>

                        <form onSubmit={handlePassChange} className="glass p-4 p-md-5 border-0 rounded-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <div className="mb-4">
                                <label className="small fw-bold text-muted text-uppercase mb-2">New Admin Password</label>
                                <div className="position-relative">
                                    <Lock size={18} className="position-absolute translate-middle-y text-muted" style={{ left: '1rem', top: '50%' }} />
                                    <input
                                        required
                                        type="password"
                                        placeholder="Enter New Password"
                                        className="form-control bg-dark border-0 text-white ps-5 py-3 rounded-3"
                                        style={{ background: 'rgba(0,0,0,0.2) !important' }}
                                        value={newPass}
                                        onChange={e => setNewPass(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 py-3 fw-bold border-0 rounded-3">Update Password</button>
                            {passUpdateStatus && (
                                <div className="mt-3 text-success d-flex align-items-center justify-content-center gap-2 small">
                                    <CheckCircle size={16} /> {passUpdateStatus}
                                </div>
                            )}
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
                            <h2 className="h4 fw-bold mb-0">{editingProduct ? 'Edit Artwork' : 'Add New artwork'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="btn text-muted p-0 border-0"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                            <div className="d-flex flex-column gap-2">
                                <label className="small fw-bold text-muted text-uppercase">Artwork Name</label>
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
                                <label className="small fw-bold text-muted text-uppercase">Price ($) <span className="text-secondary fw-normal">(Optional - Leave empty for "Inquire")</span></label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="form-control bg-dark border-0 text-white py-3 rounded-3"
                                    style={{ background: 'rgba(0,0,0,0.2) !important' }}
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>

                            <div className="d-flex flex-column gap-2">
                                <label className="small fw-bold text-muted text-uppercase">Artwork Image</label>
                                <div className="d-flex flex-column gap-3">
                                    <label className="btn glass border-0 text-white py-4 rounded-3 d-flex flex-column align-items-center justify-content-center gap-2 border-dashed" style={{ border: '2px dashed rgba(255,255,255,0.1) !important' }}>
                                        <div className="bg-primary bg-opacity-10 p-2 rounded-circle"><Upload size={24} className="text-primary" /></div>
                                        <span className="fw-medium">Click to upload from PC</span>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="d-none" />
                                    </label>

                                    {formData.image && (
                                        <div className="position-relative">
                                            <img src={formData.image} alt="Preview" className="img-fluid w-100 rounded-3 border border-secondary border-opacity-25" style={{ height: '180px', objectFit: 'cover' }} />
                                            <button type="button" onClick={() => { setFormData({ ...formData, image: '' }); setImageFile(null); }} className="btn btn-sm btn-dark position-absolute top-0 end-0 m-2 rounded-circle shadow"><X size={16} /></button>
                                        </div>
                                    )}

                                    <div className="d-flex align-items-center gap-3 py-2">
                                        <hr className="flex-grow-1 opacity-25" />
                                        <span className="smaller text-muted text-uppercase fw-bold">OR</span>
                                        <hr className="flex-grow-1 opacity-25" />
                                    </div>

                                    <input
                                        placeholder="Paste Artwork URL here"
                                        className="form-control bg-dark border-0 text-white py-3 rounded-3"
                                        style={{ background: 'rgba(0,0,0,0.2) !important' }}
                                        value={formData.image && formData.image.startsWith('http') ? formData.image : ''}
                                        onChange={e => {
                                            setFormData({ ...formData, image: e.target.value });
                                            setImageFile(null); // Clear file if URL is pasted
                                        }}
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={isUploading} className="btn btn-primary py-3 rounded-3 fw-bold border-0 mt-2 d-flex align-items-center justify-content-center gap-2 shadow">
                                {isUploading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        {imageFile ? `Uploading ${uploadProgress}%` : 'Saving...'}
                                    </>
                                ) : (
                                    editingProduct ? 'Update Collection' : 'Add to Collection'
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
