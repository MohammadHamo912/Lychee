import React from 'react';
import '../ComponentsCss/PaymentSuccess.css';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
    return (
        <div className="payment-success-container">
            <div className="payment-success-box">
                <svg xmlns="http://www.w3.org/2000/svg" className="success-icon" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M9 12l2 2 4-4"
                        stroke="#8B3C5D"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="9" stroke="#8B3C5D" strokeWidth="2" />
                </svg>

                <h1>Payment Successful!</h1>
                <p>Thank you for your purchase. A confirmation email has been sent to your inbox.</p>

                <Link to="/shops" className="success-btn">Continue Shopping</Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
