import React from 'react';
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


    return (
        <>
            <NavBar />

            <div className="blog-page">
                <div className="blog-header" style={{ backgroundImage: `url(${featuredPost.image})` }}>
                    <div className="overlay">
                        <h1>{featuredPost.title}</h1>
                        <a
                            href={featuredPost.link}
                            className="read-more"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Read More →
                        </a>
                    </div>
                </div>

                <div className="blog-content-wrapper">
                    <main className="blog-main">
                        <div className="blog-grid">
                            {articles.map((article, idx) => (
                                <div className="article-card" key={idx}>
                                    <img src={article.image} alt={article.title} />
                                    <h3>{article.title}</h3>
                                    <p>{article.excerpt}</p>
                                    <a
                                        href={article.link}
                                        className="read-more"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Read More →
                                    </a>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default BlogBeautyTips;
