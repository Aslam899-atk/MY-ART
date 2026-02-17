import React, { useContext, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Share2, ShoppingBag, Calendar, Tag, User, ArrowRight, ArrowLeft, Send, MessageSquare, Image as ImageIcon, Trash2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const ItemPreview = ({ item, isOpen, onClose, onNext, onPrev, toggleLike, isLiked, onOrder, onInquire }) => {
    const { addGalleryComment, addProductComment, deleteGalleryComment, deleteProductComment, user, isAdmin, users, products, galleryItems } = useContext(AppContext);

    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!item) return null;

    // Sync with global state to ensure live updates (comments/likes)
    const liveItem = isOpen ? (
        products.find(p => (p._id || p.id) === (item.productId || item._id || item.id)) ||
        galleryItems.find(g => (g._id || g.id) === (item.productId || item._id || item.id)) ||
        item
    ) : item;

    // Auto-detect type if missing
    const mediaType = liveItem.type || ((liveItem.url || liveItem.image)?.includes('.mp4') ? 'video' : 'image');

    // Determine if this item supports interactive features (like/comment)
    // Orders and tasks are view-only — they don't have comments or likes
    const isInteractive = item.type !== 'order' && item.type !== 'task';

    const handleShare = async () => {
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

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setIsSubmitting(true);
        const commentFn = isInteractive ? (liveItem.price ? addProductComment : addGalleryComment) : null;
        if (!commentFn) { // Prevent calling if not interactive
            setIsSubmitting(false);
            return;
        }
        const res = await commentFn(liveItem._id || liveItem.id, commentText);
        if (res?.success) {
            setCommentText('');
        }
        setIsSubmitting(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed-top w-100 h-100 d-flex align-items-center justify-content-center p-0 p-md-4"
                    style={{ background: 'rgba(3, 3, 3, 0.98)', zIndex: 999999, backdropFilter: 'blur(20px)' }}
                    onClick={onClose}
                >
                    {/* Close Button */}
                    <button
                        className="position-absolute top-0 end-0 m-4 btn text-white border-0 p-3 glass z-index-10 hover-scale"
                        onClick={onClose}
                        style={{ zIndex: 10002 }}
                    >
                        <X size={24} />
                    </button>

                    {/* Navigation Buttons (Desktop) */}
                    {onPrev && (
                        <button
                            className="position-absolute start-0 top-50 translate-middle-y ms-4 d-none d-lg-flex btn glass p-4 text-white border-0 rounded-circle hover-scale"
                            onClick={(e) => { e.stopPropagation(); onPrev(); }}
                            style={{ zIndex: 10002 }}
                        >
                            <ArrowLeft size={24} />
                        </button>
                    )}
                    {onNext && (
                        <button
                            className="position-absolute end-0 top-50 translate-middle-y me-4 d-none d-lg-flex btn glass p-4 text-white border-0 rounded-circle hover-scale"
                            onClick={(e) => { e.stopPropagation(); onNext(); }}
                            style={{ zIndex: 10002 }}
                        >
                            <ArrowRight size={24} />
                        </button>
                    )}

                    <Motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        className="bg-dark rounded-0 rounded-md-4 shadow-2xl overflow-hidden w-100 h-100 d-flex flex-column flex-lg-row"
                        style={{ maxWidth: '1400px', maxHeight: '90vh', border: '1px solid rgba(255,255,255,0.1)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Media Section */}
                        <div className="col-12 col-lg-8 bg-black d-flex align-items-center justify-content-center position-relative overflow-hidden" style={{ minHeight: '40vh' }}>
                            {/* Backdrop Glow */}
                            <div className="position-absolute top-50 start-50 translate-middle w-50 h-50 bg-primary opacity-20 blur-3xl rounded-circle pointer-events-none" style={{ zIndex: 0 }}></div>

                            {mediaType === 'video' ? (
                                <video
                                    src={liveItem.url || liveItem.image}
                                    className="w-100 h-100 object-fit-contain position-relative"
                                    style={{ zIndex: 1 }}
                                    controls
                                    autoPlay
                                    loop
                                    playsInline
                                />
                            ) : (liveItem.url || liveItem.image) ? (
                                <Motion.img
                                    initial={{ scale: 1.1, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.6 }}
                                    src={liveItem.url || liveItem.image}
                                    alt={liveItem.title}
                                    className="img-fluid w-100 h-100 object-fit-contain p-2 p-md-4 position-relative"
                                    style={{ zIndex: 1 }}
                                />
                            ) : (
                                <div className="d-flex flex-column align-items-center opacity-20 text-white">
                                    <ImageIcon size={64} />
                                    <p className="mt-2 fw-bold uppercase tracking-widest">No Reference Image</p>
                                </div>
                            )}

                            {/* Overlay Controls (Mobile) */}
                            <div className="position-absolute bottom-0 start-0 w-100 p-3 d-flex d-lg-none justify-content-between align-items-center glass rounded-0 border-0 border-top mt-auto" style={{ zIndex: 2 }}>
                                <span className="small fw-bold">{item.title}</span>
                                <div className="d-flex gap-2">
                                    <button onClick={onPrev} className="btn btn-sm glass text-white border-0"><ArrowLeft size={16} /></button>
                                    <button onClick={onNext} className="btn btn-sm glass text-white border-0"><ArrowRight size={16} /></button>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="col-12 col-lg-4 p-4 p-md-5 d-flex flex-column bg-dark" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', overflowY: 'auto' }}>
                            <Motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <span className="badge glass text-primary border-0 px-3 py-2 rounded-pill small fw-bold">
                                        <Tag size={12} className="me-1" /> {liveItem.category || 'Artwork'}
                                    </span>
                                    {liveItem.price && (
                                        <span className="badge glass text-accent border-0 px-3 py-2 rounded-pill small fw-bold">
                                            ₹{liveItem.price}
                                        </span>
                                    )}
                                </div>
                                <h2 className="display-6 fw-bold mb-3 font-heading text-gradient" style={{ letterSpacing: '-1px' }}>{liveItem.title || liveItem.name || 'Untitled Masterpiece'}</h2>
                                {liveItem.price && (
                                    <div className="d-flex align-items-center gap-3 text-muted small mb-4 pb-4 border-bottom border-white border-opacity-10">
                                        <div className="d-flex align-items-center gap-1">
                                            <User size={14} /> <span>By {users?.find(u => (u._id || u.id) === liveItem.creatorId)?.username || 'Admin'}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-1">
                                            <Calendar size={14} /> <span>{liveItem.createdAt ? new Date(liveItem.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}</span>
                                        </div>
                                    </div>
                                )}
                            </Motion.div>

                            <Motion.div
                                className="flex-grow-1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h5 className="small text-uppercase tracking-widest text-primary fw-bold mb-3">Description</h5>
                                <p className="text-muted mb-4 lead" style={{ fontSize: '1rem', lineHeight: '1.7' }}>
                                    {liveItem.description || "A professional handcrafted piece of art that blends technical skill with creative vision. Each detail is carefully considered to create a lasting impression and evoke deep emotional resonance."}
                                </p>

                                <div className="row g-3 mb-4">
                                    <div className="col-6">
                                        <div className="glass p-3 rounded-4 text-center">
                                            <div className="extra-small text-muted mb-1 text-uppercase text-truncate">Medium</div>
                                            <div className="small fw-bold text-truncate">{liveItem.medium || 'Custom'}</div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="glass p-3 rounded-4 text-center">
                                            <div className="extra-small text-muted mb-1 text-uppercase text-truncate">Status</div>
                                            <div className="small fw-bold text-success text-truncate">{liveItem.price ? 'Available' : 'Portfolio'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Comments Section - Hide for Orders/Tasks */}
                                {isInteractive && (
                                    <div className="mt-4 pt-4 border-top border-white border-opacity-10">
                                        <h5 className="small text-uppercase tracking-widest text-primary fw-bold mb-3 d-flex align-items-center gap-2">
                                            <MessageSquare size={16} /> Community Comments
                                        </h5>

                                        <div className="comments-list mb-4 d-flex flex-column gap-3" style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
                                            {liveItem.comments && liveItem.comments.length > 0 ? (
                                                liveItem.comments.map((comment, idx) => (
                                                    <div key={idx} className="glass p-3 rounded-3 border-0 bg-opacity-5 position-relative group">
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <span className="fw-bold extra-small text-primary">{comment.username}</span>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <span className="extra-small opacity-30">{new Date(comment.date).toLocaleDateString()}</span>
                                                                {isAdmin && (
                                                                    <button
                                                                        onClick={async () => {
                                                                            if (window.confirm("Delete this comment?")) {
                                                                                const deleteFn = liveItem.price ? deleteProductComment : deleteGalleryComment;
                                                                                await deleteFn(liveItem._id || liveItem.id, comment._id || comment.id);
                                                                            }
                                                                        }}
                                                                        className="btn btn-link p-0 text-danger border-0 opacity-0 group-hover-opacity-100 transition-all"
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="extra-small mb-0 text-white-50">{comment.text}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-4 opacity-30 small italic">No comments yet. Be the first!</div>
                                            )}
                                        </div>

                                        {/* Comment form */}
                                        <form onSubmit={handleCommentSubmit} className="position-relative mt-2">
                                            <input
                                                type="text"
                                                placeholder={user ? "Write a comment..." : "Login to comment"}
                                                disabled={!user || isSubmitting}
                                                className="form-control glass border-0 text-white extra-small py-3 ps-3 pe-5 rounded-pill"
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                disabled={!user || isSubmitting || !commentText.trim()}
                                                className="btn btn-primary position-absolute end-0 top-50 translate-middle-y me-1 p-2 rounded-circle border-0 d-flex align-items-center justify-content-center"
                                                style={{ width: '32px', height: '32px' }}
                                            >
                                                <Send size={14} />
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </Motion.div>

                            <Motion.div
                                className="d-flex flex-column gap-3 pt-4 mt-auto border-top border-white border-opacity-10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="d-flex gap-2 w-100">
                                    <button
                                        onClick={() => toggleLike(liveItem._id || liveItem.id)}
                                        className="btn glass flex-grow-1 py-3 px-4 rounded-3 text-white border-0 shadow-sm d-flex align-items-center justify-content-center gap-2 hover-scale"
                                        disabled={!isInteractive}
                                        style={{ opacity: isInteractive ? 1 : 0.5 }}
                                    >
                                        <Heart size={20} fill={isLiked ? "var(--primary)" : "none"} className={isLiked ? "text-primary" : ""} />
                                        <span className="fw-bold">{isInteractive ? (isLiked ? 'Liked' : 'Like') : 'View Only'}</span>
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="btn glass py-3 px-4 rounded-3 text-white border-0 shadow-sm d-flex align-items-center justify-content-center hover-scale"
                                    >
                                        <Share2 size={20} />
                                    </button>
                                </div>
                                {onOrder ? (
                                    <button
                                        onClick={() => onOrder(liveItem)}
                                        className="btn btn-primary w-100 py-3 rounded-3 fw-bold border-0 d-flex align-items-center justify-content-center gap-2 shadow-glow hover-scale"
                                    >
                                        <ShoppingBag size={20} /> Request Order
                                    </button>
                                ) : (
                                    onInquire && (
                                        <button
                                            onClick={() => onInquire(liveItem)}
                                            className="btn btn-primary w-100 py-3 rounded-3 fw-bold border-0 d-flex align-items-center justify-content-center gap-2 shadow-glow hover-scale"
                                        >
                                            <Send size={20} /> Send Inquiry
                                        </button>
                                    )
                                )}
                            </Motion.div>
                        </div>
                    </Motion.div>
                </Motion.div>
            )}
        </AnimatePresence>
    );
};

export default ItemPreview;
