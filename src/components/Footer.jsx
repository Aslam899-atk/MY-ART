import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Send, Mail, Palette, ChevronUp } from 'lucide-react';

const Footer = () => {
    const location = useLocation();

    // Hide footer on admin panel to preserve dashboard layout
    if (location.pathname.startsWith('/admin')) return null;

    return (
        <footer className="site-footer position-relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(10,10,20,1) 100%)' }}>
            {/* Decorative gradient orbs */}
            <div className="position-absolute" style={{ top: '-10%', left: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }}></div>
            <div className="position-absolute" style={{ bottom: '-10%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }}></div>

            <div className="container position-relative" style={{ zIndex: 1 }}>
                <div className="row g-5 mb-5 text-center text-md-start py-5">
                    {/* Brand Section */}
                    <div className="col-lg-4">
                        <div className="footer-brand mb-4">
                            <div className="d-flex align-items-center gap-3 justify-content-center justify-content-md-start mb-3">
                                <div className="glass rounded-3 p-2">
                                    <Palette size={24} className="text-primary" />
                                </div>
                                <h2 className="text-gradient mb-0 fw-bold" style={{ fontSize: '1.75rem' }}>ART VOID</h2>
                            </div>
                            <p className="text-muted pe-lg-4 mb-4" style={{ lineHeight: '1.7' }}>
                                Exploring digital art, minimal design and creative voids where imagination begins. Every piece is a story of passion and precision.
                            </p>
                            <div className="d-flex gap-3 justify-content-center justify-content-md-start">
                                <a href="https://www.instagram.com/aslamtk35" target="_blank" rel="noopener noreferrer"
                                    className="btn glass rounded-circle p-3 text-white border-0 hover-scale transition-all"
                                    aria-label="Instagram"
                                    style={{ width: '48px', height: '48px' }}>
                                    <Instagram size={20} />
                                </a>
                                <a href="https://t.me/aslamtk35" target="_blank" rel="noopener noreferrer"
                                    className="btn glass rounded-circle p-3 text-white border-0 hover-scale transition-all"
                                    aria-label="Telegram"
                                    style={{ width: '48px', height: '48px' }}>
                                    <Send size={20} />
                                </a>
                                <a href="mailto:studio@artvoid.com"
                                    className="btn glass rounded-circle p-3 text-white border-0 hover-scale transition-all"
                                    aria-label="Email"
                                    style={{ width: '48px', height: '48px' }}>
                                    <Mail size={20} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-md-6 col-lg-2">
                        <div className="footer-links">
                            <h4 className="small fw-bold text-uppercase tracking-widest text-primary mb-4" style={{ letterSpacing: '2px' }}>Explore</h4>
                            <Link className="d-block mb-3 text-decoration-none text-muted hover-text-primary transition-all small" to="/">Home</Link>
                            <Link className="d-block mb-3 text-decoration-none text-muted hover-text-primary transition-all small" to="/gallery">Gallery</Link>
                            <Link className="d-block mb-3 text-decoration-none text-muted hover-text-primary transition-all small" to="/shop">Shop</Link>
                            <Link className="d-block mb-3 text-decoration-none text-muted hover-text-primary transition-all small" to="/contact">Commission</Link>
                        </div>
                    </div>

                    {/* Artist Program */}
                    <div className="col-md-6 col-lg-3">
                        <div className="footer-links">
                            <h4 className="small fw-bold text-uppercase tracking-widest text-primary mb-4" style={{ letterSpacing: '2px' }}>Emblos Program</h4>
                            <p className="extra-small text-muted mb-3" style={{ lineHeight: '1.6' }}>
                                Join our <span className="text-primary fw-bold">elite artist community</span> and showcase your work to a global audience.
                            </p>
                            <Link className="d-block mb-3 text-decoration-none text-muted hover-text-primary transition-all small" to="/request-access">
                                <span className="me-2">→</span>Apply Now
                            </Link>
                            <Link className="d-block mb-3 text-decoration-none text-muted hover-text-primary transition-all small" to="/dashboard">
                                <span className="me-2">→</span>Artist Portal
                            </Link>
                        </div>
                    </div>

                    {/* Support */}
                    <div className="col-md-6 col-lg-3">
                        <div className="footer-links">
                            <h4 className="small fw-bold text-uppercase tracking-widest text-primary mb-4" style={{ letterSpacing: '2px' }}>Support</h4>
                            <Link className="d-block mb-3 text-decoration-none text-muted hover-text-primary transition-all small" to="/orders">Track Orders</Link>
                            <Link className="d-block mb-3 text-decoration-none text-muted hover-text-primary transition-all small" to="/contact">Contact Us</Link>
                            <a href="mailto:studio@artvoid.com" className="d-block mb-3 text-decoration-none text-muted hover-text-primary transition-all small">
                                studio@artvoid.com
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom pt-4 pb-4 border-top border-secondary border-opacity-10 position-relative">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            <p className="small text-muted mb-0">
                                © {new Date().getFullYear()} <span className="text-primary fw-bold">ART VOID</span> • Crafted with passion
                            </p>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="btn btn-primary rounded-pill px-4 py-2 border-0 shadow-glow hover-scale transition-all d-inline-flex align-items-center gap-2"
                                title="Back to top"
                            >
                                <ChevronUp size={16} />
                                <span className="small fw-bold">Back to Top</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
