import React, { useState } from 'react';
import '../ComponentsCss/Reviews.css';

const Reviews = ({ reviewType }) => {
    // reviewType can be 'product' or 'shop'
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Create a new review object with a unique id and current date
        const newReview = {
            id: Date.now(),
            rating,
            comment,
            date: new Date().toLocaleDateString(),
        };
        setReviews([newReview, ...reviews]);
        // Reset the form fields
        setRating(5);
        setComment('');
    };

    return (
        <div className="reviews-container">
            <h2>Help others, Add your Review</h2>
            <form onSubmit={handleSubmit} className="review-form">
                <div className="review-rating">
                    <label htmlFor="rating">Rating:</label>
                    <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                    >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Good</option>
                        <option value={3}>3 - Average</option>
                        <option value={2}>2 - Poor</option>
                        <option value={1}>1 - Terrible</option>
                    </select>
                </div>
                <div className="review-comment">
                    <label htmlFor="comment">Review:</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={`Write your review for this ${reviewType === 'shop' ? 'store' : 'product'}...`}
                    />
                </div>
                <button type="submit" className="submit-review-btn">
                    Submit Review
                </button>
            </form>

            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <p className="no-reviews">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((rev) => (
                        <div key={rev.id} className="review-item">
                            <div className="review-header">
                                <span className="review-rating-display">Rating: {rev.rating}</span>
                                <span className="review-date">{rev.date}</span>
                            </div>
                            <p className="review-text">{rev.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reviews;
 