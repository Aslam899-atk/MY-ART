import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Send, Mail, User, MessageCircle, Upload, X, Instagram } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const Contact = () => {
    const [msgType, setMsgType] = useState('inquiry'); // 'inquiry' or 'service'
    const [formData, setFormData] = useState({ name: '', email: '', message: '', image: '', phone: '', address: '' });
    const { addMessage, addOrder } = useContext(AppContext);
    const [submitted, setSubmitted] = useState(false);

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
                productName: 'Custom Service Request',
                customer: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                notes: formData.message,
                image: formData.image,
                type: 'service',
                price: 0
            });
        } else {
            addMessage({
                name: formData.name,
                email: formData.email,
                message: formData.message,
                type: 'inquiry'
            });
        }

        setSubmitted(true);
        setFormData({ name: '', email: '', message: '', image: '', phone: '', address: '' });
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10">
                    <header className="text-center mb-5">
                        <h1 className="display-3 fw-bold">Message <span style={{ color: 'var(--primary)' }}>Hub</span></h1>
                        <p className="lead text-muted">Choose the type of message you'd like to send.</p>
                    </header>

                    <div className="d-flex gap-3 mb-5 justify-content-center flex-wrap">
                        <button
                            onClick={() => setMsgType('inquiry')}
                            className={`btn rounded-4 px-4 py-3 border-0 transition-all ${msgType === 'inquiry' ? 'btn-primary' : 'glass text-white'}`}
                        >
                            General Inquiry
                        </button>
                        <button
                            onClick={() => setMsgType('service')}
                            className={`btn rounded-4 px-4 py-3 border-0 transition-all ${msgType === 'service' ? 'btn-primary' : 'glass text-white'}`}
                        >
                            Order / Service Request
                        </button>
                    </div>

                    <div className="row g-5">
                        <div className="col-12 col-md-5">
                            <div className="glass p-4 p-md-5 h-100 d-flex flex-column gap-4 border-0">
                                <div>
                                    <h3 className="fw-bold mb-3">{msgType === 'inquiry' ? 'Contact Info' : 'Request Info'}</h3>
                                    <p className="text-muted mb-0">
                                        {msgType === 'inquiry'
                                            ? 'We usually respond to general inquiries within 24 hours.'
                                            : 'Please provide details for your custom order or service request.'}
                                    </p>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    <div className="text-primary p-3 rounded-circle" style={{ background: 'rgba(99, 102, 241, 0.1)' }}><Instagram size={24} /></div>
                                    <div>
                                        <div className="fw-bold small text-uppercase tracking-wider opacity-50">Instagram</div>
                                        <a href="https://www.instagram.com/aslamtk35?igsh=ZnFhenBpajFrdDB3" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">@aslamtk35</a>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    <div className="text-primary p-3 rounded-circle" style={{ background: 'rgba(99, 102, 241, 0.1)' }}><Send size={24} /></div>
                                    <div>
                                        <div className="fw-bold small text-uppercase tracking-wider opacity-50">Telegram</div>
                                        <a href="https://t.me/aslamtk35" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">@aslamtk35</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-7">
                            <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                                <div className="d-flex flex-column gap-2">
                                    <label className="small fw-bold text-muted text-uppercase">Name</label>
                                    <div className="position-relative">
                                        <User size={18} className="position-absolute translate-middle-y text-muted" style={{ left: '1rem', top: '50%' }} />
                                        <input
                                            required
                                            placeholder="Your Name"
                                            className="form-control bg-dark border-0 text-white ps-5 py-3 rounded-3"
                                            style={{ background: 'rgba(0,0,0,0.2) !important' }}
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {msgType === 'service' && (
                                    <div className="row g-3">
                                        <div className="col-12 col-sm-6 d-flex flex-column gap-2">
                                            <label className="small fw-bold text-muted text-uppercase">Phone No</label>
                                            <input
                                                required
                                                placeholder="+1 234 567 890"
                                                className="form-control bg-dark border-0 text-white py-3 rounded-3"
                                                style={{ background: 'rgba(0,0,0,0.2) !important' }}
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-12 col-sm-6 d-flex flex-column gap-2">
                                            <label className="small fw-bold text-muted text-uppercase">Address</label>
                                            <input
                                                required
                                                placeholder="Shipping Address"
                                                className="form-control bg-dark border-0 text-white py-3 rounded-3"
                                                style={{ background: 'rgba(0,0,0,0.2) !important' }}
                                                value={formData.address}
                                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="d-flex flex-column gap-2">
                                    <label className="small fw-bold text-muted text-uppercase">{msgType === 'service' ? 'Gmail Address' : 'Email'}</label>
                                    <div className="position-relative">
                                        <Mail size={18} className="position-absolute translate-middle-y text-muted" style={{ left: '1rem', top: '50%' }} />
                                        <input
                                            required
                                            type="email"
                                            placeholder="your@email.com"
                                            className="form-control bg-dark border-0 text-white ps-5 py-3 rounded-3"
                                            style={{ background: 'rgba(0,0,0,0.2) !important' }}
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="d-flex flex-column gap-2">
                                    <label className="small fw-bold text-muted text-uppercase">{msgType === 'service' ? 'Comment / Notes' : 'Message'}</label>
                                    <textarea
                                        required
                                        rows="4"
                                        placeholder={msgType === 'service' ? "Describe your order or project details..." : "What's on your mind?"}
                                        className="form-control bg-dark border-0 text-white py-3 rounded-3"
                                        style={{ background: 'rgba(0,0,0,0.2) !important', resize: 'none' }}
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                {msgType === 'service' && (
                                    <div className="d-flex flex-column gap-2">
                                        <label className="small fw-bold text-muted text-uppercase">Reference Image (Optional)</label>
                                        <label className="btn glass border-0 text-white py-3 rounded-3 d-flex align-items-center justify-content-center gap-2" style={{ border: '1px dashed var(--glass-border) !important' }}>
                                            <Upload size={18} /> {formData.image ? 'Image Selected' : 'Select Artwork'}
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="d-none" />
                                        </label>
                                        {formData.image && (
                                            <div className="position-relative mt-2">
                                                <img src={formData.image} alt="Preview" className="w-100 rounded-3" style={{ height: '120px', objectFit: 'cover' }} />
                                                <button type="button" onClick={() => setFormData({ ...formData, image: '' })} className="btn btn-sm position-absolute top-0 end-0 m-2 rounded-circle" style={{ background: 'rgba(0,0,0,0.5)', color: 'white' }}><X size={14} /></button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button type="submit" className="btn btn-primary py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 border-0 fw-bold mt-2">
                                    <Send size={18} /> {msgType === 'service' ? 'Submit Request' : 'Send Message'}
                                </button>

                                {submitted && (
                                    <Motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center text-success fw-bold p-3 rounded-3"
                                        style={{ background: 'rgba(16, 185, 129, 0.1)' }}
                                    >
                                        {msgType === 'service' ? 'Request submitted successfully!' : 'Message sent successfully!'}
                                    </Motion.div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
