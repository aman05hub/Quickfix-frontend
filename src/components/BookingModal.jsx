import React, { useState } from "react";
import API from "../services/api"
import "../styles/BookingModal.css";

const BookingModal = ({ serviceId, closeModal }) => {

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleBooking = async() => {

        if(!date || !time || !address || !phone){
            setError("All fields are required")
            return;
        }

        if (!/^[0-9]{10}$/.test(phone)){
            setError("Phone number must be 10 digits");
            return;
        }
        try{
            setLoading(true)

            //Get service details price
            const { data: service } = await API.get(`/services/${serviceId}`);

            const { data } = await API.post("/payment/create-order", {
                amount: service.price
            });

            const options = {
                key: "rzp_test_SX3VcRByLnbH2h",
                amount: data.amount,
                currency: "INR",
                order_id: data.id,

                handler: async function () {
                    await API.post("/bookings/after-payment", {
                        serviceId,
                        date,
                        time,
                        address,
                        phone
                    });

                    setSuccess(true);

                    setTimeout(() => {
                        closeModel();
                    },2000);
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        }catch(err){
            console.log(err);
            setError("Payment failed ❌");
        }finally{
            setLoading(false)
        }

    };
    const timeSlots = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];

    return (
        <div className="modal-overlay">
            <div className="modal-box">

                {!success ? (
                    <>
                    
                <h2>Book Service</h2>

                <div className="input-group">

                    <label> 📅 Date</label>

                    <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    />

                </div>
                
                <div className="input-group">

                    <label>⏰ Time</label>

                    <div className="time-slots">

                        {timeSlots.map((slot) => (
                            <button
                            key={slot}
                            className={time === slot ? "slot active" : "slot"}
                            onClick={() => setTime(slot)}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>

                </div>

                <div className="input-group">

                    <label>📍 Address</label>

                    <input type="text"
                    placeholder="Enter service address"
                    value={address}
                    onChange={(e)=>setAddress(e.target.value)}
                />

                </div>

                <div className="input-group">

                    <label>📞 Phone</label>

                    <input 
                    type="text"
                    placeholder="Enter contact number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)} 
                />
 
                </div>

                {error && <p className="error-msg">{error}</p>}

                <div className="modal-buttons">

                    <button 
                    className="confirm-btn" 
                    onClick={handleBooking}
                    disabled={loading}>
                        {loading ? "Booking..." : "Confirm Booking"}
                    </button>

                    <button 
                    className="cancel-btn" 
                    onClick={closeModal}
                    >
                        Cancel
                    </button>

                </div>

            </>
            ):(

                <div className="success-box">
                    <h2>✅ Booking Successful</h2>
                    <p>Your service has been booked</p>
                </div>

            )}
                
        </div>
    </div>
    )
}

export default BookingModal;