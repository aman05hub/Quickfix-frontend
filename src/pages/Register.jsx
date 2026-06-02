// import { React, useState } from "react";
// import API from "../services/api";
// import { useNavigate,Link } from "react-router-dom";
// import "../styles/Auth.css";

// const Register = () => {
//     const [form, setForm] = useState({
//         name: "",
//         email: "",
//         password: "",
//         role: "user",
//         profession: ""
//     });

//     const [otp, setOtp] = useState("");
//     const [step, setStep] = useState(1);
//     const [message, setMessage] = useState("");
//     const [error, setError] = useState("");

//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setForm({...form, [e.target.name]: e.target.value });
//     };

//     const setRole = (role)=>{
//         setForm({...form,role});
//     };

//     const sendOtp = async () => {
//         try {
//             const res = await API.post("/auth/send-otp", {email: form.email })
//             setStep(2);
//             setError("");

//             if (!res.data.emailSent) {
//             // Email failed — show OTP on screen with note
//             setMessage(`⚠️ Email could not be sent (server restriction). Your OTP is: ${res.data.otp}`);
//             } else {
//                 setMessage("OTP sent to your email 📧");
//             }
//         } catch (err) {
//             setError("Failed to send OTP");
//         }
//     }

//     const verifyOtp = async () => {
//         try{
//             await API.post("/auth/verify-otp", {
//                 ...form,
//                 otp
//             });

//             setMessage("Registration successful ✅");
//             setError("");

//             setTimeout(() => {
//                 navigate("/login");
//             }, 1500);
//         } catch (err) {
//             setError("Invaild OTP ❌")
//         }
//     }


//     return (
//         <div className="auth-container">
//             <div className="auth-box">
//                 <h2>Create Account</h2>

//                 {step === 1 && (
//                     <>

//                         <input name="name" 
//                         placeholder="Full Name" 
//                         value={form.name}
//                         onChange={handleChange} 
//                         />

//                         <input name="email"
//                         type="email" 
//                         placeholder="Email" 
//                         value={form.email}
//                         onChange={handleChange} 
//                         />

//                         <input name="password" 
//                         type="password" 
//                         placeholder="Password" 
//                         value={form.password}
//                         onChange={handleChange} 
//                         />
                    
//                         <div className="role-select">

//                             <button
//                                 type="button"
//                                 className={form.role==="user" ? "role-btn active":"role-btn"}
//                                 onClick={()=>setRole("user")}
//                             >👤 User
//                             </button>

//                             <button
//                                 type="button"
//                                 className={form.role==="provider" ? "role-btn active":"role-btn"}
//                                 onClick={()=>setRole("provider")}
//                             >🛠 Provider
//                             </button>
//                         </div>

//                         {form.role === "provider" && (
//                             <select
//                             name="profession"
//                             value={form.profession}
//                             onChange={handleChange}
//                             required
//                             >
//                                 <option value="">Select Your Service</option>
//                                 <option value="electrician">Electrician</option>
//                                 <option value="plumber">Plumber</option>
//                                 <option value="cleaning">Cleaning</option>
//                                 <option value="ac">AC Service</option>
//                             </select>
//                         )}

//                         <button className="auth-btn" onClick={sendOtp}>Send OTP</button>
//                     </>
//                 )}

//                 {step === 2 && (
//                     <>
//                         <input 
//                             placeholder="Enter OTP"
//                             value={otp}
//                             onChange={(e) => setOtp(e.target.value.trim())}
//                         />

//                         {message && message.includes("⚠️") && (
//                             <div style={{ background: "#fff3cd", border: "1px solid #ffc107", padding: "12px", borderRadius: "8px", marginTop: "10px", fontSize: "14px" }}>
//                                 {message}
//                             </div>
//                         )}

//                         <button className="auth-btn" onClick={verifyOtp}>
//                             Verify & Register
//                         </button>
//                     </>
//                 )}

//                 {message && !message.includes("⚠️") && <p className="success">{message}</p> }
//                 {error && <p className="error">{error}</p> }

//                 <p className="auth-link">
//                     Already have account? <Link to="/login">Login</Link>
//                 </p>

//             </div>
//         </div>
//     )
// }

// export default Register;



import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
        profession: ""
    });

    const [otp, setOtp]           = useState("");
    const [step, setStep]         = useState(1);
    const [message, setMessage]   = useState("");
    const [error, setError]       = useState("");
    const [otpInfo, setOtpInfo]   = useState(null); // { otp, emailSent }
    const [loading, setLoading]   = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const setRole      = (role) => setForm({ ...form, role });

    const sendOtp = async () => {
        if (!form.name || !form.email || !form.password) {
            setError("Please fill all fields");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await API.post("/auth/send-otp", { email: form.email });
            setStep(2);
            setOtpInfo({ otp: res.data.otp, emailSent: res.data.emailSent });

            if (res.data.emailSent) {
                setMessage("OTP sent to your email 📧");
            } else {
                setMessage("");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP");
        }
        setLoading(false);
    };

    const verifyOtp = async () => {
        setLoading(true);
        setError("");
        try {
            await API.post("/auth/verify-otp", { ...form, otp });
            setMessage("Registration successful ✅");
            setError("");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP ❌");
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Create Account</h2>

                {step === 1 && (
                    <>
                        <input
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                        />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                        />

                        <div className="role-select">
                            <button
                                type="button"
                                className={form.role === "user" ? "role-btn active" : "role-btn"}
                                onClick={() => setRole("user")}
                            >👤 User</button>
                            <button
                                type="button"
                                className={form.role === "provider" ? "role-btn active" : "role-btn"}
                                onClick={() => setRole("provider")}
                            >🛠 Provider</button>
                        </div>

                        {form.role === "provider" && (
                            <select name="profession" value={form.profession} onChange={handleChange} required>
                                <option value="">Select Your Service</option>
                                <option value="electrician">Electrician</option>
                                <option value="plumber">Plumber</option>
                                <option value="cleaning">Cleaning</option>
                                <option value="ac">AC Service</option>
                            </select>
                        )}

                        <button className="auth-btn" onClick={sendOtp} disabled={loading}>
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        {/* IP Restriction Notice — shows OTP directly */}
                        {otpInfo && !otpInfo.emailSent && (
                            <div className="otp-notice">
                                <div className="otp-notice-icon">⚠️</div>
                                <p className="otp-notice-title">Email Could Not Be Sent</p>
                                <p className="otp-notice-desc">
                                    Due to hosting server IP restrictions, the verification email
                                    could not be delivered. Please use the OTP below to complete
                                    your registration.
                                </p>
                                <div className="otp-display">{otpInfo.otp}</div>
                                <p className="otp-notice-copy">
                                    Copy this OTP and paste it in the field below ↓
                                </p>
                            </div>
                        )}

                        {/* Email sent success */}
                        {otpInfo && otpInfo.emailSent && (
                            <div className="otp-sent-note">
                                📧 OTP sent to <strong>{form.email}</strong>
                            </div>
                        )}

                        <input
                            className="otp-input"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            maxLength={6}
                            onChange={(e) => setOtp(e.target.value.trim())}
                        />

                        <button className="auth-btn" onClick={verifyOtp} disabled={loading}>
                            {loading ? "Verifying..." : "Verify & Register"}
                        </button>

                        <button className="back-btn" onClick={() => { setStep(1); setOtpInfo(null); setError(""); setMessage(""); }}>
                            ← Back
                        </button>
                    </>
                )}

                {message && <p className="success">{message}</p>}
                {error   && <p className="error">{error}</p>}

                <p className="auth-link">
                    Already have account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
