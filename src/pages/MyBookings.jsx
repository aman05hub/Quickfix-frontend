import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/MyBookings.css";
import PaymentModel from "../components/PaymentModel";
import BookingTimeline from "../components/BookingTimeline";
import ChatPage from "./ChatPage";

const MyBookings = () => {

    const [bookings, setBookings] = useState([]);
    const [selectedBooking,setSelectedBooking] = useState(null);

    useEffect(() => {

        const fetchBookings = async () => {
            try{

                const { data } = await API.get("/bookings/my");
                setBookings(data);

            } catch(err){
                console.log(err);
            }
        }
        fetchBookings();

    }, []);

    return(
        <div className="bookings-page">
            <h1>My Bookings</h1>

            <div className="bookings-grid">

                {bookings.map((booking) => (

                    <div className="booking-card" key={booking._id}>
                        <h3>{booking.service.title}</h3>

                        <div className="booking-info">

                            <p>
                                📅<span>Date:</span> {booking.date}
                            </p>

                            <p>
                                ⏰<span>Time:</span> {booking.time}
                            </p>

                        </div>

                        <div className={`status-indicator ${
                            booking.paymentStatus === "paid" ? "green" : "red"}`} 
                            title={booking.paymentStatus}
                        />
                        

                        <BookingTimeline
                        status={booking.status}
                        paymentStatus={booking.paymentStatus}
                        />

                        {
                            booking.status === "accepted" && (
                                <button
                                className="chat-btn"
                                onClick={() => window.location.href = `/chat/${booking._id}`}>
                                    💬 Chat with Provider
                                </button>
                            )
                        }

                        {/* {booking.status === "accepted" && (
                            <ChatPage bookingId={booking._id} />
                        )} */}

                        {booking.status === "accepted" && booking.paymentStatus === "unpaid" && (

                            <button
                            className="pay-btn"
                            onClick={() => setSelectedBooking(booking)}
                            >
                                Pay Now
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {selectedBooking && (

                <PaymentModel
                booking={selectedBooking}
                closeModel={() => setSelectedBooking(null)}
                    
                    updatePayment={(id) => { 
                        setBookings(prev => 
                            prev.map(b => {
                                if(b._id === id){
                                    return{
                                        ...b,
                                        paymentStatus: "paid"
                                    };
                                }
                                return b;
                            })
                        );
                    }}
                />
            )}
        </div>
    )
}

export default MyBookings;