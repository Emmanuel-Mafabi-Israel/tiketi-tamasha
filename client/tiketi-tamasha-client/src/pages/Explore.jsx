/*
    GLORY BE TO GOD,
    TIKETI TAMASHA,
    SEARCH PAGE AND EXPLORE PAGE,

    BY ISRAEL MAFABI EMMANUEL
*/

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import tiketi_tamasha_lens from "../assets/tiketi-tamasha-lens.svg";
import doodle_background from '../assets/tamasha_doodle_background.svg';
import Button from "../components/Button";
import EventCard from "../components/EventCard";
import EventDetails from "./EventDetails";
import { searchEvents } from "../api/eventService";

export default function Explore() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState(searchParams.get('q') || "");
    const searchTerm = searchParams.get('q') || "";
    const filterTerm = searchParams.get('filter') || "";
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEvents, setTotalEvents] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { user } = useContext(AuthContext); // we'll utilize in seeing if we have a user logged in...

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchTerm) {
                setLoading(true);
                setError(null);
                setSearchResults([]); // Clear previous results here

                // Add a slight delay before fetching results
                const delayTimeout = setTimeout(async () => {
                    try {
                        const data = await searchEvents(searchTerm, currentPage, 10);
                        let filteredResults = data.events;

                        if (filterTerm) {
                            filteredResults = filteredResults.filter(event => event.category === filterTerm);
                        }

                        setSearchResults(filteredResults);
                        setTotalPages(data.total_pages);
                        setCurrentPage(data.current_page);
                        setTotalEvents(data.total_events);
                    } catch (err) {
                        setError(err.message || "Failed to fetch search results.");
                        setSearchResults([]);
                        setTotalPages(1);
                        setCurrentPage(1);
                        setTotalEvents(0);
                    } finally {
                        setLoading(false);
                    }
                }, 500); // a 500ms break -> just to give the user a visual break...

                // Clear the timeout if the component unmounts or searchTerm changes again
                return () => clearTimeout(delayTimeout);
            } else {
                setSearchResults([]);
                setTotalPages(1);
                setCurrentPage(1);
                setTotalEvents(0);
            }
        };

        fetchSearchResults();
    }, [searchTerm, currentPage, filterTerm]);

    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        if (event.key === 'Enter' || event.type === 'click') {
            setSearchParams({ q: searchInput, filter: filterTerm });
            navigate(`/explore?q=${searchInput}&filter=${filterTerm}`);
            setCurrentPage(1);
        }
    };

    const handleFilterChange = (newFilterTerm) => {
        setSearchParams({ q: searchInput, filter: newFilterTerm });
        navigate(`/explore?q=${searchInput}&filter=${newFilterTerm}`);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        localStorage.setItem('exploreSelectedEvent', JSON.stringify(event));
    };

    const handleCloseDialog = () => {
        setSelectedEvent(null);
        localStorage.removeItem('exploreSelectedEvent');
    };

    return (
        <div className="tiketi-tamasha-explore-page">
            <img className='tiketi-tamasha-doodle-background' src={doodle_background} alt="tamasha-doodle" />
            <div className="tiketi-tamasha-section explore">
                <div className="search-bar">
                    <input
                        type="text"
                        name="text"
                        className="tiketi-tamasha-input"
                        placeholder="Search for events"
                        value={searchInput}
                        onChange={handleInputChange}
                        onKeyDown={handleSearchSubmit}
                        required
                    />
                    <img src={tiketi_tamasha_lens} alt="search-icon" onClick={handleSearchSubmit} />
                </div>
                <div className="sections">
                    <div className="tiketi-tamasha-explore-page-section-a">
                        <div className="section-title">Category Filter</div>
                        <div className="cta">
                            <Button
                                className={`tiketi-tamasha-filters ${filterTerm === "Conservation" ? "underline" : ""}`}
                                buttonText="Conservation"
                                onClick={() => handleFilterChange("Conservation")}
                            />
                            <Button
                                className={`tiketi-tamasha-filters ${filterTerm === "Finance" ? "underline" : ""}`}
                                buttonText="Finance"
                                onClick={() => handleFilterChange("Finance")}
                            />
                            <Button
                                className={`tiketi-tamasha-filters ${filterTerm === "Fitness" ? "underline" : ""}`}
                                buttonText="Fitness"
                                onClick={() => handleFilterChange("Fitness")}
                            />
                            <Button
                                className={`tiketi-tamasha-filters ${filterTerm === "Music" ? "underline" : ""}`}
                                buttonText="Music"
                                onClick={() => handleFilterChange("Music")}
                            />
                            <Button
                                className={`tiketi-tamasha-filters ${filterTerm === "Research" ? "underline" : ""}`}
                                buttonText="Research"
                                onClick={() => handleFilterChange("Research")}
                            />
                            <Button
                                className={`tiketi-tamasha-filters ${filterTerm === "Wellness" ? "underline" : ""}`}
                                buttonText="Wellness"
                                onClick={() => handleFilterChange("Wellness")}
                            />
                        </div>
                    </div>
                    <div className="tiketi-tamasha-explore-page-section-b">
                        <div className="section-title">
                            <div className="title">
                                Search Results &nbsp;
                                {totalEvents > 0 && (
                                    <span>Page {currentPage} of {totalPages} ({totalEvents} results)</span>
                                )}
                            </div>
                            <div className="cta">
                                <div className="action" onClick={handlePreviousPage} disabled={currentPage === 1}>
                                    previous
                                </div>
                                <div className="action" onClick={handleNextPage} disabled={currentPage === totalPages}>
                                    next
                                </div>
                            </div>
                        </div>
                        <div className="result-body">
                            {loading && (
                                <div className="loading">
                                    <div className="tiketi-tamasha-loading-screen">
                                        <div className="row">
                                            <div className="circle"></div>
                                            <div className="circle"></div>
                                        </div>
                                        <div className="row">
                                            <div className="circle"></div>
                                            <div className="circle"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {error && <p className="error-message">{error}</p>}
                            {searchResults.map((event) => (
                                <div className="result" key={event.id} onClick={() => handleEventClick(event)}>
                                    <EventCard
                                        className="tiketi-tamasha-event-card explore"
                                        cardImage={event.image_url}
                                        cardTitle={event.title}
                                        cardTime={event.time}
                                        cardLocation={event.location}
                                    />
                                    <div className="event-description">
                                        {event.description}
                                    </div>
                                </div>
                            ))}
                            {searchResults.length === 0 && searchTerm && !loading && !error && (
                                <p className="no-result">No results found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {selectedEvent && (
                <EventDetails 
                    eventId={selectedEvent.id}
                    onClose={handleCloseDialog}
                    flag={user ? "signed" : "unsigned"}
                    user={user ? user : null}
                />
            )}
        </div>
    );
};