import React, { useEffect, useState } from 'react';
import '../ComponentsCss/StoreReviewAndSocial.css';
import { getStoreReviews } from '../api/stores';

const StoreReviewAndSocial = ({ store_id }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!store_id) return;

            try {
                const data = await getStoreReviews(store_id);
                setReviews(data);
            } catch (err) {
                setError('Failed to load reviews.');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [store_id]);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentReviews = reviews.filter((review) => {
        const reviewDate = new Date(review.date);
        return reviewDate >= oneWeekAgo;
    });

    return (
        <div className="store-panel-container">
            <div className="reviews-section">
                <h2>Customer Reviews</h2>
                {loading ? (
                    <p>Loading reviews...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : recentReviews.length === 0 ? (
                    <p className="no-reviews">No reviews in the last week.</p>
                ) : (
                    recentReviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <h4>{review.storeName}</h4>
                            <div className="rating">
                                {'★'.repeat(review.rating)}
                                {'☆'.repeat(5 - review.rating)}
                            </div>
                            <p className="comment">"{review.comment}"</p>
                            /*<p className="meta">– {review.customer} | {review.date}</p>*/
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StoreReviewAndSocial;
