import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

import { AppContext } from '../context/AppContext';

const Home = () => {
    const { galleryItems, user, loginUser, loginWithGoogle } = useContext(AppContext);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [authError, setAuthError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Show login modal on mount if not logged in
    React.useEffect(() => {
        if (!user) {
            // Check session storage to avoid annoying popup on every refresh if they explicitly chose guest?
            // User requested "frist open", implies session.
            const isGuest = sessionStorage.getItem('art_guest_mode');
            if (!isGuest) {
                const timer = setTimeout(() => setShowLoginModal(true), 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [user]);

    const handleHomeLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setAuthError('');
        const res = await loginUser(loginForm.username, loginForm.password);
        setIsLoggingIn(false);
        if (res.success) {
            setShowLoginModal(false);
        } else {
            setAuthError(res.message);
        }
    };

    const handleGuestAccess = () => {
        setShowLoginModal(false);
        sessionStorage.setItem('art_guest_mode', 'true');
    };

    return (
        <div className="home-wrapper position-relative overflow-hidden w-100">
            {/* Banner Background */}
            <div className="position-absolute top-0 start-0 w-100 vh-100 z-n1 overflow-hidden">
                <img
                    src={`${import.meta.env.BASE_URL}banner.png`}
                    alt="Art Banner"
                    className="w-100 h-100 object-fit-cover"
                />
                <div className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.5), var(--bg-dark))' }}>
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
                        Real <span style={{ color: 'var(--primary)' }}>Paintings,</span> <br /> Calligraphy & Pencil Art
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="lead mx-auto text-muted"
                        style={{ maxWidth: '600px' }}
                    >
                        Experience the authentic touch of handmade art.
                        From detailed pencil drawings to masterful calligraphy and oil paintings.
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

            <section className="container-fluid px-4 py-5 mt-5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 px-lg-5 gap-3"
                >
                    <div>
                        <h2 className="display-4 fw-bold">Recent <span style={{ color: 'var(--primary)' }}>Masterpieces</span></h2>
                        <p className="text-muted mb-0">A glimpse into our latest creations.</p>
                    </div>
                    <Link to="/galleryView" className="text-primary fw-bold text-decoration-none hover-underline-animation">
                        View Full Gallery &rarr;
                    </Link>
                </motion.div>

                {/* 5-Column Grid Layout (PC: 5, Tab: 3, Phone: 2) */}
                <div className="row g-3 px-lg-5">
                    {galleryItems && galleryItems.slice(0, 5).map((item, index) => (
                        <div key={item.id} className="col-6 col-md-4 col-lg-custom-5">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="card glass border-0 h-100 overflow-hidden text-white"
                                style={{ height: '300px' }}
                            >
                                {item.type === 'video' ? (
                                    <video src={item.url} className="w-100 h-100 object-fit-cover" muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                                ) : (
                                    <img src={item.url} alt={item.title} className="w-100 h-100 object-fit-cover transition-transform duration-500 hover-zoom" />
                                )}
                            </motion.div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-5">
                    <Link to="/gallery" className="btn btn-outline-light px-5 py-3 rounded-pill">
                        View More to Gallery
                    </Link>
                </div>

                {/* Introduction Text */}
                <div className="container mt-5 pt-5 text-center">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h3 className="h2 fw-bold mb-4">Professional Artistry</h3>
                            <p className="text-muted lh-lg">
                                Welcome to Art Void, a sanctuary for authentic artistic expression.
                                We specialize in real, tangible art forms including detailed pencil sketches,
                                traditional oil paintings, and intricate calligraphy. Each piece is crafted
                                with passion and dedication, bringing imagination to life on canvas and paper.
                                Whether you are looking for a portrait, a landscape, or a custom commission,
                                we are dedicated to providing masterpieces that resonate with your soul.
                            </p>
                        </div>
                    </div>
                </div>

                <style>{`
                    @media (min-width: 992px) {
                        .col-lg-custom-5 {
                            flex: 0 0 auto;
                            width: 20%;
                        }
                    }
                `}</style>
            </section>

            {/* LOGIN POPUP MODAL */}
            {showLoginModal && (
                <div className="d-flex align-items-center justify-content-center px-3 position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.85)', zIndex: 9999 }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass p-5 rounded-5 shadow-lg position-relative w-100"
                        style={{ maxWidth: '400px', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                    >
                        <div className="text-center mb-4">
                            <h2 className="h3 fw-bold mb-1">Welcome to Art Void</h2>
                            <p className="text-muted small">Sign in to save your favorite artworks.</p>
                        </div>

                        {authError && <div className="alert alert-danger py-2 small">{authError}</div>}

                        {/* Google Login - PRIMARY OPTION */}
                        <div className="d-flex flex-column gap-2 mb-3">
                            <button
                                onClick={async () => {
                                    const res = await loginWithGoogle();
                                    if (res.success) setShowLoginModal(false);
                                }}
                                className="btn btn-outline-light w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </button>
                        </div>

                        <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 text-center">
                            <button onClick={handleGuestAccess} className="btn btn-link text-decoration-none text-muted small">
                                Continue without signing in
                            </button>
                        </div>


                    </motion.div>
                </div>
            )}
        </div>
    );
};
export default Home;
