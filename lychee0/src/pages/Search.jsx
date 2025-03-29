import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import FiltersPanel from "../components/FiltersPanel";
import ProductCard from "../components/ProductCard";
import dummyProducts from "../Data/dummyProducts";
import Footer from "../components/Footer";
import "../PagesCss/Search.css";

const SearchPage = () => {
    const location = useLocation();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const queryParam = searchParams.get("query");

        if (queryParam) {
            setQuery(queryParam);
            performSearch(queryParam);
        } else {
            setQuery("");
            setResults([]);
            setFilteredResults([]);
        }
    }, [location.search]);

    const performSearch = (term) => {
        setLoading(true);
        const filtered = dummyProducts.filter((item) =>
            item.name?.toLowerCase().includes(term.toLowerCase())
        );
        setResults(filtered);
        setFilteredResults(filtered);
        setLoading(false);
    };

    const applyFilters = (filters) => {
        let updated = [...results];

        if (filters.category && filters.category !== "all") {
            updated = updated.filter((item) => item.category === filters.category);
        }

        if (filters.minPrice) {
            updated = updated.filter((item) => item.price >= parseFloat(filters.minPrice));
        }

        if (filters.maxPrice) {
            updated = updated.filter((item) => item.price <= parseFloat(filters.maxPrice));
        }

        switch (filters.sortOption) {
            case "priceLowToHigh":
                updated.sort((a, b) => a.price - b.price);
                break;
            case "priceHighToLow":
                updated.sort((a, b) => b.price - a.price);
                break;
            case "nameAZ":
                updated.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        setFilteredResults(updated);
    };

    return (
        <div className="search-page">
            <NavBar />

            <main className="search-main-content">
                {/* Header */}
                <div className="search-container">
                    <div className="search-header-text">
                        <h1>Search Lychee</h1>
                        <p className="subtitle">Find products & stores you’ll love 💄</p>
                    </div>
                    <SearchBar />
                </div>

                {/* Filters + Results Layout */}
                <div className="search-layout">
                    {query && results.length > 0 && (
                        <div className="filters-wrapper">
                            <FiltersPanel onApplyFilters={applyFilters} />
                        </div>
                    )}

                    <div className="search-results-section">
                        {loading && <p className="loading-text">Searching...</p>}

                        {!loading && !query && (
                            <p className="info-message">Start typing above to find something!</p>
                        )}

                        {!loading && query && filteredResults.length > 0 && (
                            <>
                                <div className="results-header">
                                    <h3>
                                        Results for "<span className="highlight">{query}</span>"
                                    </h3>
                                    <p className="results-count">
                                        {filteredResults.length} result
                                        {filteredResults.length !== 1 && "s"} found
                                    </p>
                                </div>

                                <div className="product-grid">
                                    {filteredResults.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </>
                        )}

                        {!loading && query && filteredResults.length === 0 && (
                            <div className="no-results">
                                <p>
                                    No results found for "<strong>{query}</strong>" 😢
                                </p>
                                <p>Try different filters or search terms.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SearchPage;
