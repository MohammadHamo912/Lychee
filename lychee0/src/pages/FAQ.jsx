import React, { useState } from "react";
import "../PagesCss/FAQ.css";
import NavBar from "../components/NavBar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const faqs = [
    {
        question: "How do I create an account?",
        answer: "Click on the Sign-Up button on the top right, fill in your details, and you’ll be ready to go!"
    },
    {
        question: "Can I compare prices between shops?",
        answer: "Yes! Just click on a product and you’ll see all available prices from different shops in one place."
    },
    {
        question: "What should I do if I forgot my password?",
        answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your email."
    },
    {
        question: "How do I contact customer support?",
        answer: "Go to our Contact & Support page and use the form, email, or phone number listed."
    },
    {
        question: "Is live chat available?",
        answer: "Live chat is coming soon! For now, please reach us via email or the contact form."
    }
];

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAnswer = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div>
            <NavBar />
            <div className="faq-container">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div key={index} className="faq-item" onClick={() => toggleAnswer(index)}>
                            <div className="faq-question">
                                <h4>{faq.question}</h4>
                                <FontAwesomeIcon
                                    icon={activeIndex === index ? faMinus : faPlus}
                                    className="faq-icon"
                                />
                            </div>
                            {activeIndex === index && <p className="faq-answer">{faq.answer}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
