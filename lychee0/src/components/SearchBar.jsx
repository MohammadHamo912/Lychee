import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "../ComponentsCss/SearchBar.css";

const SearchBar = ({ searchType = "stores", disableActive = false }) => {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!term.trim()) return;

    const path =
      searchType === "stores"
        ? `/search-stores?query=${encodeURIComponent(term)}`
        : `/search-products?query=${encodeURIComponent(term)}`;

    navigate(path);
  };

  return (
    <form
      className={`search-bar ${disableActive ? "disabled" : ""}`}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder={`Search ${searchType}...`}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button type="submit">
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBar;
