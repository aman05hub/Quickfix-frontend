import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/Auth.css";

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const { data } = await API.post("/auth/login", form);

            console.log("Login Response:", data);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            window.dispatchEvent(new Event("storage"));

            toast.success("login successful");
            
            setTimeout(() => {
                
                if(data.user.role === "provider"){
                    navigate("/provider-dashboard");
                } else if (data.user.role === "admin"){
                    navigate("/admin");
                } else {
                    navigate("/");
                }

            }, 100);

        }catch(err){
            console.log(err);
            toast.error(err.response?.data?.message || "Login failed");
        }
    };

    return(
        <div className="auth-container">

            <div className="auth-box">

                <h2>Login</h2>

                <form onSubmit={handleSubmit}>

                    <input
                    type="email" 
                    name="email" 
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange} 
                    required
                    />

                    <input 
                    name="password" 
                    type="password" 
                    placeholder="Password"
                    value={form.password} 
                    onChange={handleChange}
                    required 
                    />
                    
                    <button className="auth-btn">Login</button>
                </form>

                <p className="auth-link">
                    Don't have account? <Link to="/register">Register</Link>
                </p>
                
            </div>
        </div>
    );
};

export default Login;