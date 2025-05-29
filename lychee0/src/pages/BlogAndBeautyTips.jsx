import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import '../PagesCss/BlogAndBeautyTips.css';
import minimalistMakeup from '../images/minimalist-makeup.jpg';
import haircare from '../images/haircare.jpeg';
import beautyTips11 from '../images/11beautytips.jpg';
import beautyAllAges from '../images/forallages.jpg';
import skincareTips from '../images/skincaretips.jpg';
import top5 from '../images/top5trends.png';

const BlogBeautyTips = () => {
    const [showForm, setShowForm] = useState(false);
    const [storeOwner, setStoreOwner] = useState(false);
    const [newTips, setNewTips] = useState([]);
    const [formTitle, setFormTitle] = useState('');
    const [formText, setFormText] = useState('');
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        setStoreOwner(localStorage.getItem("storeOwner") === "true");
    }, []);

    const featuredPost = {
        title: 'Top 5 Skincare Trends of 2025',
        image: top5,
        excerpt: 'Explore the latest buzz in skincare including fermented ingredients and skin cycling...',
        link: 'https://www.foreo.com/mysa/top-5-beauty-tech-skincare-trends-2025',
    };

    const articles = [
        {
            title: 'Minimalist Makeup: Less is More',
            image: minimalistMakeup,
            excerpt: 'Discover how to achieve a fresh, effortless glow with fewer products...',
            link: 'https://www.charlottetilbury.com/us/secrets/minimal-makeup-guide',
        },
        {
            title: 'Haircare Rituals From Around the World',
            image: haircare,
            excerpt: 'Explore traditional haircare practices from various cultures...',
            link: 'https://orlandopitaplay.com/blogs/in-the-press/',
        },
        {
            title: '11 Skincare Tips To Enhance Your Natural Beauty',
            image: beautyTips11,
            excerpt: 'Discover simple skincare practices to bring out your natural glow...',
            link: 'https://www.lorealparisusa.com/beauty-magazine/skin-care/skin-care-essentials/natural-beauty-tips',
        },
        {
            title: '7 Essential Beauty Tips For All Ages',
            image: beautyAllAges,
            excerpt: 'Learn timeless beauty tips suitable for every age...',
            link: 'https://www.vogue.com/article/essential-makeup-tips-for-all-ages',
        },
        {
            title: 'Refine Your Routine with 40+ Expert Skin Care Tips',
            image: skincareTips,
            excerpt: 'Enhance your skincare regimen with these expert-recommended tips...',
            link: 'https://www.healthline.com/health/beauty-skin-care/skin-care-tips',
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formTitle || !formText) return;
        const newTip = {
            title: formTitle,
            content: formText,
            store: "Lychee Store",
            date: new Date().toLocaleDateString(),
        };
        setNewTips(prev => [newTip, ...prev]);
        setFormTitle('');
        setFormText('');
        setShowForm(false);
    };

    return (
        <>
            <NavBar />
            <div className="blog-page">
                <div className="blog-header" style={{ backgroundImage: `url(${featuredPost.image})` }}>
                    <div className="overlay">
                        <h1>{featuredPost.title}</h1>
                        <a href={featuredPost.link} className="read-more" target="_blank" rel="noopener noreferrer">Read More →</a>
                    </div>
                </div>

                <div className="blog-content-wrapper">
                    <main className="blog-main">
                        <h2 className="blog-section-title">Beauty Articles</h2>
                        <div className="blog-grid">
                            {articles.map((article, idx) => (
                                <div className="article-card" key={idx}>
                                    <img src={article.image} alt={article.title} />
                                    <h3>{article.title}</h3>
                                    <p>{article.excerpt}</p>
                                    <a href={article.link} className="read-more" target="_blank" rel="noopener noreferrer">Read More →</a>
                                </div>
                            ))}
                        </div>

                        {newTips.length > 0 && (
                            <>
                                <h2 className="blog-section-title">Tips from Store Owners</h2>
                                <div className="store-tips-grid">
                                    {newTips.map((tip, idx) => (
                                        <div className="store-tip-card" key={idx}>
                                            <h3>{tip.title}</h3>
                                            <p>{tip.content.split(" ").slice(0, 10).join(" ")}...</p>
                                            <button className="read-more" onClick={() => setModalData(tip)}>Read More →</button>
                                        </div>
                                    ))}

                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>

            {storeOwner && (
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <button
                        onClick={() => setShowForm(true)}
                        className="add-tip-button"
                    >
                        + Add Blog Tip
                    </button>
                </div>
            )}


            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Submit a Blog Tip</h2>
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
                            <textarea placeholder="Write your tip here..." value={formText} onChange={(e) => setFormText(e.target.value)} rows={5} />
                            <button type="submit" className="submit-button">Submit</button>
                            <button type="button" onClick={() => setShowForm(false)} className="close-button">✕</button>
                        </form>
                    </div>
                </div>
            )}

            {modalData && (
                <div className="modal-overlay">
                    <div className="modal-content professional-modal">
                        <div className="modal-header">
                            <h2>{modalData.title}</h2>
                            <button onClick={() => setModalData(null)} className="close-button">
                                ✕
                            </button>
                        </div>
                        <div className="modal-details">
                            <p><span className="label">Store:</span> {modalData.store}</p>
                            <p><span className="label">Published:</span> {modalData.date}</p>
                        </div>
                        <div className="modal-body">
                            <p>{modalData.content}</p>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default BlogBeautyTips;
