import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import LazyImage from '../components/LazyImage';
import ItemPreview from '../components/ItemPreview';
import { Heart, Search, Share2, ZoomIn, X, Play, Filter } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
    const { galleryItems, toggleGalleryLike, likedIds, addMessage, user } = useContext(AppContext);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filter, setFilter] = useState('All');
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', email: '' });
    const [isSuccess, setIsSuccess] = useState(false);

    const categories = ['All', 'Painting', 'Pencil Drawing', 'Calligraphy', 'Other'];

    const filteredItems = filter === 'All'
        ? galleryItems
        : galleryItems.filter(item => item.category === filter);

    const handleShare = async (item) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: item.title || 'Art Void Gallery',
                    text: 'Explore this masterpiece from Art Void Studio.',
                    url: window.location.href
                });
            } catch {
                console.log('Share canceled');
            }
        } else {
            alert('URL copied to clipboard!');
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '10rem', paddingBottom: '6rem' }}>
            {/* Header */}
            <header className="mb-5 text-center">
                <Motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-primary fw-bold small text-uppercase mb-2 letter-spacing-2"
                    style={{ letterSpacing: '3px' }}
                >
                    Project Lab
                </Motion.div>
                <Motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="display-2 fw-bold mb-4 font-heading"
                >
                    Technical <span className="text-gradient">Exhibition</span>
                </Motion.h1>
                <Motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lead text-muted mx-auto mb-5"
                    style={{ maxWidth: '650px' }}
                >
                    A collection of digital solutions and technical experiments. Every piece represents a challenge solved through code, design, and artistic engineering.
                </Motion.p>

                {/* Filters */}
                <div className="d-flex justify-content-center gap-2 flex-wrap mb-5">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`btn rounded-pill px-4 py-2 border-0 transition-all small fw-bold ${filter === cat ? 'btn-primary shadow-glow' : 'glass text-white opacity-60 hover-opacity-100'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            {/* Gallery Grid */}
            <div className="row g-4">
                <AnimatePresence mode="popLayout">
                    {filteredItems.map((item) => (
                        <div key={item._id || item.id} className="col-12 col-md-6 col-lg-4">
                            <Motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                className="glass border-0 rounded-4 overflow-hidden position-relative group shadow-lg"
                                style={{ height: '400px' }}
                            >
                                {item.type === 'video' ? (
                                    <video
                                        src={item.url}
                                        className="w-100 h-100 object-fit-cover"
                                        muted
                                        loop
                                        autoPlay
                                        playsInline
                                    />
                                ) : (
                                    <LazyImage
                                        src={item.url}
                                        alt={item.title || 'Artwork'}
                                        className="w-100 h-100 transition-transform duration-700 hover-zoom"
                                        onClick={() => setSelectedItem(item)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                )}

                                {/* Overlay Label */}
                                <div className="position-absolute top-0 start-0 m-3 px-3 py-1 glass rounded-pill small fw-bold text-white opacity-75">
                                    {item.category || 'Artwork'}
                                </div>

                                {/* Actions Overlay */}
                                <div className="position-absolute bottom-0 start-0 w-100 p-4 d-flex justify-content-between align-items-end"
                                    style={{ background: 'linear-gradient(to top, rgba(7, 11, 20, 0.9), transparent)' }}>
                                    <div className="text-start">
                                        <h5 className="fw-bold mb-1">{item.title || 'Untitled Masterpiece'}</h5>
                                        <div className="d-flex gap-2">
                                            <span className="small text-primary fw-bold">{item.medium || 'Handcrafted'}</span>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button
                                            onClick={() => toggleGalleryLike(item._id || item.id)}
                                            className="btn p-2 rounded-circle glass text-white border-0 shadow-sm"
                                        >
                                            <Heart size={18} fill={likedIds.includes(item._id || item.id) ? "var(--primary)" : "none"} className={likedIds.includes(item._id || item.id) ? "text-primary border-0" : ""} />
                                        </button>
                                        <button
                                            onClick={() => handleShare(item)}
                                            className="btn p-2 rounded-circle glass text-white border-0 shadow-sm"
                                        >
                                            <Share2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {item.type === 'video' && (
                                    <div className="position-absolute top-50 start-50 translate-middle pointer-events-none group-hover-opacity-0 transition-all">
                                        <div className="glass rounded-circle p-3">
                                            <Play fill="white" className="text-white" size={24} />
                                        </div>
                                    </div>
                                )}
                            </Motion.div>
                        </div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Premium Preview Modal */}
            <ItemPreview
                item={selectedItem}
                isOpen={!!selectedItem && !showInquiryForm}
                onClose={() => setSelectedItem(null)}
                isLiked={selectedItem && likedIds.includes(selectedItem._id || selectedItem.id)}
                toggleLike={() => toggleGalleryLike(selectedItem?._id || selectedItem?.id)}
                onInquire={() => setShowInquiryForm(true)}
                onNext={() => {
                    const currentIndex = filteredItems.findIndex(i => (i._id || i.id) === (selectedItem?._id || selectedItem?.id));
                    const nextIndex = (currentIndex + 1) % filteredItems.length;
                    setSelectedItem(filteredItems[nextIndex]);
                }}
                onPrev={() => {
                    const currentIndex = filteredItems.findIndex(i => (i._id || i.id) === (selectedItem?._id || selectedItem?.id));
                    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
                    setSelectedItem(filteredItems[prevIndex]);
                }}
            />

            <AnimatePresence>
                {selectedItem && showInquiryForm && (
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
                                        <h2 className="h3 fw-bold mb-0">Ask about <span className="text-primary">Masterpiece</span></h2>
                                        <p className="text-muted small">Artwork: <strong>{selectedItem.title}</strong></p>
                                    </div>

                                    <div className="d-flex gap-3 align-items-start p-3 rounded-4 mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        <div className="flex-shrink-0">
                                            <img
                                                src={selectedItem.url}
                                                alt={selectedItem.title}
                                                className="rounded-3"
                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div>
                                            <div className="fw-bold fs-5">{selectedItem.title}</div>
                                            <div className="text-primary small fw-bold">{selectedItem.medium}</div>
                                        </div>
                                    </div>

                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        addMessage({
                                            name: inquiryForm.name,
                                            phone: inquiryForm.phone,
                                            email: inquiryForm.email,
                                            message: `Inquiry about artwork: "${selectedItem.title}" (${selectedItem.category})`,
                                            receiverId: selectedItem.creatorId,
                                            image: selectedItem.url,
                                            type: 'inquiry'
                                        });
                                        setIsSuccess(true);
                                        setTimeout(() => {
                                            setIsSuccess(false);
                                            setShowInquiryForm(false);
                                            setSelectedItem(null);
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
                                    <p className="lead text-muted">The artist has received your message about <strong className="text-white">{selectedItem.title}</strong>.</p>
                                </div>
                            )}
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
