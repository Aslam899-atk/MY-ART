import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import LazyImage from '../components/LazyImage';
import { Heart, Search, Share2, ZoomIn, X, Play } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
    const { galleryItems, toggleGalleryLike, likedIds } = useContext(AppContext);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleShare = async (item) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: item.title || 'Art Void Gallery',
                    text: 'Check out this amazing artwork on Art Void!',
                    url: window.location.href
                });
            } catch {
                console.log('Share canceled');
            }
        } else {
            alert('Share URL copied to clipboard!');
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
            {/* Header with Search */}
            <header className="mb-5 text-center position-relative">
                <h1 className="display-4 fw-bold mb-3">The <span style={{ color: 'var(--primary)' }}>Gallery</span></h1>
                <p className="mb-4" style={{ color: '#e2e8f0' }}>Explore our exclusive portfolio of real paintings, calligraphy, and sketches.</p>


            </header>

            {/* Gallery Grid */}
            <div className="row g-4">
                {galleryItems.map((item, index) => (
                    <div key={item.id} className="col-12 col-md-6 col-lg-4">
                        <Motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass border-0 rounded-4 overflow-hidden position-relative group"
                            style={{ height: '350px' }}
                        >
                            {/* Media (Image/Video) */}
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
                                    className="w-100 h-100 transition-transform duration-500"
                                    onClick={() => setSelectedItem(item)}
                                    style={{ cursor: 'pointer' }}
                                />
                            )}

                            {/* Overlays & Actions */}
                            <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-to-t from-black to-transparent d-flex justify-content-between align-items-end"
                                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                                <div>
                                    {/* Title hidden as requested */}
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        onClick={() => toggleGalleryLike(item.id)}
                                        className="btn p-2 rounded-circle hover-scale text-white border-0"
                                        style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)' }}
                                    >
                                        <Heart size={20} fill={likedIds.includes(item.id) ? "white" : "none"} className={likedIds.includes(item.id) ? "text-white" : ""} />
                                    </button>
                                    <button
                                        onClick={() => handleShare(item)}
                                        className="btn p-2 rounded-circle hover-scale text-white border-0"
                                        style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)' }}
                                    >
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Center Play Icon for Video */}
                            {item.type === 'video' && (
                                <div className="position-absolute top-50 start-50 translate-middle pointer-events-none">
                                    <div className="bg-white bg-opacity-25 rounded-circle p-3 backdrop-blur-sm">
                                        <Play fill="white" className="text-white" size={24} />
                                    </div>
                                </div>
                            )}
                        </Motion.div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedItem && selectedItem.type !== 'video' && (
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed-top w-100 h-100 d-flex align-items-center justify-content-center p-4"
                        style={{ background: 'rgba(0,0,0,0.95)', zIndex: 3000 }}
                        onClick={() => setSelectedItem(null)}
                    >
                        <button className="position-absolute top-0 end-0 m-4 btn text-white border-0 p-2" onClick={() => setSelectedItem(null)}>
                            <X size={32} />
                        </button>
                        <Motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            src={selectedItem.url}
                            alt={selectedItem.title}
                            className="img-fluid rounded-3 shadow-lg"
                            style={{ maxHeight: '90vh', maxWidth: '100%' }}
                            onClick={e => e.stopPropagation()}
                        />
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
