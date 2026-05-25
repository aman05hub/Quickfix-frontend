import React, { useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/Profile.css";

const Profile = () => {

    const [user, setUser] = useState(() => {
        try{
            return JSON.parse(localStorage.getItem("user")) || {};
        } catch {
            return {};
        }
    });

    const [showModal, setShowModal] = useState(false);

    //form state
    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || ""
    });

    //Image state
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0);

    const [newEmail, setNewEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [timer, setTimer] = useState(0);

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: ""
    });

    const getStrength = (password) => {
        if (password.length < 4) return "Weak";
        if (password.length < 8) return "Medium";
        return "Strong";
    };

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    //Save progile DB + Navbar update
    const handleSave = async () => {
        try{
            const { data } = await API.put("/user/update-profile", form);

            //Save updated user
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);

            //Update Navbar
            window.dispatchEvent(new Event("storage"));

            toast.success("Profile updated successfully");

            setShowModal(false);

        } catch(err){
            toast.error(err.response?.data?.message || "Update failed");
        }
    };

    const handleUpload = async () => {
        if (!image){
            return toast.error("Select image");
        }

        const formData = new FormData();
        formData.append("image", image);

        try{
            setLoading(true);

            const { data } = await API.post("/user/upload-profile", formData, {
                onUploadProgress: (e) => {
                    const percent = Math.round((e.loaded * 100) / e.total);
                    setProgress(percent);
                }
            });

            localStorage.setItem("user", JSON.stringify(data.user))
            setUser(data.user);

            //Navbar update
            window.dispatchEvent(new Event("storage"));

            setPreview(null);
            toast.success("Profile Photo Updated");

        } catch (err) {
            toast.error("Upload Failed");

        } finally {
            setLoading(false);
            setProgress(0);

        }
    }

    const handleDelete = async () => {
        try {
            const { data } = await API.delete("/user/delete-profile");

            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user)

            //Navbar update
            window.dispatchEvent(new Event("storage"));

            toast.success("Profile Photo Removed");

        } catch (err) {
            toast.error("Delete Failed");
        }
    }

    const sendOtp = async () => {
        try{
            await API.post("/user/change-email-otp", { 
                newEmail 
            });

            setShowOtp(true);
            setTimer(60); // 60 seconds timer

            toast.success("OTP sent to your new email");

        } catch(err){
            toast.error(err.response?.data?.message);
        }
    };

    useEffect(() => {
        if(timer <= 0) return;

        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval)

    }, [timer]);

    const verifyOtp = async () => {
        try{
            const { data } = await API.post("/user/verify-email", { otp });

            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);

            //Navbar update
            window.dispatchEvent(new Event("storage"));

            toast.success("Email updated");
            setShowOtp(false);
            setNewEmail("");
            setOtp("");

        } catch(err){
            toast.error("Invalid OTP");
        }
    }

    const changePassword = async () => {
        try{
            await API.put("/user/change-password", passwords);
            toast.success("Password updated");

        } catch(err){
            toast.error(err.response?.data?.message);
        }
    }

    return(
        <div className="profile-container">

            <div className="profile-card">

                <div className="profile-header">

                    <div className="img-wrapper">
                        <img 
                        src={preview || user?.profilePic || "/default.png"} 
                        alt="profile" 
                        />

                        <label className="upload-icon">
                            📷
                            <input 
                            type="file"
                            hidden
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setImage(file);

                                if(file){
                                    setPreview(URL.createObjectURL(file));
                                }
                            }} 
                            />
                        </label>
                    </div>

                    <h2>{user?.name}</h2>
                    <p>{user?.email}</p>

                    <button 
                        className="edit-btn"
                        onClick={() => setShowModal(true)}
                    >
                        Edit Profile
                    </button>

                </div>

                <div className="photo-actions">
                    <button onClick={handleUpload} disabled={loading}>
                        {loading ? `Uploading ${progress}%` : "Upload"}
                    </button>

                    <button className="delete-btn" onClick={handleDelete}>
                        Remove
                    </button>
                </div>

                {/* progress bar */}
                {loading && (
                    <div className="progress-bar">
                        <div style={{ width: `${progress}%`}} />
                    </div>
                )}

                {/* Form
                <div className="profile-form">
                    <div className="input-group">
                        <label>Name</label>
                        <input 
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                         />
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange} 
                        />
                    </div>

                    <button className="save-btn" onClick={handleSave}>
                        💾 Save Changes
                    </button> */}

                    {/* <hr style={{ margin: "25px 0" }} /> */}

                    <div className="profile-section">
                        <h3>Change Email</h3>

                        <input 
                            placeholder="Enter new email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />

                        <button onClick={sendOtp}>
                            Send OTP
                        </button>

                        {showOtp && (
                            <>
                                <input placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                />

                                <button onClick={verifyOtp}>
                                    Verify & Update Email
                                </button>

                                {timer > 0 ? (
                                    <p>Resend in {timer} seconds</p>
                                ) : (
                                    <button onClick={sendOtp}>
                                        Resend OTP
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    {/* <hr style={{ margin: "25px 0" }} /> */}

                    <div className="profile-section">
                        <h3>Change password</h3>

                        <input 
                            type="password"
                            placeholder="current Password"
                            onChange={(e) => 
                                setPasswords({ ...passwords, currentPassword: e.target.value })
                            }
                        />

                        <input 
                            type="password"
                            placeholder="New Password"
                            onChange={(e) => 
                                setPasswords({ ...passwords, newPassword: e.target.value })
                            }
                        />
                        <p className={`strength ${getStrength(passwords.newPassword)}`}>
                            Strength: {" "} {getStrength(passwords.newPassword)}
                        </p>

                        <button onClick={changePassword}>
                            Update Password
                        </button>
                    </div>

            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-box">

                        <h3>Edit Profile</h3>

                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Name"
                        />

                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email" 
                        />

                        <div className="modal-actions">

                            <button onClick={handleSave}>
                                Save
                            </button>

                            <button onClick={() => setShowModal(false)}>
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Profile;