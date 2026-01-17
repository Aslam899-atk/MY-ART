import React, { useState, useContext, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Globe, Award, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

import { AppContext } from '../context/AppContext';
import './Home.css';

const Home = () => {
    const { galleryItems, user, loginWithGoogle, isLoadingAuth } = useContext(AppContext);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const handleLoad = () => setIsLoaded(true);
        if (document.readyState === 'complete') {
            setIsLoaded(true);
        } else {
            window.addEventListener('load', handleLoad);
        }
        return () => window.removeEventListener('load', handleLoad);
    }, []);

    React.useEffect(() => {
        if (isLoadingAuth) return;
        if (!user) {
            const isGuest = sessionStorage.getItem('art_guest_mode');
            if (!isGuest) {
                const timer = setTimeout(() => setShowLoginModal(true), 1200);
                return () => clearTimeout(timer);
            }
        } else {
            setShowLoginModal(false);
        }
    }, [user, isLoadingAuth]);

    const handleGuestAccess = () => {
        setShowLoginModal(false);
        sessionStorage.setItem('art_guest_mode', 'true');
    };

    const services = [
        {
            title: "Pencil Art",
            desc: "Hyper-realistic portraits and detailed sketches capturing every fine detail with precision.",
            icon: <Sparkles className="text-primary" />
        },
        {
            title: "Oil Painting",
            desc: "Traditional oil on canvas masterpieces with rich textures and vibrant color palettes.",
            icon: <Award className="text-primary" />
        },
        {
            title: "Custom Calligraphy",
            desc: "Elegant hand-lettered artworks for certificates, weddings, and personalized gifts.",
            icon: <Star className="text-primary" />
        }
    ];

    const testimonials = [
        {
            name: "Rahul Verma",
            role: "Art Collector",
            content: "The level of detail in the pencil sketch I ordered was beyond my expectations. A true masterpiece.",
            rating: 5
        },
        {
            name: "Sarah Jenkins",
            role: "Interior Designer",
            content: "Art Void's oil paintings have transformed my clients' spaces. Timeless and professional work.",
            rating: 5
        },
        {
            name: "Dr. Anjali Nair",
            role: "Gift Buyer",
            content: "Ordered a calligraphy piece for an anniversary. The craftsmanship and delivery were flawless.",
            rating: 5
        }
    ];

    return (
        <>
            {!isLoaded && (
                <div className="preloader">
                    <div className="spinner"></div>
                </div>
            )}
            <div className="home-wrapper">
                {/* HERO SECTION */}
                <section className="hero-section position-relative vh-100 d-flex align-items-center">
                    <div className="position-absolute top-0 start-0 w-100 h-100 z-n1">
                        <img
                            src={`${import.meta.env.BASE_URL}banner.png`}
                            alt="Art Banner"
                            className="w-100 h-100 object-fit-cover opacity-50"
                        />
                        <div className="position-absolute top-0 start-0 w-100 h-100"
                            style={{ background: 'linear-gradient(to bottom, rgba(7, 11, 20, 0.4), var(--bg-dark))' }}>
                        </div>
                    </div>

                    <div className="container position-relative z-1">
                        <div className="row">
                            <div className="col-lg-8">
                                <Motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-4"
                                    style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 'bold' }}
                                >
                                    <ShieldCheck size={16} /> ELITE ARTISTRY STUDIO
                                </Motion.div>
                                <Motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="display-1 fw-bold mb-4"
                                >
                                    Crafting <span className="text-gradient">Timeless</span> <br />
                                    <span className="font-serif italic">Masterpieces.</span>
                                </Motion.h1>
                                <Motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="lead text-muted mb-5"
                                    style={{ maxWidth: '600px', fontSize: '1.25rem' }}
                                >
                                    We bridge the gap between imagination and reality through elite-level handcrafted art.
                                    Professional services for collectors and enthusiasts worldwide.
                                </Motion.p>
                                <Motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="d-flex gap-3"
                                >
                                    <Link to="/shop" className="btn btn-primary btn-lg rounded-pill px-5 py-3 d-flex align-items-center gap-2">
                                        View Collections <ArrowRight size={20} />
                                    </Link>
                                    <Link to="/contact" className="btn glass text-white btn-lg rounded-pill px-5 py-3">
                                        Commission Art
                                    </Link>
                                </Motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TRUST & STATS */}
                <section className="py-5 bg-glow">
                    <div className="container">
                        <div className="row g-4 text-center">
                            {[
                                { label: 'Trusted Clients', val: '500+' },
                                { label: 'Artworks Delivered', val: '1.2k+' },
                                { label: 'Global Shipping', val: '25+' },
                                { label: 'Customer Rating', val: '4.9/5' }
                            ].map((stat, i) => (
                                <div key={i} className="col-6 col-md-3">
                                    <h3 className="h1 fw-bold text-gradient mb-1">{stat.val}</h3>
                                    <p className="text-muted small text-uppercase fw-bold m-0">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SERVICES SECTION */}
                <section className="py-5 bg-dark">
                    <div className="container py-5">
                        <div className="text-center mb-5">
                            <h2 className="display-4 fw-bold mb-3">Our <span className="text-primary">Expertise</span></h2>
                            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                                Every stroke is intentional. Every piece is unique. We specialize in traditional techniques refined for the modern world.
                            </p>
                        </div>
                        <div className="row g-4">
                            {services.map((s, i) => (
                                <div key={i} className="col-md-4">
                                    <Motion.div
                                        whileHover={{ y: -10 }}
                                        className="glass p-5 h-100 d-flex flex-column align-items-center text-center gap-4 transition-all"
                                    >
                                        <div className="p-3 rounded-4" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                                            {React.cloneElement(s.icon, { size: 40 })}
                                        </div>
                                        <h3 className="h3 fw-bold m-0">{s.title}</h3>
                                        <p className="text-muted m-0">{s.desc}</p>
                                    </Motion.div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* RECENT WORK PREVIEW */}
                <section className="py-5">
                    <div className="container py-5">
                        <div className="d-flex justify-content-between align-items-end mb-5">
                            <div>
                                <h2 className="display-4 fw-bold m-0 text-gradient">The Gallery</h2>
                                <p className="text-muted m-0">A curated selection of our most recent works.</p>
                            </div>
                            <Link to="/gallery" className="text-primary fw-bold text-decoration-none">
                                View Full Portfolio &rarr;
                            </Link>
                        </div>
                        <div className="row g-3">
                            {galleryItems && galleryItems.slice(0, 5).map((item, index) => (
                                <div key={item.id} className="col-6 col-md-4 col-lg-custom-5">
                                    <Motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        className="card glass border-0 h-100 overflow-hidden"
                                        style={{ minHeight: '300px' }}
                                    >
                                        <img src={item.url} alt={item.title} className="w-100 h-100 object-fit-cover hover-zoom" />
                                    </Motion.div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* TESTIMONIALS */}
                <section className="py-5 bg-glow">
                    <div className="container py-5">
                        <h2 className="display-4 fw-bold text-center mb-5 font-serif">What Clients Say</h2>
                        <div className="row g-4">
                            {testimonials.map((t, i) => (
                                <div key={i} className="col-md-4">
                                    <div className="glass p-4 h-100">
                                        <Quote className="text-primary mb-3" size={30} />
                                        <p className="text-muted font-italic mb-4" style={{ fontStyle: 'italic' }}>"{t.content}"</p>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="flex-grow-1">
                                                <h5 className="fw-bold mb-0">{t.name}</h5>
                                                <p className="small text-muted mb-0">{t.role}</p>
                                            </div>
                                            <div className="d-flex gap-1 text-warning">
                                                {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* TRUST SIGNALS */}
                <section className="py-5 border-top border-secondary border-opacity-10">
                    <div className="container py-4">
                        <div className="row g-5 align-items-center">
                            <div className="col-md-3 d-flex align-items-center gap-3">
                                <ShieldCheck className="text-primary" size={40} />
                                <div><h6 className="fw-bold mb-1">Authentic Art</h6><p className="small text-muted mb-0">100% Hand-drawn</p></div>
                            </div>
                            <div className="col-md-3 d-flex align-items-center gap-3">
                                <Globe className="text-primary" size={40} />
                                <div><h6 className="fw-bold mb-1">Global Delivery</h6><p className="small text-muted mb-0">Safe Worldwide Shipping</p></div>
                            </div>
                            <div className="col-md-3 d-flex align-items-center gap-3">
                                <Award className="text-primary" size={40} />
                                <div><h6 className="fw-bold mb-1">Premium Quality</h6><p className="small text-muted mb-0">Highest Grade Materials</p></div>
                            </div>
                            <div className="col-md-3 d-flex align-items-center gap-3">
                                <ShieldCheck className="text-primary" size={40} />
                                <div><h6 className="fw-bold mb-1">Secure Ordering</h6><p className="small text-muted mb-0">Verified Transactions</p></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* REDESIGNED LOGIN MODAL */}
                {showLoginModal && (
                    <div className="login-overlay d-flex align-items-center justify-content-center">
                        <Motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass p-5 shadow-lg text-center"
                            style={{ maxWidth: '450px', border: '1px solid var(--glass-border)' }}
                        >
                            <h2 className="h2 fw-bold mb-2">Join Art Void</h2>
                            <p className="text-muted mb-5">Access exclusive collections and save your favorites.</p>

                            <button
                                onClick={async () => {
                                    const res = await loginWithGoogle();
                                    if (res.success) setShowLoginModal(false);
                                }}
                                className="btn btn-outline-light w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-3 mb-4"
                            >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </button>

                            <button onClick={handleGuestAccess} className="btn btn-link text-muted small text-decoration-none">
                                Explore as Guest
                            </button>
                        </Motion.div>
                    </div>
                )}
            </div>

            <style>{`
                .login-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.9);
                    backdrop-filter: blur(8px);
                    z-index: 99999;
                    padding: 20px;
                }
                .hero-section {
                    padding-top: 80px;
                }
                @media (min-width: 992px) {
                    .col-lg-custom-5 {
                        flex: 0 0 auto;
                        width: 20%;
                    }
                }
            `}</style>
        </>
    );
};

export default Home;

