import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();

    // Hide footer on admin panel to preserve dashboard layout
    if (location.pathname.startsWith('/admin')) return null;

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="row g-5 mb-5 text-center text-md-start">
                    <div className="col-lg-5">
                        <div className="footer-brand">
                            <h2 className="text-gradient">ART VOID</h2>
                            <p className="text-muted pe-lg-5">Exploring digital art, minimal design and creative voids where imagination begins. Every piece is a story of passion and precision.</p>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3">
                        <div className="footer-links">
                            <h4 className="small fw-bold text-uppercase tracking-widest text-primary mb-4">Navigate</h4>
                            <Link className="d-block mb-2 text-decoration-none text-muted hover-white" to="/">Home</Link>
                            <Link className="d-block mb-2 text-decoration-none text-muted hover-white" to="/gallery">Gallery</Link>
                            <Link className="d-block mb-2 text-decoration-none text-muted hover-white" to="/shop">Shop</Link>
                            <Link className="d-block mb-2 text-decoration-none text-muted hover-white" to="/contact">Contact</Link>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-4">
                        <div className="footer-social">
                            <h4 className="small fw-bold text-uppercase tracking-widest text-primary mb-4">Engagement</h4>
                            <p className="small text-muted mb-4 text-center text-md-start">Join our creative journey and stay updated with my latest works and experiments.</p>
                            <div className="d-flex gap-3 justify-content-center justify-content-md-start">
                                <a href="https://www.instagram.com/aslamtk35" target="_blank" rel="noopener noreferrer" className="btn glass rounded-circle p-2 text-white border-0"><span className="small">IG</span></a>
                                <a href="https://t.me/aslamtk35" target="_blank" rel="noopener noreferrer" className="btn glass rounded-circle p-2 text-white border-0"><span className="small">TG</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom pt-5 border-top border-secondary border-opacity-10 text-center">
                    <p className="small text-muted mb-0">
                        © {new Date().getFullYear()} ART VOID • Professional Portfolio • Designed with passion
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
