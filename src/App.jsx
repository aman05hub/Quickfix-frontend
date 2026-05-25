import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Services from "./pages/Services";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import MyBookings from "./pages/MyBookings";
import ProviderDashboard from "./pages/ProviderDashboard";
import Earnings from "./pages/Earnings";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ChatPage from "./pages/ChatPage";
import AddService from "./pages/addService";

function App() {
  return(
    <BrowserRouter>

      <Toaster position="top-right" />

      <Navbar />

      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/services" element={<Services/>}/>
        <Route path="/" element={<Home />}></Route>
        <Route path="/my-bookings" element={<MyBookings/>} />
        <Route path="/provider-dashboard" element={<ProviderDashboard/>}/>
        <Route path="/provider/earnings" element={<Earnings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />}/>
        <Route path="/chat/:bookingId" element={<ChatPage />} />
        <Route path="/add-service" element={<AddService />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App
