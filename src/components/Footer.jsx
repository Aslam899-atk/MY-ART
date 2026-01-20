import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();

    // Hide footer on admin panel to preserve dashboard layout
    if (location.pathname.startsWith('/admin')) return null;

    return (
        <footer className="site-footer">
            <div className="footer-container">

                <div className="footer-brand">
                    <h2>ART VOID</h2>
                    <p>Exploring digital art, minimal design and creative voids where imagination begins.</p>
                </div>

                <div className="footer-links">
                    <h4>Navigate</h4>
                    <Link to="/">Home</Link>
                    <Link to="/gallery">Gallery</Link>
                    <Link to="/shop">Shop</Link>
                    <Link to="/contact">Contact</Link>
                </div>

                <div className="footer-social">
                    <h4>Follow</h4>
                    <a href="https://www.instagram.com/aslamtk35" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <a href="https://t.me/aslamtk35" target="_blank" rel="noopener noreferrer">Telegram</a>
                </div>

            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} ART VOID • Designed with passion
            </div>
        </footer>
    );
};

export default Footer;
