import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setIsAdmin, adminPassword } = useContext(AppContext);
    const navigate = useNavigate();
    // Hard‑coded credentials
    const ADMIN_USERNAME = 'aslam';
    const ADMIN_PASSWORD = 'aslam123';

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === adminPassword) {
            setIsAdmin(true);
            navigate('/admin');
        } else {
            alert('Incorrect password!');
        }
    };

    return (
        <div className="container" style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-5">
                    <div className="glass p-4 p-md-5 text-center border-0 shadow-lg rounded-5">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-4 d-inline-flex align-items-center justify-content-center mb-4 text-primary">
                            <Lock size={40} />
                        </div>
                        <h2 className="display-6 fw-bold mb-2">Admin Access</h2>
                        <p className="text-muted mb-5 px-md-4">Please enter the administrator password to continue to the control panel.</p>

                        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
                            <div className="text-start">
                                <label className="small fw-bold text-muted text-uppercase mb-2 ms-1">Security Key</label>
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    className="form-control bg-dark border-0 text-white py-3 px-4 rounded-3 text-center"
                                    style={{ background: 'rgba(0,0,0,0.2) !important', letterSpacing: '0.2em' }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 py-3 rounded-3 fw-bold border-0 mt-3 d-flex align-items-center justify-content-center gap-2 shadow">
                                Authorization <ArrowRight size={20} />
                            </button>
                        </form>

                        <div className="mt-5">
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
