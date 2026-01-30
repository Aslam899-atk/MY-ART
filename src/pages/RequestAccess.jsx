import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const RequestAccess = () => {
    const { user, requestEmblosAccess, appSettings } = useContext(AppContext);
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
                    <h2 className="fw-bold text-gradient mb-3">Welcome to Emblos!</h2>
                    <p className="text-white opacity-70 mb-4">നിങ്ങളുടെ അക്കൗണ്ട് ആക്റ്റീവ് ആയിട്ടുണ്ട്. ഇപ്പോൾ തന്നെ നിങ്ങൾക്ക് വർക്കുകൾ അപ്‌ലോഡ് ചെയ്തു തുടങ്ങാം. പക്ഷെ പബ്ലിക് ആകുന്നതിന് മുൻപ് അഡ്മിൻ അപ്രൂവ് ചെയ്യേണ്ടതുണ്ട്.</p>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-glow border-0">Go to Dashboard</button>
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
                                <AlertCircle size={18} /> Join as Emblos Artist
                            </h6>

                            <div className="mb-3 d-flex flex-column gap-2">
                                <span className="badge bg-primary text-white p-2 rounded-3 text-start fw-medium" style={{ width: 'fit-content' }}>
                                    Commission Model: {appSettings.emblos_config?.commissionRate || 10}% per order
                                </span>
                                {appSettings.emblos_config?.monthlyFee > 0 && (
                                    <span className="badge bg-secondary text-white p-2 rounded-3 text-start fw-medium" style={{ width: 'fit-content' }}>
                                        Registration: ₹{appSettings.emblos_config.monthlyFee}
                                    </span>
                                )}
                            </div>

                            {appSettings.emblos_config?.rules?.length > 0 ? (
                                <ul className="list-unstyled mb-0">
                                    {appSettings.emblos_config.rules.map((rule, idx) => (
                                        <li key={idx} className="small opacity-75 mb-2 d-flex gap-2">
                                            <span className="text-primary">•</span> {rule}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="mt-3 pt-3 border-top border-white border-opacity-10">
                                    <h6 className="fw-bold mb-3 text-warning">How It Works (പ്രവർത്തന രീതി):</h6>
                                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                                        <li className="small opacity-75 d-flex gap-2">
                                            <span className="text-primary fw-bold">1. Joining:</span>
                                            വിവരങ്ങൾ നൽകി 'Join Now' ക്ലിക്ക് ചെയ്താൽ ഉടൻ തന്നെ നിങ്ങൾക്ക് Emblos (Artist) ആകാം.
                                        </li>
                                        <li className="small opacity-75 d-flex gap-2">
                                            <span className="text-primary fw-bold">2. Uploading:</span>
                                            നിങ്ങളുടെ വർക്കുകൾ (Gallery / Shop) അപ്‌ലോഡ് ചെയ്യാം. അഡ്മിൻ അപ്രൂവ് ചെയ്താൽ അത് പബ്ലിക് ആകും.
                                        </li>
                                        <li className="small opacity-75 d-flex gap-2">
                                            <span className="text-primary fw-bold">3. Orders:</span>
                                            ഓർഡറുകൾ 'Task Center'-ൽ വരും. നിങ്ങൾക്ക് ഇഷ്ടമുള്ള വർക്ക് അവിടെ നിന്നും 'Claim' ചെയ്യാം.
                                        </li>
                                        <li className="small opacity-75 d-flex gap-2">
                                            <span className="text-primary fw-bold">4. Earnings:</span>
                                            വിൽപ്പന വിലയിൽ നിന്നും കമ്മീഷൻ (Eg: 10%) കുറച്ച് ബാക്കി തുക നിങ്ങൾക്ക് ലഭിക്കും.
                                        </li>
                                        <li className="small opacity-75 d-flex gap-2">
                                            <span className="text-primary fw-bold">5. Shipping:</span>
                                            ഓർഡർ ലഭിച്ചാൽ സാധനം പാക്ക് ചെയ്ത് കസ്റ്റമർക്ക് അയച്ചു കൊടുക്കേണ്ട ഉത്തരവാദിത്തം നിങ്ങൾക്കാണ്.
                                        </li>
                                        <li className="small opacity-75 mt-2 fw-bold text-danger bg-danger bg-opacity-10 p-2 rounded border border-danger border-opacity-20">
                                            ⚠️ ശ്രദ്ധിക്കുക: അഡ്മിൻ്റെ അനുവാദമില്ലാതെ ജോയിൻ ചെയ്തു കഴിഞ്ഞാൽ അക്കൗണ്ട് ഡിലീറ്റ് ചെയ്യാനോ പിന്മാറാനോ സാധിക്കില്ല.
                                        </li>
                                    </ul>
                                </div>
                            )}
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
                                Join Now
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestAccess;
