import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/ProviderDashboard.css";

const ProviderDashboard = () => {
    const navigate = useNavigate();

    const [bookings,setBookings] = useState([]);
    const [prevBookings, setPrevBookings] = useState([]);
    const [toast, setToast] = useState(false);

    const pendingCount = bookings.filter(b => b.status === "pending").length;
    const acceptedCount = bookings.filter(b => b.status === "accepted").length;
    const completedCount = bookings.filter(b => b.status === "completed").length;


    //Fetch bookings
    const fetchBookings = async() => {
        try{
            const {data} = await API.get("/bookings/provider");
                
            const prevIds = prevBookings.map(b => b._id);
            const newBooking = data.find(b => !prevIds.includes(b._id))

            if(newBooking && prevBookings.length !== 0){
                showNotification();
            }

            setPrevBookings(data);
            setBookings(data);

        }catch(err){
            console.log(err);
        }
    };

    useEffect(() => {
 
        fetchBookings();

        const interval = setInterval(() => {
            fetchBookings();
        }, 5000);

        return() => clearInterval(interval);
    }, []);

    //Update booking status
    const updateStatus = async(id,status)=>{

        try{
            await API.put(`/bookings/${id}/status`,{status});

            setBookings(prev => 
                prev.map(b =>
                    b._id === id ? {...b, status} : b
                )
            );
        } catch(err){
            console.log(err);
        }
    };

    //Show notification
    const showNotification = () => {
        setToast(true);

        const audio = new Audio("/notify.mp3");
        audio.play();

        setTimeout(() => setToast(false),3000)
    }

    return(
        <div className="provider-page">

            {toast && (
                <div className="toast">
                    🔔 New Booking Received !
                </div>
            )}
            <h1>Provider Dashboard</h1>

            <div className="dashboard-summary">

                <div className="summary-card pending">
                    🟡 Pending: {pendingCount}
                </div>

                <div className="summary-card accepted">
                    🟢 Accepted: {acceptedCount}
                </div>

                <div className="summary-card completed">
                    ✅ Completed: {completedCount}
                </div>

            </div>

            {bookings.length === 0 ? (
                <div className="empty">
                    <h2>No Jobs Yet</h2>
                    <p>Bookings will appear here</p>
                </div>
            ):(
                <div className="provider-grid">
                    {bookings.map(booking => (
                        <div className="provider-card" key={booking._id}>
                            
                            <h3>{booking.service?.title}</h3>

                            <p><b>Customer:</b>{booking.user?.name || "Unknown"}</p>

                            <p><b>Date:</b>{new Date(booking.date).toLocaleDateString()}</p>

                            <p><b>Time:</b>{booking.time}</p>

                            <p><b>Address:</b>{booking.address}</p>

                            <p><b>Phone:</b>{booking.phone}</p>

                            <p><b>Price:</b>₹{booking.price}</p>

                            <p className={`status ${(booking.status || "").replaceAll(" ","-")}`}>
                                {booking.status === "pending" && "🟡 Pending"}
                                {booking.status === "accepted" && "🟢 Accepted"}
                                {booking.status === "on the way" && "🚗 On The Way"}
                                {booking.status === "completed" && "✅ Completed"}
                                {booking.status === "cancelled" && "🔴 Cancelled"}
                            </p>

                            <div className="action-buttons">

                                {booking.status === "pending" && (
                                    <>

                                    <button 
                                    className="accept-btn"
                                    onClick={() => updateStatus(booking._id,"accepted")}
                                    >
                                        Accept
                                    </button>

                                    <button 
                                    className="reject-btn"
                                    onClick={() => updateStatus(booking._id,"cancelled")}
                                    >
                                        Reject
                                    </button>

                                    </>
                                )}

                                {booking.status === "accepted" && booking.paymentStatus === "paid" && (
                                    <button 
                                    className="ontheway-btn"
                                    onClick={() => updateStatus(booking._id,"on the way")}
                                    >
                                        On The Way
                                    </button>
                                )}

                                {booking.status === "on_the_way" && (
                                    <button className="complete-btn"
                                    onClick={() => updateStatus(booking._id,"completed")}
                                    >
                                        Completed
                                    </button>
                                )}

                            </div>

                            {(booking.status === "accepted" || booking.status === "on_the_way") && (
                                <button className="chat-btn"
                                onClick={() => navigate(`/chat/${booking._id}`)}
                                >
                                    💬 Open Chat
                                </button>
                            )}
                            
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProviderDashboard;