import React, { useState } from "react";
import "../styles/SearchBar.css";

const SearchBar = ({ onSearch }) => {
	const [query, setQuery] = useState("");

	const handleSearch = (e) => {
		e.preventDefault();
		onSearch(query);
	};

	return (
		<form className="search-bar" onSubmit={handleSearch}>
			<input
				type="text"
				placeholder="Search for events..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
			/>
			<button type="submit">Search</button>
		</form>
	);
};

export default SearchBar;
