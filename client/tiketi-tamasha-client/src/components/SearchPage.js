import React, { useState } from 'react';
import './SearchPage.css';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches] = useState([
    'Music festivals in San Francisco',
    'Tech conferences'
  ]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle search submission
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="search-container">
      <header className="header">
        <h1 className="logo">events</h1>
      </header>

      <main className="main-content">
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-box">
            <span className="search-icon">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="9" cy="9" r="7" fill="none" stroke="#555" strokeWidth="2" />
                <line x1="14" y1="14" x2="18" y2="18" stroke="#555" strokeWidth="2" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search for events..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </form>

        <div className="filter-container">
          <button className="filter-chip">Category</button>
          <button className="filter-chip">Location</button>
          <button className="filter-chip">Date</button>
          <button className="filter-chip">Tags</button>
        </div>

        <div className="tags-section">
          <h3 className="section-title">Popular:</h3>
          <div className="tags-container">
            <span className="tag">Music</span>
            <span className="tag">Conference</span>
            <span className="tag">Food</span>
            <span className="tag">Sports</span>
            <span className="tag">Outdoors</span>
          </div>
        </div>

        <div className="recent-searches">
          <h3 className="section-title">Recent searches:</h3>
          <ul className="searches-list">
            {recentSearches.map((search, index) => (
              <li key={index} className="search-item">{search}</li>
            ))}
          </ul>
        </div>

        <div className="trending-section">
          <h2 className="trending-title">Trending now</h2>
          <div className="trending-container">
            <div className="trending-card">
              <div className="skeleton-line-long"></div>
              <div className="skeleton-line-short"></div>
            </div>
            <div className="trending-card">
              <div className="skeleton-line-long"></div>
              <div className="skeleton-line-short"></div>
            </div>
            <div className="trending-card">
              <div className="skeleton-line-long"></div>
              <div className="skeleton-line-short"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;