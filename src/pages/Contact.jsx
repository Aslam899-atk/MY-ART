import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Send, Mail, User, MessageCircle, Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
    const [msgType, setMsgType] = useState('inquiry'); // 'inquiry' or 'service'
    const [formData, setFormData] = useState({ name: '', email: '', message: '', image: '', phone: '', address: '' });
    const { addMessage } = useContext(AppContext);
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
        addMessage({ ...formData, type: msgType });
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '', image: '', phone: '', address: '' });
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '3rem' }}>Message <span style={{ color: 'var(--primary)' }}>Hub</span></h1>
                    <p style={{ color: 'var(--text-muted)' }}>Choose the type of message you'd like to send.</p>
                </header>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => setMsgType('inquiry')}
                        className={`glass ${msgType === 'inquiry' ? 'btn-primary' : ''}`}
                        style={{ padding: '1rem 2rem', borderRadius: '12px', border: msgType === 'inquiry' ? 'none' : '1px solid var(--glass-border)', color: 'white' }}
                    >
                        General Inquiry
                    </button>
                    <button
                        onClick={() => setMsgType('service')}
                        className={`glass ${msgType === 'service' ? 'btn-primary' : ''}`}
                        style={{ padding: '1rem 2rem', borderRadius: '12px', border: msgType === 'service' ? 'none' : '1px solid var(--glass-border)', color: 'white' }}
                    >
                        Order / Service Request
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                    <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <h3 style={{ marginBottom: '1rem' }}>{msgType === 'inquiry' ? 'Contact Info' : 'Request Info'}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>
                                {msgType === 'inquiry'
                                    ? 'We usually respond to general inquiries within 24 hours.'
                                    : 'Please provide details for your custom order or service request.'}
                            </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ color: 'var(--primary)' }}><Mail size={24} /></div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>Email</div>
                                <div style={{ color: 'var(--text-muted)' }}>studio@artvoid.com</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ color: 'var(--primary)' }}><MessageCircle size={24} /></div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>Socials</div>
                                <div style={{ color: 'var(--text-muted)' }}>@artvoid_studio</div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    required
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }}
                                />
                            </div>
                        </div>

                        {msgType === 'service' && (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Phone No</label>
                                    <input
                                        required
                                        placeholder="+1 234 567 890"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Address</label>
                                    <input
                                        required
                                        placeholder="Full Delivery Address"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }}
                                    />
                                </div>
                            </>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{msgType === 'service' ? 'Gmail' : 'Email'}</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    required
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{msgType === 'service' ? 'Comment' : 'Message'}</label>
                            <textarea
                                required
                                rows="5"
                                placeholder={msgType === 'service' ? "Describe your order or project details..." : "What's on your mind?"}
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', resize: 'none' }}
                            />
                        </div>

                        {msgType === 'service' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Choose Image (Showcase)</label>
                                <label className="glass" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', border: '1px dashed var(--glass-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <Upload size={18} /> {formData.image ? 'Image Chosen' : 'Choose Image'}
                                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                </label>
                                {formData.image && (
                                    <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                                        <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <button type="button" onClick={() => setFormData({ ...formData, image: '' })} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.2rem', borderRadius: '50%' }}><X size={14} /></button>
                                    </div>
                                )}
                            </div>
                        )}

                        <button type="submit" className="btn-primary" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Send size={18} /> {msgType === 'service' ? 'Submit Request' : 'Send Message'}
                        </button>

                        {submitted && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ textAlign: 'center', color: '#10b981', fontWeight: '600' }}
                            >
                                {msgType === 'service' ? 'Request submitted successfully!' : 'Message sent successfully!'}
                            </motion.div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
