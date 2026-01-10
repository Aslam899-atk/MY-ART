import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowRight, User, Mail, LogIn, UserPlus } from 'lucide-react';

const Login = () => {
    const [mode, setMode] = useState('user'); // 'user', 'register'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setIsAdmin, verifyAdminPassword, isLoadingAuth, loginUser, registerUser, loginWithGoogle } = useContext(AppContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (mode === 'admin') {
            const isValid = await verifyAdminPassword(username, password);
            if (isValid) {
                setIsAdmin(true);
                navigate('/admin');
            } else {
                setError('Invalid Admin Credentials');
            }
        } else if (mode === 'user') {
            const result = await loginUser(username, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
            }
        } else if (mode === 'register') {
            const result = await registerUser(username, password);
            if (result.success) {
                // Auto login or ask to login? let's switch to login for now or auto-login
                // Ideally backend returns user on register too, let's assume we need to login now
                setError('Registration successful! Please login.');
                setMode('user');
            } else {
                setError(result.message);
            }
        }
    };

    return (
        <div className="container" style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-5">
                    <div className="glass p-4 p-md-5 text-center border-0 shadow-lg rounded-5">

                        {/* Toggle Tabs - Hide if came strictly from Admin redirect for cleaner UI */}
                        {/* Admin Toggle Removed - Admin Login is now exclusively at /admin */}

                        {mode === 'admin' && (
                            <div className="bg-primary bg-opacity-10 p-3 rounded-4 d-inline-flex align-items-center justify-content-center mb-4 text-primary">
                                <Lock size={40} />
                            </div>
                        )}
                        {(mode === 'user' || mode === 'register') && (
                            <div className="bg-success bg-opacity-10 p-3 rounded-4 d-inline-flex align-items-center justify-content-center mb-4 text-success">
                                <User size={40} />
                            </div>
                        )}

                        <h2 className="display-6 fw-bold mb-2">
                            {mode === 'admin' ? 'Admin Access' : (mode === 'register' ? 'Create Account' : 'Welcome Back')}
                        </h2>
                        <p className="text-muted mb-5 px-md-4">
                            {mode === 'admin'
                                ? 'Enter administrator credentials.'
                                : (mode === 'register' ? 'Join our community to save your likes.' : 'Login to access your saved collection.')}
                        </p>

                        {error && <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger mb-4">{error}</div>}

                        {/* Admin Login Form */}
                        {mode === 'admin' && (
                            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                <div className="text-start">
                                    <label className="small fw-bold text-muted text-uppercase mb-2 ms-1">Username</label>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        required
                                        className="form-control bg-dark border-0 text-white py-3 px-4 rounded-3 mb-3"
                                        style={{ background: 'rgba(0,0,0,0.2) !important' }}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>

                                <div className="text-start">
                                    <label className="small fw-bold text-muted text-uppercase mb-2 ms-1">Admin Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••••••"
                                        required
                                        className="form-control bg-dark border-0 text-white py-3 px-4 rounded-3"
                                        style={{ background: 'rgba(0,0,0,0.2) !important', letterSpacing: '0.1em' }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <button type="submit" disabled={isLoadingAuth} className="btn btn-primary w-100 py-3 rounded-3 fw-bold border-0 mt-3 d-flex align-items-center justify-content-center gap-2 shadow">
                                    {isLoadingAuth ? 'Processing...' : <>Authorization <ArrowRight size={20} /></>}
                                </button>
                            </form>
                        )}

                        {/* User Login - Google Only */}
                        {mode !== 'admin' && (
                            <div className="d-flex flex-column gap-3">
                                <button
                                    onClick={async () => {
                                        const res = await loginWithGoogle();
                                        if (res.success) navigate('/');
                                    }}
                                    className="btn btn-primary w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow fs-5"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="bg-white rounded-circle p-1">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Login with Gmail
                                </button>
                                <p className="text-muted small mt-2">
                                    Secure access fueled by Google. No password required.
                                </p>
                            </div>
                        )}

                        <div className="mt-2 border-top border-secondary border-opacity-10 pt-3">
                            <button onClick={() => navigate('/admin')} className="btn btn-link text-decoration-none text-secondary small hover-text-primary transition-all d-inline-flex align-items-center opacity-50 hover-opacity-100">
                                <Lock size={12} className="me-1" /> Admin Access
                            </button>
                        </div>

                        <div className="mt-3">
                            <button onClick={() => navigate('/')} className="btn btn-link text-decoration-none text-muted small hover-text-white transition-all">
                                ← Return to Art Void
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default Login;
