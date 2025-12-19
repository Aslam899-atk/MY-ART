import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ShoppingBag, X, Phone, Mail, MapPin, User, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
    const { products, addOrder, toggleLike, likedIds } = useContext(AppContext);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [orderForm, setOrderForm] = useState({ name: '', phone: '', email: '', address: '' });
    const [isSuccess, setIsSuccess] = useState(false);

    const handleOrderSubmit = (e) => {
        e.preventDefault();
        addOrder({
            productName: selectedProduct.name,
            price: selectedProduct.price,
            customer: orderForm.name,
            phone: orderForm.phone,
            email: orderForm.email,
            address: orderForm.address
        });
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            setSelectedProduct(null);
            setOrderForm({ name: '', phone: '', email: '', address: '' });
        }, 3000);
    };

    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem' }}>The <span style={{ color: 'var(--primary)' }}>Gallery</span></h1>
                <p style={{ color: 'var(--text-muted)' }}>Browse our exclusive collection of premium artworks.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {products.map(product => (
                    <div key={product.id} className="glass animate-fade-in" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ position: 'relative', height: '240px', background: `url(${product.image}) center/cover`, borderBottom: '1px solid var(--glass-border)' }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleLike(product.id); }}
                                style={{
                                    position: 'absolute', top: '1rem', right: '1rem',
                                    background: likedIds && likedIds.includes(product.id) ? 'rgba(239, 68, 68, 0.8)' : 'rgba(15, 23, 42, 0.6)',
                                    backdropFilter: 'blur(4px)', color: 'white', padding: '0.5rem 0.8rem',
                                    borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    border: '1px solid var(--glass-border)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <span style={{ color: 'white', fontSize: '1.2rem' }}>&hearts;</span> {product.likes || 0}
                            </button>
                        </div>
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>{product.category || 'Artwork'}</span>
                                    <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>{product.name}</h3>
                                </div>
                                <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>${product.price}</span>
                            </div>
                            <button
                                onClick={() => setSelectedProduct(product)}
                                className="btn-primary"
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <ShoppingBag size={18} /> Order Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {selectedProduct && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass"
                            style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}
                        >
                            {!isSuccess ? (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h2>Complete Your <span style={{ color: 'var(--primary)' }}>Order</span></h2>
                                        <button onClick={() => setSelectedProduct(null)} style={{ background: 'transparent', color: 'var(--text-muted)' }}><X size={24} /></button>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '2rem' }}>
                                        <div style={{ width: '60px', height: '60px', background: `url(${selectedProduct.image}) center/cover`, borderRadius: '8px' }}></div>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{selectedProduct.name}</div>
                                            <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${selectedProduct.price}</div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ position: 'relative' }}>
                                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input required placeholder="Full Name" value={orderForm.name} onChange={e => setOrderForm({ ...orderForm, name: e.target.value })} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input required placeholder="Phone Number" value={orderForm.phone} onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input required type="email" placeholder="Gmail Address" value={orderForm.email} onChange={e => setOrderForm({ ...orderForm, email: e.target.value })} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} />
                                            <textarea required rows="3" placeholder="Shipping Address" value={orderForm.address} onChange={e => setOrderForm({ ...orderForm, address: e.target.value })} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', resize: 'none' }} />
                                        </div>
                                        <button type="submit" className="btn-primary" style={{ padding: '1rem', marginTop: '1rem', fontWeight: 'bold' }}>Place Order</button>
                                    </form>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <div style={{ color: '#10b981', marginBottom: '1.5rem' }}><CheckCircle size={64} /></div>
                                    <h2 style={{ marginBottom: '1rem' }}>Order Received!</h2>
                                    <p style={{ color: 'var(--text-muted)' }}>We have received your order for <strong>{selectedProduct.name}</strong>. We will contact you soon!</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Shop;
