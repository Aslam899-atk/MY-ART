import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LogIn, LayoutDashboard, Palette } from 'lucide-react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const { isAdmin, user, logoutUser } = useContext(AppContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top mx-auto mt-3 px-3"
            style={{
                width: 'calc(100% - 4cm)',
                borderRadius: '32px',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.4rem 1.5rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                left: '50%',
                transform: 'translateX(-50%)'
            }}>
            <div className="container-fluid p-0">
                <Link className="navbar-brand d-flex align-items-center gap-3" to="/" style={{ fontWeight: '800' }}>
                    <div className="d-flex flex-column">
                        <span className="text-gradient" style={{ letterSpacing: '2px', lineHeight: '1', fontSize: '1.4rem' }}>
                            ASLAM TK
                        </span>
                        <span style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase' }}>
                            Full-Stack Architect
                        </span>
                    </div>
                </Link>

                <button className="navbar-toggler border-0 shadow-none ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <div className="glass p-2 rounded-circle"><Palette size={18} /></div>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center gap-2 gap-lg-4 mt-3 mt-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link px-0 text-white opacity-70 hover-opacity-100 transition-all small fw-bold" to="/">WORKS</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-0 text-white opacity-70 hover-opacity-100 transition-all small fw-bold" to="/gallery">GALLERY</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-0 text-white opacity-70 hover-opacity-100 transition-all small fw-bold" to="/shop">STORE</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-0 text-white opacity-70 hover-opacity-100 transition-all small fw-bold" to="/contact">HIRE</Link>
                        </li>

                        <li className="nav-item d-none d-lg-block mx-1">
                            <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }}></div>
                        </li>

                        <li className="nav-item d-flex align-items-center gap-3">
                            <a href="#" className="btn btn-primary rounded-pill px-4 py-2 small fw-bold shadow-glow border-0 transition-all hover-scale">
                                RESUME
                            </a>
                            {isAdmin && (
                                <Link to="/admin" className="text-white opacity-50 hover-opacity-100"><LayoutDashboard size={18} /></Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
