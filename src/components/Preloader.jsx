import React from 'react';
import { Sparkles } from 'lucide-react';

const Preloader = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#0f172a', // Matches --bg-dark
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999,
            color: '#f8fafc',
            transition: 'opacity 0.5s ease-out'
        }}>
            <div className="d-flex flex-column align-items-center gap-3">
                <div className="position-relative">
                    <Sparkles
                        size={48}
                        color="#6366f1"
                        className="animate-pulse"
                        style={{ filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))' }}
                    />
                </div>

                <h1 className="display-4 fw-bold mb-0" style={{ letterSpacing: '4px' }}>
                    ART VOID
                </h1>

                <p className="text-muted small" style={{ letterSpacing: '2px' }}>
                    LOADING MASTERPIECES...
                </p>

                {/* Simple loading bar */}
                <div style={{
                    width: '200px',
                    height: '2px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    marginTop: '1rem',
                    overflow: 'hidden'
                }}>
                    <div className="loading-bar" style={{
                        width: '100%',
                        height: '100%',
                        background: '#6366f1',
                    }}></div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes slide {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .loading-bar {
                    animation: slide 1.5s infinite linear;
                }
            `}</style>
        </div>
    );
};

export default Preloader;
