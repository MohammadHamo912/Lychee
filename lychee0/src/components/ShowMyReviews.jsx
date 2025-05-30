import React, { useState } from "react";
import "../ComponentsCss/ShowMyReviews.css";

const initialReviews = [
    {
        id: 1,
        product: "Lychee Lip Tint",
        rating: 4,
        review: "Loved the texture and color! Long-lasting too.",
        date: "2025-03-21",
    },
    {
        id: 2,
        product: "HydraGlow Serum",
        rating: 5,
        review: "This made my skin feel amazing! Highly recommended.",
        date: "2025-02-14",
    },
    {
        id: 3,
        product: "Rose Petal Face Mist",
        rating: 3,
        review: "Smells good but didn’t last very long.",
        date: "2025-01-10",
    },
];

const Reviews = () => {
    const [reviews, setReviews] = useState(initialReviews);

    const handleDelete = (id) => {
        const updatedReviews = reviews.filter((review) => review.id !== id);
        setReviews(updatedReviews);
    };

    return (
        <div className="reviews-container">
            <h2>My Reviews</h2>
            <div className="reviews-list">
                {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                        <div className="review-header">
                            <h4>{review.product}</h4>
                            <span className="review-date">{review.date}</span>
                        </div>
                        <div className="review-rating">
                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </div>
                        <p className="review-text">{review.review}</p>
                        <button
                            className="delete-btn"
                            onClick={() => handleDelete(review.id)}
                        >
                            Delete Review
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;
