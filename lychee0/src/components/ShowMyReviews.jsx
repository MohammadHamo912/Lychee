import React, { useEffect, useState } from "react";
import { getUserReviews, deleteReview } from "../api/reviews";
import { useUser } from "../context/UserContext"; // ✅ Assuming you're using context
import "../ComponentsCss/ShowMyReviews.css";

const Reviews = () => {
    const { user } = useUser();
    const userId = user?.userId;

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            console.warn("User ID is undefined. Cannot fetch reviews.");
            return;
        }

        const fetchReviews = async () => {
            try {
                const data = await getUserReviews(userId);
                setReviews(data);
            } catch (err) {
                console.error("Error loading user reviews", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [userId]);

    const handleDelete = async (reviewId) => {
        try {
            await deleteReview(reviewId);
            setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
        } catch (err) {
            console.error("Error deleting review", err);
        }
    };

    if (loading) return <p>Loading reviews...</p>;

    return (
        <div className="reviews-container">
            <h2>My Reviews</h2>
            {reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                <div className="reviews-list">
                    {reviews.map((review) => (
                        <div key={review.reviewId} className="review-card">
                            <div className="review-header">
                                <h4>{review.targetName || "Unnamed Product/Shop"}</h4>
                                <span className="review-date">
                                    {review.createdAt?.slice(0, 10)}
                                </span>
                            </div>
                            <div className="review-rating">
                                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                            </div>
                            <p className="review-text">{review.comment}</p>
                            <button
                                className="delete-btn"
                                onClick={() => handleDelete(review.reviewId)}
                            >
                                Delete Review
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reviews;
