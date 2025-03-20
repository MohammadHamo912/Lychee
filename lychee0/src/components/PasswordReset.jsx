import React, { useState } from 'react';
import '../ComponentsCss/PasswordReset.css'; // You can reuse your existing Auth styles

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Requesting password reset for:', email);
        // In real project: send reset request to the backend here
        setSubmitted(true);
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                {!submitted ? (
                    <>
                        <h2>Forgot Password</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit">Reset Password</button>
                        </form>
                        <p>Remembered it? <a href="/login">Login</a></p>
                    </>
                ) : (
                    <>
                        <h2>Check your email</h2>
                        <p>If an account exists with that email, you'll receive a password reset link shortly.</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default PasswordReset;
