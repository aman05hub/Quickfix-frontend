import React,{ useEffect, useState } from "react";
import API from "../services/api";
import { serviceIcons } from "../utils/serviceIcons";
import "../styles/Services.css";
import BookingModal from "../components/BookingModal";

const Services = () => {

    const Icon = serviceIcons[service.serviceType];
    const [services, setServices] = useState([]);
    const [selectedService, setSelectService] = useState(null);
    const [message, setMessage] = useState("")

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const {data} = await API.get("/services");
                setServices(data)
            } catch (err) {
                console.log(err)
            }
        };

        fetchServices();
    }, [])

    const handlePayment = async (service) => {
        try {
            //Create order
            const { data } = await API.post("/payment/create-order", {
                amount: service.price
            });

            //Razorpay options
            const options = {
                key: "rzp_test_SX3VcRByLnbH2h",
                amount: data.amount,
                currency: "INR",
                order_id: data.id,

                handler: function (response){
                    setMessage("Payment Successful ✅");

                    setTimeout(() => {
                        setMessage("")
                    }, 3000);
                }
            };

            //Open Razorpay
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch(err){
            setMessage("Payment Failed ❌");

            setTimeout(() => {
                setMessage("");
            }, 3000);
        }
    };
   
    const getServiceIcon = (serviceType) => {
        const Icon = serviceIcons[serviceType];
        return Icon ? <Icon /> : "🛠️";
    }

    return (
        <div className="services-page">
            <h1 className="title">Available Services</h1>

            {message && <div className="payment-msg">{message}</div> }

            <div className="services-grid">
                {services.map((service) => (
                    <div className="service-card" key={service._id}>
                        <div className="service-icon">
                            {getServiceIcon(service.serviceType)}
                        </div>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                        <p><b>₹{service.price}</b></p>

                        

                        <button 
                            className="book-btn" 
                            onClick={() => setSelectService(service._id)}
                        >
                            Book Now
                        </button>

                    </div>
                ))}
            </div>
            {
                selectedService && ( 
                    <BookingModal 
                        serviceId={selectedService}
                        closeModal={() => setSelectService(null)}
                    />
                )
            }
        </div>
    );
};

export default Services;