import React, { useState } from "react";
import API from "../services/api";
import "../styles/PaymentModel.css";

const PaymentModel = ({ booking, closeModel, updatePayment }) => {

    const [loading,setLoading] = useState(false);
    const [success,setSuccess] = useState(false);

    const handlePayment = async () => {

        try{

            setLoading(true);
            await API.put(`/bookings/${booking._id}/pay`);
            
            updatePayment(booking._id);
            closeModel();
            setSuccess(true);

            setTimeout(() => {
                window.location.reload();
            },1500);

        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    };

    return(
        <div className="payment-overlay">

            <div className="payment-box">

                {!success ? (

                    <>
                    
                    <h2>Secure Payment</h2>

                    <p className="service-name">
                        {booking.service.title}
                    </p>

                    <p className="amount">
                        Amount: ₹{booking.service.price}
                    </p>

                    <button 
                    className="pay-btn"
                    onClick={handlePayment}
                    >
                        {loading ? "Processing..." : "Pay Now"}
                    </button>

                    <button 
                    className="cancel-btn"
                    onClick={closeModel}
                    >
                        Cancel
                    </button>
                    
                    </>

                ) : (

                    <div className="payment-success">

                        <h2>✅ Payment Successful</h2>
                        <p>Thank you for your payment</p>

                    </div>

                )}

            </div>

        </div>
    );

};

export default PaymentModel;