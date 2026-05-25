import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Earnings.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Earnings = () => {
    const [bookings, setBookings] = useState([]);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try{
            const { data } = await API.get("/bookings/provider");
            setBookings(data);
        } catch (err) {
            console.log(err);
        }
    };

    const filterBookings = () => {
        const now = new Date();

        return bookings.filter(b => {
            if(b.status !== "completed" || b.paymentStatus !== "paid" ) return false;

            const bookingDate = new Date(b.date + "T00:00:00");

            if(filter === "today"){
                return bookingDate.toDateString() === now.toDateString();
            }

            if(filter === "week"){
                const weekAgo = new Date();
                weekAgo.setDate(now.getDate() - 7);
                return bookingDate >= weekAgo;
            }

            if(filter === "month"){
                return(
                    bookingDate.getMonth() === now.getMonth() &&
                    bookingDate.getFullYear() === now.getFullYear()
                );
            }

            return true;
        });
    }

    const total = filterBookings()
        .reduce((sum, b) => sum + (b.price || 0), 0);

    const monthlyData = Object.values(filterBookings()
        .reduce((acc, b) => {
            const monthIndex = new Date(b.date).getMonth();

            const month = new Date(b.date).toLocaleString("default", { month: "short" });

            if (!acc[month]) {
                acc[month] = { month, earnings: 0, Index: monthIndex };
            }

            acc[month].earnings += b.price || 0;

            return acc;
        }, {})
    ).sort((a, b) => a.index - b.index );

        return (
            <div className="earnings-page">
                <h1>💰 Earnings</h1>

                <div className="filter-buttons">
                    <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
                    <button className={filter === "today" ? "active" : ""} onClick={() => setFilter("today")}>Today</button>
                    <button className={filter === "week" ? "active" : ""} onClick={() => setFilter("week")}>This Week</button>
                    <button className={filter === "month" ? "active" : ""} onClick={() => setFilter("month")}>This Month</button>
                </div>

                <div className="earnings-card">
                    Total Earnings: ₹{total}
                </div>

                <div className="chart-box">
                    <h3>Monthly Earnings</h3>

                    {monthlyData.length === 0 && (
                        <p className="no-data">No earnings data</p>
                    )}

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="earnings" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
};

export default Earnings;