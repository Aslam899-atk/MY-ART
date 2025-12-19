import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Home = () => {
    const { products } = useContext(AppContext);
    return (
        <div className="home-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Video Banner Background */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
                zIndex: -1, overflow: 'hidden'
            }}>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
                >
                    <source src="/banner.mp4" type="video/mp4" />
                </video>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.3), var(--bg-dark))'
                }}></div>
            </div>

            <div className="container" style={{ paddingTop: '12rem', minHeight: '100vh' }}>
                <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '99px', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.8rem', fontWeight: 'bold' }}
                    >
                        <Sparkles size={14} />
                        NEW COLLECTION DROP 2024
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', lineHeight: 1.1 }}
                    >
                        Collect <span style={{ color: 'var(--primary)' }}>Ethereal</span> <br /> Digital Artworks
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{ maxWidth: '600px', color: 'var(--text-muted)', fontSize: '1.1rem' }}
                    >
                        Discover curated unique paintings and digital assets from emerging artists worldwide.
                        Limited editions with digital certificates of authenticity.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        style={{ display: 'flex', gap: '1rem' }}
                    >
                        <Link to="/shop" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                            Explore Gallery <ArrowRight size={18} />
                        </Link>
                        <button className="glass" style={{ padding: '0.75rem 1.5rem', color: 'white' }}>
                            Learn More
                        </button>
                    </motion.div>
                </section>
            </div>

            <section style={{ marginTop: '8rem', paddingBottom: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem' }}>Trending <span style={{ color: 'var(--primary)' }}>Artworks</span></h2>
                        <p style={{ color: 'var(--text-muted)' }}>The most loved pieces in our current collection.</p>
                    </div>
                    <Link to="/shop" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>View Full Gallery &rarr;</Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(280px, 1fr))', gap: '2rem', justifyContent: 'center', margin: '0 auto' }}>
                    {products && [...products].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 3).map(product => (
                        <div key={product.id} className="glass animate-fade-in" style={{ overflow: 'hidden' }}>
                            <div style={{ height: '200px', background: `url(${product.image}) center/cover` }}></div>
                            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem' }}>{product.name}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>${product.price}</p>
                                </div>
                                <div style={{ color: 'var(--accent)', fontWeight: 'bold' }}>&hearts; {product.likes || 0}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
