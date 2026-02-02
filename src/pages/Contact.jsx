import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Send, Mail, User, MessageCircle, Upload, X, Instagram, Phone, MapPin } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const Contact = () => {
    const msgType = 'service'; // Always 'service' now
    const [formData, setFormData] = useState({ name: '', email: '', image: '', phone: '', address: '' });
    const { addMessage, addOrder, user } = useContext(AppContext);
    const [submitted, setSubmitted] = useState(false);

    // Auto-fill form if user is logged in
    React.useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || user.username || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (msgType === 'service') {
            addOrder({
                productName: 'Custom Commission Request',
                customer: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                notes: `Custom Commission Request: ${formData.image ? 'Referenced Image included.' : 'No reference image.'}`,
                image: formData.image,
                type: 'service',
                price: 0
            });
        } else {
            addMessage({
                name: formData.name,
                email: formData.email,
                message: 'No message provided (Inquiry from contact page)',
                type: 'inquiry'
            });
        }

        setSubmitted(true);
        setFormData({ name: '', email: '', image: '', phone: '', address: '' });
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="container" style={{ paddingTop: '10rem', paddingBottom: '6rem' }}>
            <div className="row justify-content-center">
                <div className="col-12 col-lg-11">
                    <header className="text-center mb-5">
                        <Motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-primary fw-bold small text-uppercase mb-2 letter-spacing-2"
                            style={{ letterSpacing: '3px' }}
                        >
                            Get In Touch
                        </Motion.div>
                        <Motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="display-2 fw-bold mb-3"
                        >
                            Order <span className="text-gradient">Request</span>
                        </Motion.h1>
                        <Motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="lead text-muted mx-auto"
                            style={{ maxWidth: '600px' }}
                        >
                            Ready to transform your vision into a masterpiece? Submit your custom commission request below, and we'll get back to you shortly.
                        </Motion.p>
                    </header>

                    <div className="row g-5">
                        {/* SIDEBAR INFO */}
                        <div className="col-lg-4 order-lg-2">
                            <div className="d-flex flex-column gap-4">
                                <div className="glass p-5 border-0">
                                    <h3 className="h4 fw-bold mb-4 font-serif">Studio Details</h3>

                                    <div className="d-flex flex-column gap-4">
                                        <div className="d-flex align-items-start gap-3">
                                            <div className="text-primary p-2 rounded-3" style={{ background: 'rgba(99, 102, 241, 0.1)' }}><Instagram size={20} /></div>
                                            <div>
                                                <div className="small fw-bold opacity-50 mb-1">Instagram</div>
                                                <a href="https://www.instagram.com/aslamtk35" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none hover-text-primary transition-all">@aslamtk35</a>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-start gap-3">
                                            <div className="text-primary p-2 rounded-3" style={{ background: 'rgba(99, 102, 241, 0.1)' }}><Send size={20} /></div>
                                            <div>
                                                <div className="small fw-bold opacity-50 mb-1">Telegram</div>
                                                <a href="https://t.me/aslamtk35" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none hover-text-primary transition-all">@aslamtk35</a>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-start gap-3">
                                            <div className="text-primary p-2 rounded-3" style={{ background: 'rgba(99, 102, 241, 0.1)' }}><Mail size={20} /></div>
                                            <div>
                                                <div className="small fw-bold opacity-50 mb-1">Email</div>
                                                <span className="text-white">studio@artvoid.com</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass p-5 border-0 bg-primary bg-opacity-10">
                                    <h4 className="h5 fw-bold mb-3">Our Process</h4>
                                    <ul className="list-unstyled small text-muted d-flex flex-column gap-3 mb-0">
                                        <li className="d-flex gap-2">
                                            <span className="text-primary fw-bold">01.</span>
                                            Submit your request with references.
                                        </li>
                                        <li className="d-flex gap-2">
                                            <span className="text-primary fw-bold">02.</span>
                                            Get a detailed consultation and quote.
                                        </li>
                                        <li className="d-flex gap-2">
                                            <span className="text-primary fw-bold">03.</span>
                                            Review drafts during the creation phase.
                                        </li>
                                        <li className="d-flex gap-2">
                                            <span className="text-primary fw-bold">04.</span>
                                            Worldwide shipping of your masterpiece.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* FORM AREA */}
                        <div className="col-lg-8 order-lg-1">
                            <div className="glass p-4 p-md-5 border-0">
                                <h3 className="h4 fw-bold mb-5 font-serif text-center">Commission Brief</h3>

                                <form onSubmit={handleSubmit} className="row g-4">
                                    <div className="col-md-6 d-flex flex-column gap-2">
                                        <label className="small fw-bold text-muted text-uppercase letter-spacing-1">Full Name</label>
                                        <input
                                            required
                                            placeholder="Enter your name"
                                            className="form-control bg-dark border-0 text-white py-3 rounded-3 shadow-none"
                                            style={{ background: 'rgba(255,255,255,0.03)' }}
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-md-6 d-flex flex-column gap-2">
                                        <label className="small fw-bold text-muted text-uppercase letter-spacing-1">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="your@email.com"
                                            className="form-control bg-dark border-0 text-white py-3 rounded-3 shadow-none"
                                            style={{ background: 'rgba(255,255,255,0.03)' }}
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    {msgType === 'service' && (
                                        <>
                                            <div className="col-md-6 d-flex flex-column gap-2">
                                                <label className="small fw-bold text-muted text-uppercase letter-spacing-1">Phone Number</label>
                                                <input
                                                    required
                                                    placeholder="+91 0000 000 000"
                                                    className="form-control bg-dark border-0 text-white py-3 rounded-3 shadow-none"
                                                    style={{ background: 'rgba(255,255,255,0.03)' }}
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-6 d-flex flex-column gap-2">
                                                <label className="small fw-bold text-muted text-uppercase letter-spacing-1">Shipping Address</label>
                                                <input
                                                    required
                                                    placeholder="City, Country"
                                                    className="form-control bg-dark border-0 text-white py-3 rounded-3 shadow-none"
                                                    style={{ background: 'rgba(255,255,255,0.03)' }}
                                                    value={formData.address}
                                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                />
                                            </div>
                                        </>
                                    )}



                                    {msgType === 'service' && (
                                        <div className="col-12 d-flex flex-column gap-2">
                                            <label className="small fw-bold text-muted text-uppercase letter-spacing-1">Reference Artwork (Optional)</label>
                                            <label className="btn glass border-0 text-white py-4 rounded-3 d-flex flex-column align-items-center justify-content-center gap-2" style={{ border: '2px dashed var(--glass-border) !important', background: 'rgba(255,255,255,0.02)' }}>
                                                <Upload size={24} className="opacity-50" />
                                                <span className="small opacity-50">{formData.image ? 'File Selected' : 'Drag or click to upload reference'}</span>
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="d-none" />
                                            </label>
                                            {formData.image && (
                                                <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="position-relative mt-3">
                                                    <img src={formData.image} alt="Preview" className="w-100 rounded-3 shadow-sm" style={{ height: '200px', objectFit: 'cover' }} />
                                                    <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="btn btn-sm position-absolute top-0 end-0 m-2 rounded-circle glass" style={{ background: 'rgba(0,0,0,0.5)', color: 'white' }}><X size={16} /></button>
                                                </Motion.div>
                                            )}
                                        </div>
                                    )}

                                    <div className="col-12 mt-4">
                                        <button type="submit" className="btn btn-primary btn-lg w-100 py-3 rounded-pill d-flex align-items-center justify-content-center gap-3 border-0 fw-bold shadow-lg">
                                            <Send size={20} /> Send Order Brief
                                        </button>
                                    </div>

                                    {submitted && (
                                        <Motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="col-12 text-center text-success fw-bold p-3 rounded-4 mt-3"
                                            style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                                        >
                                            Thank you! Our studio team will contact you shortly.
                                        </Motion.div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

