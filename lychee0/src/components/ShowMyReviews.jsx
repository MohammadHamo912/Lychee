import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { deleteReview, getUserReviews } from '../api/reviews';
import "../ComponentsCss/ShowMyReviews.css";

const ShowMyReviews = () => {
    const { user } = useUser();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getUserReviews(user.userId);
                setReviews(data);
            } catch (err) {
                console.error("Error loading user reviews:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.userId) fetchReviews();
    }, [user]);

    const handleDelete = async (id) => {
        try {
            await deleteReview(id);
            const updated = await getUserReviews(user.userId);
            setReviews(updated);
        } catch (err) {
            console.error("Failed to delete review:", err);
        }
    };

    return (
        <div className="reviews-container">
            <h2>My Reviews</h2>
            {loading ? (
                <p>Loading...</p>
            ) : reviews.length === 0 ? (
                <p>You haven't posted any reviews yet.</p>
            ) : (
                <div className="reviews-list">
                    {reviews.map((review) => (
                        <div key={review.reviewId} className="review-card">
                            <div className="review-header">
                                <h4>{review.targetName || (review.reviewType === "shop" ? `Shop #${review.targetId}` : `Product #${review.targetId}`)}</h4>
                                <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="review-rating">
                                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                            </div>
                            <p className="review-text">{review.comment}</p>
                            <button className="delete-btn" onClick={() => handleDelete(review.reviewId)}>
                                Delete Review
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShowMyReviews;
