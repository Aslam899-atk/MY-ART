import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Home = () => {
    const { products } = useContext(AppContext);
    return (
        <div className="home-wrapper position-relative overflow-hidden w-100">
            {/* Video Banner Background */}
            <div className="position-absolute top-0 start-0 w-100 vh-100 z-n1 overflow-hidden">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-100 h-100 object-fit-cover"
                    style={{ opacity: 0.5 }}
                >
                    <source src={`${import.meta.env.BASE_URL}banner.mp4`} type="video/mp4" />
                </video>
                <div className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.3), var(--bg-dark))' }}>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '12rem', minHeight: '100vh' }}>
                <section className="d-flex flex-column align-items-center text-center gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm"
                        style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.8rem', fontWeight: 'bold' }}
                    >
                        <Sparkles size={14} />
                        NEW COLLECTION DROP 2024
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="display-1 fw-bold mb-0"
                        style={{ lineHeight: 1.1 }}
                    >
                        Collect <span style={{ color: 'var(--primary)' }}>Ethereal</span> <br /> Digital Artworks
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="lead mx-auto text-muted"
                        style={{ maxWidth: '600px' }}
                    >
                        Discover curated unique paintings and digital assets from emerging artists worldwide.
                        Limited editions with digital certificates of authenticity.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="d-flex gap-3 justify-content-center"
                    >
                        <Link to="/shop" className="btn btn-primary d-flex align-items-center gap-2 px-4 py-3 border-0">
                            Explore Gallery <ArrowRight size={18} />
                        </Link>
                        <button className="btn glass border-1 text-white px-4 py-3">
                            Learn More
                        </button>
                    </motion.div>
                </section>
            </div>

            <section className="container py-5 mt-5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3"
                >
                    <div>
                        <h2 className="display-4 fw-bold">Trending <span style={{ color: 'var(--primary)' }}>Artworks</span></h2>
                        <p className="text-muted mb-0">The most loved pieces in our current collection.</p>
                    </div>
                    <Link to="/shop" className="text-primary fw-bold text-decoration-none hover-underline-animation">
                        View Full Gallery &rarr;
                    </Link>
                </motion.div>

                <div className="row g-4 justify-content-center">
                    {products && [...products].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 3).map((product, index) => (
                        <div key={product.id} className="col-12 col-md-6 col-lg-4">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="card glass border-0 h-100 overflow-hidden text-white"
                            >
                                <div className="overflow-hidden position-relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="card-img-top w-100"
                                        style={{ height: '300px', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                    />
                                    <div className="card-img-overlay d-flex align-items-end p-0 opacity-0 hover-overlay transition-all" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                                        <div className="p-4 w-100">
                                            <button className="btn btn-primary w-100 rounded-pill">View Details</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body p-4 d-flex justify-content-between align-items-center mt-auto">
                                    <div>
                                        <h3 className="h5 mb-1 card-title fw-bold">{product.name}</h3>
                                        <p className="card-text text-primary fw-bold mb-0">${product.price}</p>
                                    </div>
                                    <div className="d-flex align-items-center gap-1 bg-dark bg-opacity-50 px-3 py-1 rounded-pill">
                                        <Heart size={16} fill="var(--accent)" className="text-danger" />
                                        <span className="small fw-bold">{product.likes || 0}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
