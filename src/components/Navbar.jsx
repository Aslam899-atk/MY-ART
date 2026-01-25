import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LogIn, LayoutDashboard, Menu, ShoppingBag } from 'lucide-react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const { isAdmin, user, logoutUser } = useContext(AppContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top mx-auto mt-3 px-3"
            style={{
                width: '92%',
                maxWidth: '1400px',
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
                    <img src="/icon.png" alt="ART VOID" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
                    <div className="d-flex flex-column">
                        <span className="text-gradient" style={{ letterSpacing: '2px', lineHeight: '1', fontSize: '1.4rem' }}>
                            ART VOID
                        </span>
                    </div>
                </Link>

                <button className="navbar-toggler border-0 shadow-none ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <div className="glass p-2 rounded-circle"><Menu size={18} /></div>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center gap-2 gap-lg-4 mt-3 mt-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link px-0 text-white opacity-70 hover-opacity-100 transition-all small fw-bold" to="/">HOME</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-0 text-white opacity-70 hover-opacity-100 transition-all small fw-bold" to="/gallery">GALLERY</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-0 text-white opacity-70 hover-opacity-100 transition-all small fw-bold" to="/shop">STORE</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-0 text-white opacity-70 hover-opacity-100 transition-all small fw-bold" to="/contact">CONTACT</Link>
                        </li>

                        <li className="nav-item d-none d-lg-block mx-1">
                            <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }}></div>
                        </li>

                        <li className="nav-item d-flex align-items-center gap-3">
                            {user ? (
                                <div className="d-flex align-items-center gap-2">
                                    <div className="dropdown">
                                        <button className="btn p-0 border-0 d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                                            <img src={user.avatar || '/icon.png'} className="rounded-circle border border-secondary border-opacity-25" style={{ width: '32px', height: '32px', objectFit: 'cover' }} alt="" />
                                            <span className="small text-white fw-bold d-none d-sm-inline opacity-75">{user.username?.split(' ')[0]}</span>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end glass border-0 mt-2 p-2 shadow-2xl">
                                            <li><Link className="dropdown-item rounded-3 small fw-bold py-2 d-flex align-items-center gap-2" to="/orders"><ShoppingBag size={14} /> My Orders</Link></li>
                                            {user.role === 'emblos' && (
                                                <li><Link className="dropdown-item rounded-3 small fw-bold py-2 d-flex align-items-center gap-2" to="/dashboard"><LayoutDashboard size={14} /> Emblos Dashboard</Link></li>
                                            )}
                                            {user.role !== 'emblos' && user.emblosAccess?.status !== 'pending' && (
                                                <li><Link className="dropdown-item rounded-3 small fw-bold py-2 d-flex align-items-center gap-2" to="/request-access"><LayoutDashboard size={14} /> Request Emblos</Link></li>
                                            )}
                                            {user.emblosAccess?.status === 'pending' && (
                                                <li><div className="dropdown-item rounded-3 small fw-bold py-2 d-flex align-items-center gap-2 text-warning"><LayoutDashboard size={14} /> Access Pending</div></li>
                                            )}
                                            <li><button onClick={logoutUser} className="dropdown-item rounded-3 small fw-bold py-2 text-danger d-flex align-items-center gap-2"><LogIn size={14} style={{ transform: 'rotate(180deg)' }} /> Logout</button></li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="btn btn-primary rounded-pill px-4 py-2 small fw-bold shadow-glow border-0 transition-all hover-scale">
                                    LOGIN
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
