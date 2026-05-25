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
    });

    const [loading, setLoading] = useState(false);

    //Handle input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    //submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!form.title || !form.price){
            return toast.error("Title and price are required");
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
                title: "",
                description: "",
                price: "",
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
                    <input type="text"
                        name="title"
                        placeholder="Service Title"
                        value={form.title}
                        onChange={handleChange}
                     />

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