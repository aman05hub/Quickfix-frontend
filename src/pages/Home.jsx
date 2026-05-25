import React, { useEffect, useRef } from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import {
  FaBolt, FaTools, FaBroom, FaSnowflake,
  FaShieldAlt, FaClock, FaStar, FaCheckCircle,
  FaArrowRight, FaSearch
} from "react-icons/fa";

const services = [
  { icon: <FaBolt />,       title: "Electrician", desc: "Fan repair, wiring, switch fixing and more.", color: "#f59e0b" },
  { icon: <FaTools />,      title: "Plumber",     desc: "Pipe leakage, tap repair, bathroom fittings.", color: "#3b82f6" },
  { icon: <FaBroom />,      title: "Cleaning",    desc: "Home cleaning, kitchen & deep cleaning.",     color: "#10b981" },
  { icon: <FaSnowflake />,  title: "AC Service",  desc: "AC repair, gas refill, installation.",        color: "#6366f1" },
];

const steps = [
  { num: "01", title: "Choose Service", desc: "Browse and select the service you need from our list." },
  { num: "02", title: "Book a Slot",    desc: "Pick your preferred date and time that suits you." },
  { num: "03", title: "Get it Done",    desc: "A verified professional arrives at your doorstep." },
];

const whys = [
  { icon: <FaShieldAlt />,   title: "Verified Professionals", desc: "Every provider is background-checked and trained." },
  { icon: <FaStar />,        title: "Top Rated Service",      desc: "Thousands of 5-star reviews from happy customers." },
  { icon: <FaClock />,       title: "Fast Booking",           desc: "Book in under 60 seconds, anytime anywhere." },
  { icon: <FaCheckCircle />, title: "Affordable Pricing",     desc: "Transparent prices with zero hidden charges." },
];

const Home = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home">

      <section className="hero">
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        <div className="container hero-content">
          <div className="hero-left">
            <span className="hero-badge">
              <FaCheckCircle style={{ color: "#4f46e5" }} /> Trusted by 10,000+ customers
            </span>

            <h1>
              Book Trusted<br />
              <span className="gradient-text">Local Services</span><br />
              Instantly
            </h1>

            <p className="hero-subtext">
              Find electricians, plumbers, cleaners and more — right near you.
              Fast, verified, and affordable.
            </p>

            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Search: electrician, plumber, cleaner…" />
              <button>Search</button>
            </div>

            <div className="hero-buttons">
              <Link to="/services" className="primary-btn">
                Explore Services <FaArrowRight style={{ fontSize: 13 }} />
              </Link>
              <Link to="/register" className="secondary-btn">
                Get Started Free
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat"><strong>500+</strong><span>Providers</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>4.9★</strong><span>Avg Rating</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>10k+</strong><span>Bookings</span></div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-img-wrap">
              <img src="/service.svg" alt="QuickFix Services" />
              <div className="floating-card card-top">
                <FaCheckCircle color="#10b981" />
                <span>Booking Confirmed!</span>
              </div>
              <div className="floating-card card-bottom">
                <FaStar color="#f59e0b" />
                <span>4.9 · Excellent</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">What We Offer</span>
            <h2>Our Services</h2>
            <p>Professional help for every home need, just a tap away.</p>
          </div>
          <div className="services-grid">
            {services.map((s, i) => (
              <div className="service-card reveal" key={i} style={{ "--delay": `${i * 0.1}s`, "--accent": s.color }}>
                <div className="service-icon-wrap">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="service-rating">⭐⭐⭐⭐☆ <span>4.0</span></div>
                <Link to="/services" className="service-link">
                  Book Now <FaArrowRight style={{ fontSize: 11 }} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Simple Process</span>
            <h2>How It Works</h2>
            <p>Get your service booked in three easy steps.</p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div className="step-card reveal" key={i} style={{ "--delay": `${i * 0.12}s` }}>
                <div className="step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Our Promise</span>
            <h2>Why Choose QuickFix</h2>
            <p>We make home services simple, safe and reliable.</p>
          </div>
          <div className="why-grid">
            {whys.map((w, i) => (
              <div className="why-card reveal" key={i} style={{ "--delay": `${i * 0.1}s` }}>
                <div className="why-icon">{w.icon}</div>
                <div>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner reveal">
          <h2>Ready to get your home fixed?</h2>
          <p>Join thousands of happy customers using QuickFix every day.</p>
          <Link to="/register" className="primary-btn">
            Book a Service Now <FaArrowRight style={{ fontSize: 13 }} />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;