import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ComponentsCss/SearchBar.css"; // Adjust path if needed

const SearchBar = ({
  suggestions = [],
  placeholder = "Search...",
  disableActive = false,
}) => {
  const [input, setInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (!disableActive && value.length > 0) {
      const filtered = suggestions.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (value) => {
    setInput(value);
    setShowSuggestions(false);
    navigate(`/search?query=${encodeURIComponent(value)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate(`/search?query=${encodeURIComponent(input.trim())}`);
    }
  };

  return (
    <div className={`search-bar-wrapper ${disableActive ? "disabled" : ""}`}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={handleChange}
          className="search-input"
          disabled={disableActive}
        />
        <button type="submit" className="search-button" disabled={disableActive}>
          🔍
        </button>
      </form>

      {!disableActive && showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="search-suggestions">
          {filteredSuggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSelect(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
