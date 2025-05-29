import React, { useState } from 'react';
import '../ComponentsCss/StoreReviewAndSocial.css';

const StoreReviewAndSocial = () => {
    const [reviews] = useState([
        {
            id: 1,
            productName: "Shimmering Rose Lip Gloss",
            rating: 4,
            comment: "Really smooth and glossy. Love the Rose tint!",
            customer: "Sarah Connor",
            date: "2024-03-01"
        },
        {
            id: 2,
            productName: "Mascara X",
            rating: 5,
            comment: "Makes lashes look amazing!",
            customer: "Jane Smith",
            date: "2024-02-27"
        },
        {
            id: 3,
            productName: "Hydrating Foundation",
            rating: 3,
            comment: "Nice coverage but a bit oily.",
            customer: "John Doe",
            date: "2024-01-10"
        }
    ]);

    const [socialLinks, setSocialLinks] = useState({
        facebook: '',
        instagram: '',
        tiktok: '',
        website: ''
    });

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setSocialLinks(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialSubmit = (e) => {
        e.preventDefault();
        alert('Social media links saved!');
        // send links to backend here
    };

    // 🔍 Filter reviews to only include those from the last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const recentReviews = reviews.filter(review => {
        const reviewDate = new Date(review.date);
        return reviewDate >= lastMonth;
    });

    return (
        <div className="store-panel-container">
            {/* 📣 Customer Reviews Section */}
            <div className="reviews-section">
                <h2>Customer Reviews</h2>
                {recentReviews.length === 0 ? (
                    <p className="no-reviews">No reviews in the last month.</p>
                ) : (
                    recentReviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <h4>{review.productName}</h4>
                            <div className="rating">
                                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                            </div>
                            <p className="comment">"{review.comment}"</p>
                            <p className="meta">– {review.customer} | {review.date}</p>
                        </div>
                    ))
                )}
            </div>

            {/* 🌐 Social Media Section */}
            <div className="social-links-section">
                <h2>Store Social Media Links</h2>
                <form className="social-form" onSubmit={handleSocialSubmit}>
                    <label>
                        Facebook:
                        <input
                            type="url"
                            name="facebook"
                            value={socialLinks.facebook}
                            onChange={handleSocialChange}
                            placeholder="https://facebook.com/yourstore"
                        />
                    </label>
                    <label>
                        Instagram:
                        <input
                            type="url"
                            name="instagram"
                            value={socialLinks.instagram}
                            onChange={handleSocialChange}
                            placeholder="https://instagram.com/yourstore"
                        />
                    </label>
                    <label>
                        TikTok:
                        <input
                            type="url"
                            name="tiktok"
                            value={socialLinks.tiktok}
                            onChange={handleSocialChange}
                            placeholder="https://tiktok.com/@yourstore"
                        />
                    </label>
                    <label>
                        Website:
                        <input
                            type="url"
                            name="website"
                            value={socialLinks.website}
                            onChange={handleSocialChange}
                            placeholder="https://yourstore.com"
                        />
                    </label>
                    <button type="submit">Save Links</button>
                </form>
            </div>
        </div>
    );
};

export default StoreReviewAndSocial;
