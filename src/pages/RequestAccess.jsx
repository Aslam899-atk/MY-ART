import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const RequestAccess = () => {
    const { user, requestEmblosAccess } = useContext(AppContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phone: '',
        message: '',
        plan: '1'
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await requestEmblosAccess(formData);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="container mt-5 pt-5 text-center min-vh-100">
                <div className="glass p-5 rounded-4 d-inline-block border border-white border-opacity-10 shadow-2xl">
                    <CheckCircle size={64} className="text-success mb-4" />
                    <h2 className="fw-bold text-gradient mb-3">Request Submitted!</h2>
                    <p className="text-white opacity-70 mb-4">Admin personally contact ചെയ്യുന്നതാണ് (Gmail / Phone number വഴി).</p>
                    <button onClick={() => navigate('/')} className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-glow border-0">Back to Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-5 min-vh-100">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="glass p-5 rounded-4 border border-white border-opacity-10 shadow-2xl">
                        <h2 className="fw-bold text-gradient mb-4">Request Emblos Access</h2>

                        <div className="alert bg-primary bg-opacity-10 border-primary border-opacity-20 text-white p-4 rounded-4 mb-4">
                            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                <AlertCircle size={18} /> Emblos Access Rule
                            </h6>
                            <p className="small opacity-75 mb-2">
                                Emblos access website വഴി automatically approve ചെയ്യില്ല.
                            </p>
                            <p className="small opacity-75 mb-2">
                                Request submit ചെയ്ത ശേഷം Admin personally contact ചെയ്യുന്നതാണ് (Gmail / Phone number വഴി).
                            </p>
                            <p className="small opacity-75 mb-2">
                                Payment & terms confirm ചെയ്ത ശേഷം മാത്രമേ Admin dashboard വഴി access activate ചെയ്യൂ.
                            </p>
                            <p className="small opacity-75 mb-0 fw-bold text-primary">
                                Admin confirmation ഇല്ലാതെ upload / publish അനുവദിക്കില്ല.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="small fw-bold text-white opacity-50 mb-2">Gmail Address</label>
                                <input type="email" value={user?.email} disabled className="form-control glass border-0 text-white rounded-3 py-2 px-3 opacity-50" />
                            </div>

                            <div className="mb-4">
                                <label className="small fw-bold text-white opacity-50 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    className="form-control glass border-0 text-white rounded-3 py-2 px-3 border-bottom border-primary border-opacity-20"
                                    placeholder="+91 ..."
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="small fw-bold text-white opacity-50 mb-2">Select Monthly Plan</label>
                                <select
                                    className="form-select glass border-0 text-white rounded-3 py-2 px-3 border-bottom border-primary border-opacity-20 cursor-pointer"
                                    value={formData.plan}
                                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                                >
                                    <option value="1" className="bg-dark">1 Month</option>
                                    <option value="3" className="bg-dark">3 Months</option>
                                    <option value="6" className="bg-dark">6 Months</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="small fw-bold text-white opacity-50 mb-2">Short Message (Optional)</label>
                                <textarea
                                    className="form-control glass border-0 text-white rounded-3 py-2 px-3 border-bottom border-primary border-opacity-20"
                                    rows="3"
                                    placeholder="Tell us about your work..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-3 shadow-glow transition-all hover-scale">
                                <Send size={20} />
                                Submit Request
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestAccess;
