import React, { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/AddService.css";

const AddService = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        serviceType: ""
    });

    const [loading, setLoading] = useState(false);

    //Handle input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    //submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!form.price || !form.serviceType){
            return toast.error("All fields are required");
        }

        try{
            setLoading(true);

            await API.post("/services",{
                ...form,
                category: user.profession,
            })

            toast.success("Service added successfully");

            //Reset form
            setForm({
                description: "",
                price: "",
                serviceType: ""
            });
        } catch(err){
            toast.error(err.response?.data?.message || "Error adding service");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="add-service-page">
            <div className="add-service-card">

                <h2>Add New Service</h2>

                <form onSubmit={handleSubmit}>

                    {/* Title */}
                    <select
                        name="serviceType"
                        value={form.serviceType}
                        onChange={handleChange}
                    >

                     <option value="">Select Service Type</option>

                    <option value="AC Cleaning">AC Cleaning</option>
                    <option value="AC Repair">AC Repair</option>
                    <option value="Fan Repair">Fan Repair</option>
                    <option value="Laptop Repair">Laptop Repair</option>
                    <option value="Mobile Repair">Mobile Repair</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Painter">Painter</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Home Cleaning">Home Cleaning</option>
                    <option value="Water Purifier">Water Purifier</option>
                    <option value="TV Repair">TV Repair</option>
                    <option value="Washing Machine Repair">Washing Machine Repair</option>
                    <option value="Refrigerator Repair">Refrigerator Repair</option>
                </select>

                    {/* Description */}
                     <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                     />

                    {/* Price */}
                    <input 
                    type="number"
                    name="price"
                    placeholder="price ₹"
                    value={form.price}
                    onChange={handleChange}
                    />

                    {/* Category */}
                    <div className="category-box">
                        Category: <b>{user?.profession}</b>
                    </div>

                    {/*Button */}
                    <button type="submit" disabled={loading}>
                        {loading ? "Adding..." : "Add Service"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddService;