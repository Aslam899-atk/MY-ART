import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();

    // Hide footer on admin panel to preserve dashboard layout
    if (location.pathname.startsWith('/admin')) return null;

    return (
        <footer className="py-5 mt-auto border-top" style={{ borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'var(--bg-dark)' }}>
            <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-muted small">
                <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-white tracking-widest text-uppercase" style={{ fontSize: '0.8rem' }}>Art Void</span>
                    <span className="opacity-50">© {new Date().getFullYear()}</span>
                </div>

                <div className="d-flex gap-4">
                    <Link to="/gallery" className="text-decoration-none hover-text-white transition-all">Gallery</Link>
                    <Link to="/shop" className="text-decoration-none hover-text-white transition-all">Shop</Link>
                    <Link to="/contact" className="text-decoration-none hover-text-white transition-all">Contact</Link>
                    <Link to="/login" className="text-decoration-none hover-text-white transition-all">Login</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
