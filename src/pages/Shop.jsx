import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import LazyImage from '../components/LazyImage';
import ItemPreview from '../components/ItemPreview';
import Preloader from '../components/Preloader';
import { ShoppingBag, X, Phone, Mail, MapPin, User, CheckCircle, Heart, Search, MessageSquare } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
    const { products, addOrder, toggleLike, likedIds, user, addMessage, users, isLoadingData } = useContext(AppContext);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [orderForm, setOrderForm] = useState({ name: '', phone: '', email: '', address: '' });
    const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', email: '' });
    const [isSuccess, setIsSuccess] = useState(false);

    // Auto-fill form if user is logged in
    React.useEffect(() => {
        if (user) {
            setOrderForm(prev => ({
                ...prev,
                name: user.name || user.username || '',
                email: user.email || ''
            }));
            setInquiryForm(prev => ({
                ...prev,
                name: user.name || user.username || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = useMemo(() => {
        if (!searchQuery) return products;
        const q = searchQuery.toLowerCase();
        return products.filter(product =>
            product.name?.toLowerCase().includes(q) ||
            product.category?.toLowerCase().includes(q) ||
            product.description?.toLowerCase().includes(q)
        );
    }, [products, searchQuery]);

    const handleOrderSubmit = (e) => {
        e.preventDefault();
        addOrder({
            productName: selectedProduct.name,
            price: selectedProduct.price,
            customer: orderForm.name,
            phone: orderForm.phone,
            email: orderForm.email,
            address: orderForm.address,
            image: selectedProduct.image,
            creatorId: selectedProduct.creatorId,
            customerId: user?._id || user?.id,
            type: 'product'
        });
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            setSelectedProduct(null);
            setOrderForm({ name: '', phone: '', email: '', address: '' });
        }, 3000);
    };

    if (isLoadingData && products.length === 0) {
        return <Preloader />;
    }

    return (
        <div className="container pt-responsive pb-5">
            <header className="mb-5 text-center">
                <Motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-primary fw-bold small text-uppercase mb-2 letter-spacing-1"
                >
                    Premium Store
                </Motion.div>
                <Motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="display-2 fw-bold mb-4"
                >
                    The <span className="text-gradient">Shop</span>
                </Motion.h1>
                <Motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lead text-muted mx-auto mb-5"
                    style={{ maxWidth: '600px' }}
                >
                    Acquire original masterpieces and limited edition prints from our exclusive studio collection.
                </Motion.p>

                {/* Search Bar */}
                <div className="glass p-2 rounded-pill mt-4 d-flex align-items-center gap-3 mx-auto shadow-lg" style={{ maxWidth: '500px', background: 'rgba(255,255,255,0.05)' }}>
                    <div className="ps-3 text-muted"><Search size={18} /></div>
                    <input
                        type="text"
                        placeholder="Search artworks..."
                        className="form-control bg-transparent border-0 text-white py-2 shadow-none"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <div className="row g-4">
                {filteredProducts.map(product => (
                    <div key={product._id || product.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                        <div className="glass animate-fade-in h-100 overflow-hidden d-flex flex-column border-0">
                            <div className="position-relative overflow-hidden" style={{ height: '260px' }}>
                                <LazyImage
                                    src={product.image}
                                    alt={product.name}
                                    className="w-100 h-100 hover-zoom"
                                    onClick={() => { setSelectedProduct(product); setShowPreview(true); }}
                                    style={{ objectFit: 'cover', cursor: 'pointer' }}
                                />
                                <div className="position-absolute top-0 end-0 m-3 d-flex gap-2">
                                    <span className="badge glass text-white border-0 shadow-sm">₹{product.price}</span>
                                </div>
                                <div className="position-absolute bottom-0 end-0 m-3 d-flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedProduct(product);
                                            setShowPreview(true);
                                        }}
                                        className="btn btn-sm glass border-0 rounded-circle p-2 text-white shadow-sm hover-scale"
                                        title="View Details & Comments"
                                    >
                                        <MessageSquare size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleLike(product._id || product.id);
                                        }}
                                        className="btn btn-sm glass border-0 rounded-circle p-2 text-white shadow-sm hover-scale"
                                    >
                                        <Heart size={18} fill={likedIds.includes(product._id || product.id) ? "var(--accent)" : "none"} className={likedIds.includes(product._id || product.id) ? "text-danger" : ""} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 d-flex flex-column gap-3 flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h3 className="h5 mt-1 mb-0">{product.name}</h3>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setSelectedProduct(product); setShowOrderForm(true); }}
                                    className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 rounded-3 border-0 mt-auto"
                                >
                                    <ShoppingBag size={18} /> Order Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Removed ItemPreview from Shop to go direct-to-order as requested */}

            <AnimatePresence>
                {selectedProduct && showOrderForm && (
                    <div className="d-flex align-items-center justify-content-center px-3 py-4 position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.95)', zIndex: 11000, overflowY: 'auto', backdropFilter: 'blur(10px)' }}>
                        <Motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass p-4 p-md-5 position-relative w-100 my-auto"
                            style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <button
                                onClick={() => setShowOrderForm(false)}
                                className="position-absolute top-0 end-0 m-4 btn text-muted p-0 border-0"
                            >
                                <X size={24} />
                            </button>

                            {!isSuccess ? (
                                <>
                                    <div className="mb-4 text-center">
                                        <h2 className="h3 fw-bold mb-0">Complete Your <span className="text-primary">Order</span></h2>
                                        <p className="text-muted small mb-0">You are ordering: <strong>{selectedProduct.name}</strong></p>
                                        <div className="extra-small opacity-50 fw-bold">By {users?.find(u => (u._id || u.id) === selectedProduct.creatorId)?.username || 'Art Void'}</div>
                                    </div>


                                    <div className="d-flex gap-3 align-items-start p-3 rounded-4 mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        <div className="flex-shrink-0">
                                            <img
                                                src={selectedProduct.image}
                                                alt={selectedProduct.name}
                                                className="rounded-3"
                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div>
                                            <div className="text-primary fw-bold h4 mb-1">
                                                ₹{selectedProduct.price}
                                            </div>
                                            <div className="fw-bold fs-5">{selectedProduct.name}</div>
                                            {selectedProduct.description && (
                                                <p className="text-muted small mt-2 mb-0 border-top border-secondary border-opacity-25 pt-2">
                                                    {selectedProduct.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <form onSubmit={handleOrderSubmit} className="d-flex flex-column gap-3">
                                        <div className="alert alert-info border-0 bg-primary bg-opacity-10 text-primary small mb-0">
                                            {selectedProduct.price > 0
                                                ? "Fill out your details to place an order. We'll contact you for payment."
                                                : "Interested in this piece? Send us an inquiry and we'll get back to you with pricing and availability."}
                                        </div>
                                        <div className="position-relative">
                                            <User size={18} className="position-absolute translate-middle-y text-muted" style={{ left: '1rem', top: '50%' }} />
                                            <input required placeholder="Full Name" className="form-control bg-dark border-0 text-white ps-5 py-3" style={{ background: 'rgba(0,0,0,0.2) !important' }} value={orderForm.name} onChange={e => setOrderForm({ ...orderForm, name: e.target.value })} />
                                        </div>
                                        <div className="position-relative">
                                            <Phone size={18} className="position-absolute translate-middle-y text-muted" style={{ left: '1rem', top: '50%' }} />
                                            <input required placeholder="Phone Number" className="form-control bg-dark border-0 text-white ps-5 py-3" style={{ background: 'rgba(0,0,0,0.2) !important' }} value={orderForm.phone} onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })} />
                                        </div>
                                        <div className="position-relative">
                                            <Mail size={18} className="position-absolute translate-middle-y text-muted" style={{ left: '1rem', top: '50%' }} />
                                            <input required type="email" placeholder="Gmail Address" className="form-control bg-dark border-0 text-white ps-5 py-3" style={{ background: 'rgba(0,0,0,0.2) !important' }} value={orderForm.email} onChange={e => setOrderForm({ ...orderForm, email: e.target.value })} />
                                        </div>
                                        <div className="position-relative">
                                            <MapPin size={18} className="position-absolute text-muted" style={{ left: '1rem', top: '1.2rem' }} />
                                            <textarea required rows="3" placeholder={selectedProduct.price > 0 ? "Shipping Address" : "Message / Query"} className="form-control bg-dark border-0 text-white ps-5 py-3" style={{ background: 'rgba(0,0,0,0.2) !important', resize: 'none' }} value={orderForm.address} onChange={e => setOrderForm({ ...orderForm, address: e.target.value })} />
                                        </div>
                                        <button type="submit" className="btn btn-primary py-3 fw-bold border-0 rounded-3 mt-2">{selectedProduct.price > 0 ? 'Place Order' : 'Send Inquiry'}</button>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="text-success mb-4"><CheckCircle size={80} /></div>
                                    <h2 className="h2 fw-bold mb-3">Order Received!</h2>
                                    <p className="lead text-muted">We have received your order for <strong className="text-white">{selectedProduct.name}</strong>. We will contact you soon!</p>
                                </div>
                            )}
                        </Motion.div>
                    </div>
                )}

                {selectedProduct && showInquiryForm && (
                    <div className="d-flex align-items-center justify-content-center px-3 py-4 position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.95)', zIndex: 11000, overflowY: 'auto', backdropFilter: 'blur(10px)' }}>
                        <Motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass p-4 p-md-5 position-relative w-100 my-auto"
                            style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <button
                                onClick={() => setShowInquiryForm(false)}
                                className="position-absolute top-0 end-0 m-4 btn text-muted p-0 border-0"
                            >
                                <X size={24} />
                            </button>

                            {!isSuccess ? (
                                <>
                                    <div className="mb-4 text-center">
                                        <h2 className="h3 fw-bold mb-0">Ask about <span className="text-primary">Product</span></h2>
                                        <p className="text-muted small mb-0">Product: <strong>{selectedProduct.name}</strong></p>
                                        <div className="extra-small opacity-50 fw-bold">By {users?.find(u => (u._id || u.id) === selectedProduct.creatorId)?.username || 'Art Void'}</div>
                                    </div>

                                    <div className="d-flex gap-3 align-items-start p-3 rounded-4 mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        <div className="flex-shrink-0">
                                            <img
                                                src={selectedProduct.image}
                                                alt={selectedProduct.name}
                                                className="rounded-3"
                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div>
                                            <div className="fw-bold fs-5">{selectedProduct.name}</div>
                                            <div className="text-primary small fw-bold">Price: ₹{selectedProduct.price}</div>
                                        </div>
                                    </div>

                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        addMessage({
                                            name: inquiryForm.name,
                                            phone: inquiryForm.phone,
                                            email: inquiryForm.email,
                                            message: `Inquiry about shop product: "${selectedProduct.name}"`,
                                            receiverId: selectedProduct.creatorId,
                                            image: selectedProduct.image,
                                            type: 'inquiry'
                                        });
                                        setIsSuccess(true);
                                        setTimeout(() => {
                                            setIsSuccess(false);
                                            setShowInquiryForm(false);
                                            setSelectedProduct(null);
                                            setInquiryForm({ name: '', phone: '', email: '' });
                                        }, 3000);
                                    }} className="d-flex flex-column gap-3">
                                        <div className="alert alert-info border-0 bg-primary bg-opacity-10 text-primary small mb-0">
                                            The artist will receive your contact details and message.
                                        </div>
                                        <div className="position-relative">
                                            <User size={18} className="position-absolute translate-middle-y text-muted" style={{ left: '1rem', top: '50%' }} />
                                            <input required placeholder="Full Name" className="form-control bg-dark border-0 text-white ps-5 py-3" style={{ background: 'rgba(0,0,0,0.2) !important' }} value={inquiryForm.name} onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })} />
                                        </div>
                                        <div className="position-relative">
                                            <Phone size={18} className="position-absolute translate-middle-y text-muted" style={{ left: '1rem', top: '50%' }} />
                                            <input required placeholder="Phone Number" className="form-control bg-dark border-0 text-white ps-5 py-3" style={{ background: 'rgba(0,0,0,0.2) !important' }} value={inquiryForm.phone} onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })} />
                                        </div>
                                        <div className="position-relative">
                                            <Mail size={18} className="position-absolute translate-middle-y text-muted" style={{ left: '1rem', top: '50%' }} />
                                            <input required type="email" placeholder="Gmail Address" className="form-control bg-dark border-0 text-white ps-5 py-3" style={{ background: 'rgba(0,0,0,0.2) !important' }} value={inquiryForm.email} onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })} />
                                        </div>
                                        <button type="submit" className="btn btn-primary py-3 fw-bold border-0 rounded-3 mt-2">Send Message</button>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="text-success mb-4"><CheckCircle size={80} /></div>
                                    <h2 className="h2 fw-bold mb-3">Inquiry Sent!</h2>
                                    <p className="lead text-muted"> The artist has received your message about <strong className="text-white">{selectedProduct.name}</strong>.</p>
                                </div>
                            )}
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Premium Preview Modal */}
            <ItemPreview
                item={selectedProduct}
                isOpen={showPreview}
                onClose={() => { setShowPreview(false); setSelectedProduct(null); }}
                isLiked={selectedProduct && likedIds.includes(selectedProduct._id || selectedProduct.id)}
                toggleLike={() => toggleLike(selectedProduct?._id || selectedProduct?.id)}
                onOrder={(item) => { setShowPreview(false); setSelectedProduct(item); setShowOrderForm(true); }}
            />
        </div>
    );
};

export default Shop;
