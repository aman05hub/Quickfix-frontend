import React, { useEffect, useState } from "react";
import API from "../services/api"

const Admin = () => {

    const [providers, setProviders] = useState([]);
    const [payments, setPayments] = useState([]);

    const fetchProviders = async () => {
        const { data } = await API.get("/admin/providers");
        setProviders(data);
    };

    useEffect(() => {
        fetchProviders();
        fetchPayments();
    }, []);

    const approve = async (id) => {
        await API.put(`/admin/approve/${id}`);
        fetchProviders();
    };

    const fetchPayments = async () => {
        const { data } = await API.get("/admin/payments");
        setPayments(data);
    };

    return (
        <div style={{ padding: "30px" }}>
            <h2>Admin Dashboard</h2>

            {providers.map(p => (
                <div key={p._id} style={{
                    background: "#1e293b",
                    padding: "15px",
                    margin: "10px",
                    borderRadius: "10px",
                    color: "white"
                }}>
                    <p>{p.name} ({p.serviceType})</p>
                    <p>Status: {p.isApproved ? "Approved" : "Pending"}</p>

                    {!p.isApproved && (
                        <button onClick={() => approve(p._id)}>
                            Approve
                        </button>
                    )}
                </div>
            ))}

            <h2>Payments</h2>

            {payments.map(p => (
                <div key={p._id} style={{
                    background: "#0f172a",
                    padding: "10px",
                    margin: "10px",
                    borderRadius: "10px",
                    color: "white"
                }}>
                    <p><b>{p.user.name}</b>({p.user.email})</p>
                    <p>Service: {p.service?.title || "N/A"}</p>
                    <p>Amount: ₹{p.price}</p>
                    <p>Payment ID: {p.paymentId}</p>
                </div>
            ))}
        </div>

    )
}

export default Admin;