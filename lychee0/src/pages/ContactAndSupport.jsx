import React, { useState } from "react";
import "../PagesCss/ContactAndSupport.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPhoneAlt,
    faEnvelope,
    faQuestionCircle,
    faComments
} from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar.jsx";

const ContactAndSupport = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div>
            <NavBar />

            <div className="contact-us-page">
                <div className="top-contact-info">

                    <div
                        className="contact-card clickable"
                        onClick={() => window.location.href = "/faq"}
                    >
                        <FontAwesomeIcon icon={faQuestionCircle} className="icon" />
                        <h4>FAQ</h4>
                        <p>Find our most asked questions</p>
                    </div>

                    <div className="contact-card">
                        <FontAwesomeIcon icon={faPhoneAlt} className="icon" />
                        <h4>PHONE NUMBER</h4>
                        <p>234-9876-5400</p>
                    </div>

                    <div className="contact-card">
                        <FontAwesomeIcon icon={faComments} className="icon" />
                        <h4>LIVE CHAT</h4>
                        <p className="pulse">Coming Soon</p>
                    </div>

                    <a href="mailto:hello@theme.com" className="email-card-wrapper">
                        <div className="contact-card">
                            <FontAwesomeIcon icon={faEnvelope} className="icon" />
                            <h4>EMAIL</h4>
                            <p>hello@theme.com</p>
                        </div>
                    </a>

                </div>

                <div className="contact-form">
                    <h2>Contact Us</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input type="text" required placeholder=" " />
                            <label>Name</label>
                        </div>
                        <div className="form-group">
                            <input type="email" required placeholder=" " />
                            <label>Email</label>
                        </div>
                        <div className="form-group">
                            <textarea rows="5" required placeholder=" "></textarea>
                            <label>Message</label>
                        </div>
                        <button type="submit">SUBMIT</button>
                    </form>
                    {submitted && <p className="success-message">Message sent! Thank you 💌</p>}
                </div>
            </div>
        </div>
    );
};

export default ContactAndSupport;
