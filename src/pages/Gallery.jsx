import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import LazyImage from '../components/LazyImage';
import { Heart, Search, Share2, ZoomIn, X, Play, Filter } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
    const { galleryItems, toggleGalleryLike, likedIds } = useContext(AppContext);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filter, setFilter] = useState('All');

    const categories = ['All', 'Pencil Art', 'Calligraphy', 'Ink Art'];

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
                    {filteredItems.map((item, index) => (
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
                                        onMouseOver={e => e.target.play()}
                                        onMouseOut={e => {
                                            e.target.pause();
                                            e.target.currentTime = 0;
                                        }}
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
                                    <div className="position-absolute top-50 start-50 translate-middle pointer-events-none">
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

            {/* Lightbox */}
            <AnimatePresence>
                {selectedItem && selectedItem.type !== 'video' && (
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed-top w-100 h-100 d-flex align-items-center justify-content-center p-4 backdrop-blur-md"
                        style={{ background: 'rgba(0,0,0,0.95)', zIndex: 3000 }}
                        onClick={() => setSelectedItem(null)}
                    >
                        <button className="position-absolute top-0 end-0 m-4 btn text-white border-0 p-2 glass" onClick={() => setSelectedItem(null)}>
                            <X size={32} />
                        </button>
                        <Motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-dark p-2 rounded-4 shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <img
                                src={selectedItem.url}
                                alt={selectedItem.title}
                                className="img-fluid rounded-3"
                                style={{ maxHeight: '80vh', maxWidth: '100%' }}
                            />
                            <div className="p-4 text-center">
                                <h3 className="h4 fw-bold">{selectedItem.title}</h3>
                                <p className="text-muted mb-0">{selectedItem.description || 'Professional Handcrafted Artwork'}</p>
                            </div>
                        </Motion.div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
