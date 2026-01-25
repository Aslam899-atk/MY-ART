import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { LogIn, X } from 'lucide-react';

const LoginPopup = () => {
    const { user, loginWithGoogle, isLoadingAuth } = useContext(AppContext);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!isLoadingAuth && !user) {
            const timer = setTimeout(() => {
                setShow(true);
            }, 2000); // Show after 2 seconds
            return () => clearTimeout(timer);
        }
    }, [user, isLoadingAuth]);

    if (!show || user) return null;

    return (
        <div className="fixed-top w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1060, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
            <div className="glass p-5 rounded-4 text-center border border-white border-opacity-10 shadow-2xl position-relative" style={{ maxWidth: '400px', width: '90%' }}>
                <button
                    onClick={() => setShow(false)}
                    className="position-absolute top-0 end-0 m-3 btn btn-link text-white opacity-50 hover-opacity-100"
                >
                    <X size={20} />
                </button>

                <div className="mb-4">
                    <img src="/icon.png" alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '20px' }} className="shadow-lg mb-3" />
                    <h2 className="fw-bold text-gradient mb-2">Welcome to ART VOID</h2>
                    <p className="small text-white opacity-70">ആദ്യം ലോഗിൻ ചെയ്താലേ ഓർഡർ ചെയ്യാനും, അപ്ലോഡ് ചെയ്യാനും പറ്റൂ</p>
                </div>

                <button
                    onClick={loginWithGoogle}
                    className="btn btn-primary w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-3 shadow-glow transition-all hover-scale"
                >
                    <LogIn size={20} />
                    Login with Google
                </button>

                <p className="mt-4 extra-small text-white opacity-40">By continuing, you agree to our terms and conditions.</p>
            </div>
        </div>
    );
};

export default LoginPopup;
