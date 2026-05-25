import { React, useState } from "react";
import API from "../services/api";
import { useNavigate,Link } from "react-router-dom";
import "../styles/Auth.css";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
        profession: ""
    });

    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value });
    };

    const setRole = (role)=>{
        setForm({...form,role});
    };

    const sendOtp = async () => {
        try {
            await API.post("/auth/send-otp", {email: form.email })
            setStep(2);
            setMessage("OTP send to your email 📧");
            setError("");
        } catch (err) {
            setError("Failed to send OTP");
        }
    }

    const verifyOtp = async () => {
        try{
            await API.post("/auth/verify-otp", {
                ...form,
                otp
            });

            setMessage("Registration successful ✅");
            setError("");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            setError("Invaild OTP ❌")
        }
    }


    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Create Account</h2>

                {step === 1 && (
                    <>

                        <input name="name" 
                        placeholder="Full Name" 
                        value={form.name}
                        onChange={handleChange} 
                        />

                        <input name="email"
                        type="email" 
                        placeholder="Email" 
                        value={form.email}
                        onChange={handleChange} 
                        />

                        <input name="password" 
                        type="password" 
                        placeholder="Password" 
                        value={form.password}
                        onChange={handleChange} 
                        />
                    
                        <div className="role-select">

                            <button
                                type="button"
                                className={form.role==="user" ? "role-btn active":"role-btn"}
                                onClick={()=>setRole("user")}
                            >👤 User
                            </button>

                            <button
                                type="button"
                                className={form.role==="provider" ? "role-btn active":"role-btn"}
                                onClick={()=>setRole("provider")}
                            >🛠 Provider
                            </button>
                        </div>

                        {form.role === "provider" && (
                            <select
                            name="profession"
                            value={form.profession}
                            onChange={handleChange}
                            required
                            >
                                <option value="">Select Your Service</option>
                                <option value="electrician">Electrician</option>
                                <option value="plumber">Plumber</option>
                                <option value="cleaning">Cleaning</option>
                                <option value="ac">AC Service</option>
                            </select>
                        )}

                        <button className="auth-btn" onClick={sendOtp}>Send OTP</button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <input 
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.trim())}
                        />

                        <button className="auth-btn" onClick={verifyOtp}>
                            Verify & Register
                        </button>
                    </>
                )}

                {message && <p className="success">{message}</p> }
                {error && <p className="error">{error}</p> }

                <p className="auth-link">
                    Already have account? <Link to="/login">Login</Link>
                </p>

            </div>
        </div>
    )
}

export default Register;