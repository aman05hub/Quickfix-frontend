import React from "react";
import "../styles/BookingTimeline.css";

const BookingTimeline = ({ status, paymentStatus }) => {

    const steps = ["Booked","Paid","Accepted","On Way","Completed"];

    const getCurrentStep = () => {

        //Payment done
        if(paymentStatus === "paid" && status === "pending") return 1;
        
        //Booked
        if(status === "pending") return 0;

        //Accepted after payment
        if(status === "accepted") return 2;

        //On the way
        if(status === "on way") return 3;

        //Completed
        if(status === "completed") return 4;

        return 0;
    }

    const currentStep = getCurrentStep();

    const progressWidth = (currentStep / (steps.length - 1)) * 90;

    return(

        <div className="timeline">

            <div className="timeline-line"></div>

            <div className="timeline-progress" style={{ width: `${progressWidth}%` }}></div>

            <div className="timeline-steps">

                {steps.map((step,index) => (

                    <div 
                    key={index} 
                    className={`timeline-step ${
                        index <= currentStep ? "active" : ""
                    }`}>

                        <div className="circle">
                            {index === 0 && "📦"}
                            {index === 1 && "💳"}
                            {index === 2 && "🤝"}
                            {index === 3 && "🚚"}
                            {index === 4 && "🎉"}
                        </div>

                        <span>{step}</span>
                    </div>
                    ))}
            </div>

            {paymentStatus !== "paid" && (
                <div className="unpaid-tag">💰 Payment Pending</div>
            )}

            {paymentStatus === "paid" && (
                <div className="paid-tag">💳 Paid</div>
            )}
        </div>
    )
}

export default BookingTimeline;