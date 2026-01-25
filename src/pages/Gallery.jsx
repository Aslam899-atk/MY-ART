import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import LazyImage from '../components/LazyImage';
import ItemPreview from '../components/ItemPreview';
import { Heart, Search, Share2, ZoomIn, X, Play, Filter, MessageSquare, Send } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
    const { galleryItems, toggleGalleryLike, likedIds, addMessage, user, addGalleryComment } = useContext(AppContext);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filter, setFilter] = useState('All');
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = ['All', 'Painting', 'Pencil Drawing', 'Calligraphy', 'Other'];

    const filteredItems = filter === 'All'
        ? galleryItems
        : galleryItems.filter(item => item.category === filter);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !selectedItem) return;
        setIsSubmitting(true);
        const res = await addGalleryComment(selectedItem._id || selectedItem.id, commentText);
        if (res?.success) {
            setCommentText('');
            // Refresh local selected item to show the new comment immediately
            const updatedItem = galleryItems.find(i => (i._id || i.id) === (selectedItem._id || selectedItem.id));
            if (updatedItem) setSelectedItem(updatedItem);
        }
        setIsSubmitting(false);
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
                                        style={{ objectFit: 'cover' }}
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
                                            onClick={() => { setSelectedItem(item); setShowComments(true); }}
                                            className="btn p-2 rounded-circle glass text-white border-0 shadow-sm"
                                        >
                                            <MessageSquare size={18} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({ title: item.title, url: window.location.href });
                                                } else {
                                                    alert('Link copied!');
                                                    navigator.clipboard.writeText(window.location.href);
                                                }
                                            }}
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

            {/* Simple Comment Modal */}
            <AnimatePresence>
                {showComments && selectedItem && (
                    <div className="d-flex align-items-center justify-content-center px-3 py-4 position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.9)', zIndex: 11000, backdropFilter: 'blur(10px)' }}>
                        <Motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass p-4 p-md-5 position-relative w-100 my-auto"
                            style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <button
                                onClick={() => { setShowComments(false); setSelectedItem(null); }}
                                className="position-absolute top-0 end-0 m-4 btn text-muted p-0 border-0"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-4 text-center">
                                <h2 className="h4 fw-bold mb-1">Community <span className="text-primary">Talk</span></h2>
                                <p className="text-muted small">on {selectedItem.title}</p>
                            </div>

                            <div className="comments-list mb-4 d-flex flex-column gap-3" style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
                                {selectedItem.comments && selectedItem.comments.length > 0 ? (
                                    selectedItem.comments.map((comment, idx) => (
                                        <div key={idx} className="glass p-3 rounded-3 border-0 bg-opacity-5">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="fw-bold extra-small text-primary">{comment.username}</span>
                                                <span className="extra-small opacity-30">{new Date(comment.date).toLocaleDateString()}</span>
                                            </div>
                                            <p className="extra-small mb-0 text-white-50">{comment.text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-5 opacity-30 small italic">No comments yet. Be the first!</div>
                                )}
                            </div>

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
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
