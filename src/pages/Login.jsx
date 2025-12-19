import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [password, setPassword] = useState('');
    const { setIsAdmin, adminPassword } = useContext(AppContext);
    const navigate = useNavigate();

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
        <div className="container" style={{ paddingTop: '10rem', display: 'flex', justifyContent: 'center' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '3rem', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                    <Lock size={32} />
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Admin Access</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Please enter the administrator password to continue.</p>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="password"
                        placeholder="Admin Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', fontSize: '1rem' }}
                    />
                    <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                        Authorization <ArrowRight size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
