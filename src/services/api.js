import axios from "axios";

const API = axios.create({
    baseURL: "https://quickfix-backend-production.up.railway.app/api"
});

//Automatically sends token
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token){
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;