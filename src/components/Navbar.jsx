import React, {useEffect , useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"
import "../styles/Navbar.css";


const Navbar = () => {

    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    //Dark Mode
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    //Auth state
    const [auth, setAuth] = useState({
        token: localStorage.getItem("token"),
        user: JSON.parse(localStorage.getItem("user")),
    })

    //Listen for auth changes(login/logout/profile change)
    useEffect(() => {
        const updateAuth = () => {
            setAuth({
                token: localStorage.getItem("token"),
                user: JSON.parse(localStorage.getItem("user")),
            });
        }

        window.addEventListener("storage",updateAuth);
        return () => window.removeEventListener("storage",updateAuth);
    }, []);

    //Dark mode + Scroll effect
    useEffect(() => {
        document.body.classList.toggle("dark", darkMode);
        localStorage.setItem("darkMode", darkMode);

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [darkMode]);
    

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.dispatchEvent(new Event("storage"));

        navigate("/login");
    };

    return(
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>

            <div className="nav-container">

                
                <div className="logo">QuickFix</div>
                

                <div className={`nav-links ${menuOpen ? "active" : ""}`}>

                    <button 
                    className="dark-btn"
                    onClick={() => setDarkMode(!darkMode)}
                    >
                        {darkMode ? "☀️" : "🌙"}
                    </button>

                    <Link to="/"> Home </Link>

                    {auth.user?.role === "user" && (
                        <>
                            <Link to="/services">Services</Link>
                            <Link to="/my-bookings">My Bookings</Link>
                        </>
                    )}

                    {auth.user?.role === "provider" && (
                        <>
                            <Link to="/provider-dashboard">Dashboard</Link>
                            <Link to="/provider/earnings">Earnings</Link>
                            <Link to="/add-service">Add Service</Link>
                        </>
                    )}

                    {auth.user?.role === "admin" && (
                        <>
                            <Link to="/admin">Admin Dashboard</Link>
                        </>
                    )}

                    {!auth.token && (
                        <Link to = "/login">
                            <button className="login-btn">Login</button>
                        </Link>
                    )}

                    {auth.token && (
                        <div className="user-menu">

                            {auth.user?.profilePic ? (
                                <img
                                src={auth.user.profilePic}
                                alt="profile"
                                className="nav-profile-img"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                />
                            ) : (
                                <FaUserCircle 
                                className="user-icon"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                />
                            
                            )}

                            {dropdownOpen && (
                                <div className="dropdown">
                                    <div className="user-info">
                                        <p className="user-name"> 
                                            {auth.user?.name}
                                            {auth.user?.role === "provider" && (
                                                <span className="provider-type">
                                                    {" "}({auth.user?.providerType})
                                                </span>
                                            )}
                                        </p>

                                        <p className="user-email">
                                            {auth.user?.email}
                                        </p>
                                    </div>

                                    <hr />

                                    <Link to="/profile">Profile</Link>
                                    <button onClick={logout}>Logout</button>
                                </div>
                            )}

                        </div>
                    )}
                    
                </div>

                {/* Mobile menu */}
                <div 
                    className="menu-toggle" 
                    onClick={() => setMenuOpen(!menuOpen)}
                    >☰
                </div>
            </div>
        </nav>
    );
};

export default Navbar;