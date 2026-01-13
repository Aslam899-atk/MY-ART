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
                <Link className="navbar-brand d-flex align-items-center gap-2" to="/" style={{ fontWeight: '800', fontSize: '1.2rem' }}>
                    <img src={`${import.meta.env.BASE_URL}icon.png`} alt="Falcon" style={{ width: '1.3cm', height: '1.3cm', borderRadius: '12px', objectFit: 'cover' }} />
                    <span style={{ background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.5px' }}>
                        (ART VOID)
                    </span>
                </Link>

                <button className="navbar-toggler border-0 shadow-none ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" style={{ padding: '0.25rem' }}>
                    <span className="navbar-toggler-icon" style={{ width: '1.2em', height: '1.2em' }}></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center gap-2 gap-lg-3 mt-2 mt-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link px-3 py-1" to="/" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-3 py-1" to="/gallery" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Gallery</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-3 py-1" to="/shop" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Shop</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-3 py-1" to="/contact" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Contact</Link>
                        </li>

                        <li className="nav-item d-none d-lg-block mx-1">
                            <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.1)' }}></div>
                        </li>

                        <li className="nav-item d-flex align-items-center gap-3 ps-lg-2">
                            {isAdmin ? (
                                <Link to="/admin" className="btn-primary d-inline-flex align-items-center gap-2" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: '20px' }}>
                                    <LayoutDashboard size={14} /> Admin
                                </Link>
                            ) : user ? (
                                <div className="d-flex align-items-center gap-3">
                                    <span className="text-white small fw-bold d-none d-md-block">Hi, {user.username}</span>
                                    <button onClick={logoutUser} className="btn nav-link p-0 border-0" title="Logout" style={{ color: 'var(--text-muted)' }}>
                                        <LogIn size={18} style={{ transform: 'rotate(180deg)' }} />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="nav-link p-0" style={{ color: 'var(--text-muted)' }}>
                                    <LogIn size={18} />
                                </Link>
                            )}


                            <button className="btn p-0 border-0 shadow-none" style={{ background: 'transparent', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}>
                                <ShoppingCart size={20} />
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
