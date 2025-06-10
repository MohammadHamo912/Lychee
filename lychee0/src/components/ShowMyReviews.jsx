import React, { useEffect, useState } from "react";
import { getUserReviews, deleteReview } from "../api/reviews";
import { getProductById } from "../api/products";
import { getStoreById } from "../api/stores";
import { useUser } from "../context/UserContext";
import "../ComponentsCss/ShowMyReviews.css";

const Reviews = () => {
  const { user } = useUser();
  const userId = user?.userId || user?.id || user?.user_id;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.warn("User ID is undefined. Cannot fetch reviews.");
      return;
    }

    const fetchReviews = async () => {
      try {
        const rawData = await getUserReviews(userId);

        const data = rawData.map((review) => ({
          reviewId: review.review_id,
          reviewType: review.review_type,
          targetId: review.target_id,
          userId: review.user_id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.created_at,
        }));

        const reviewsWithNames = await Promise.all(
          data.map(async (review) => {
            let targetName = "Unknown";

            try {
              if (review.reviewType === "product") {
                const rawProduct = await getProductById(review.targetId);
                const product = {
                  ...rawProduct,
                  name: rawProduct.name,
                  imageUrl: rawProduct.image_url,
                  createdAt: rawProduct.created_at,
                  updatedAt: rawProduct.updated_at,
                  // Add other fields as needed
                };
                targetName = product?.name || "Unknown Product";

              } else if (review.reviewType === "shop") {
                const rawStore = await getStoreById(review.targetId);
                const store = {
                  ...rawStore,
                  name: rawStore.name,
                  imageUrl: rawStore.image_url,
                  createdAt: rawStore.created_at,
                  updatedAt: rawStore.updated_at,
                  // Add other fields as needed
                };
                targetName = store?.name || "Unknown Store";
              }
            } catch (err) {
              console.error(`Error fetching ${review.reviewType} details:`, err);
            }

            return {
              ...review,
              targetName,
            };
          })
        );

        setReviews(reviewsWithNames);
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
                <h4>{review.targetName}</h4>
                <span className="review-type">
                  {review.reviewType === "product" ? "Product" : "Store"} Review
                </span>
                <span className="review-date">
                  {review.createdAt?.slice(0, 10)}
                </span>
              </div>
              <div className="review-rating">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
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
