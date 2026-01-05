import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, User, Mail, LogIn, UserPlus } from 'lucide-react';

const Login = () => {
    const [mode, setMode] = useState('user'); // 'user' (login), 'register', 'admin'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setIsAdmin, verifyAdminPassword, isLoadingAuth, loginUser, registerUser } = useContext(AppContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (mode === 'admin') {
            const isValid = await verifyAdminPassword(password);
            if (username === 'aslam' && isValid) {
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

                        {/* Toggle Tabs */}
                        <div className="d-flex justify-content-center gap-3 mb-4">
                            <button
                                onClick={() => setMode('user')}
                                className={`btn rounded-pill px-4 ${mode === 'user' || mode === 'register' ? 'btn-primary' : 'btn-outline-light border-0 var(--text-muted)'}`}
                            >
                                User
                            </button>
                            <button
                                onClick={() => setMode('admin')}
                                className={`btn rounded-pill px-4 ${mode === 'admin' ? 'btn-primary' : 'btn-outline-light border-0'}`}
                            >
                                Admin
                            </button>
                        </div>

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
                                <label className="small fw-bold text-muted text-uppercase mb-2 ms-1">Password</label>
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
                                {isLoadingAuth ? 'Processing...' : (
                                    mode === 'admin' ? <>Authorization <ArrowRight size={20} /></> :
                                        (mode === 'register' ? <>Sign Up <UserPlus size={20} /></> : <>Login <LogIn size={20} /></>)
                                )}
                            </button>
                        </form>

                        {/* Switch between Login and Register */}
                        {mode !== 'admin' && (
                            <div className="mt-4">
                                <p className="text-muted small">
                                    {mode === 'user' ? "Don't have an account? " : "Already have an account? "}
                                    <button
                                        onClick={() => setMode(mode === 'user' ? 'register' : 'user')}
                                        className="btn btn-link p-0 text-primary text-decoration-none fw-bold"
                                    >
                                        {mode === 'user' ? 'Register' : 'Login'}
                                    </button>
                                </p>
                            </div>
                        )}

                        <div className="mt-4">
                            <button onClick={() => navigate('/')} className="btn btn-link text-decoration-none text-muted small hover-text-white transition-all">
                                ← Return to Art Void
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
