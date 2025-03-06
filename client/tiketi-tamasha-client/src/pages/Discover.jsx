/*
    GLORY BE TO GOD,
    TIKETI TAMASHA,
    DISCOVER PAGE,

    BY ISRAEL MAFABI EMMANUEL
*/

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getEventCategoryCount, getPopularEvents } from "../api/eventService";

import EventCard from "../components/EventCard";
import DiscoverCard from "../components/DiscoverCard";
import EventDetails from "./EventDetails";
import "../styles/Discover.css";
import doodle_background from '../assets/tamasha_doodle_background.svg';
import research from '../assets/tiketi-tamasha-science.svg';
import conserve from '../assets/tiketi-tamasha-earth.svg';
import fitness from '../assets/tiketi-tamasha-run.svg';
import wellness from '../assets/tiketi-tamasha-wellness.svg';
import finance from '../assets/tiketi-tamasha-finance.svg';
import music from '../assets/tiketi-tamasha-doodle-microphone.svg';
import LoadingPage from "../components/LoadingPage";

export default function Discover() {
    const { user, refreshUserData } = useContext(AuthContext); // Get refreshUserData from context
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [categoryCounts, setCategoryCounts] = useState({
        Research: 0,
        Conserve: 0,
        Fitness: 0,
        Wellness: 0,
        Finance: 0,
        Music: 0,
    });
    const [popularEvents, setPopularEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoryCounts = async () => {
            try {
                const researchCount = await getEventCategoryCount("Research");
                const conserveCount = await getEventCategoryCount("Conserve");
                const fitnessCount = await getEventCategoryCount("Fitness");
                const wellnessCount = await getEventCategoryCount("Wellness");
                const financeCount = await getEventCategoryCount("Finance");
                const musicCount = await getEventCategoryCount("Music");

                setCategoryCounts({
                    Research: researchCount,
                    Conserve: conserveCount,
                    Fitness: fitnessCount,
                    Wellness: wellnessCount,
                    Finance: financeCount,
                    Music: musicCount,
                });
            } catch (error) {
                console.error("Error fetching category counts:", error);
            }
        };

        const fetchPopularEvents = async () => {
            try {
                const events = await getPopularEvents();
                setPopularEvents(events);
            } catch (error) {
                console.error("Error fetching popular events:", error);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            try {
                await Promise.all([fetchCategoryCounts(), fetchPopularEvents()]);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const savedEvent = localStorage.getItem('selectedEvent');
        if (savedEvent) {
            setSelectedEvent(JSON.parse(savedEvent));
        }
    }, []);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        localStorage.setItem('selectedEvent', JSON.stringify(event));
    };

    const handleCloseDialog = () => {
        setSelectedEvent(null);
        localStorage.removeItem('selectedEvent');
    };

    const handlePurchaseSuccess = async () => {
        handleCloseDialog();
        setLoading(true); //start loading.
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay - just to allow Safaricom to respond.
        await refreshUserData(); // Refresh user data after the delay.
        setLoading(false); //stop loading.
    };

    return (
        <>
            {loading && <LoadingPage />}
            <div className="tiketi-tamasha-explore-page">
                <img className='tiketi-tamasha-doodle-background' src={doodle_background} alt="tamasha-doodle" />
                <div className="tiketi-tamasha-section">
                    <div className="section-browse-title">Browse By Category</div>
                    <div className="section-elements">
                        <DiscoverCard
                            cardImage={research}
                            cardTitle="Research"
                            cardCount={`${categoryCounts.Research} Events`}
                            onClick={() => navigate("/explore?q=Research")}
                        />
                        <DiscoverCard
                            cardImage={conserve}
                            cardTitle="Conserve"
                            cardCount={`${categoryCounts.Conserve} Events`}
                            onClick={() => navigate("/explore?q=Conserve")}
                        />
                        <DiscoverCard
                            cardImage={fitness}
                            cardTitle="Fitness"
                            cardCount={`${categoryCounts.Fitness} Events`}
                            onClick={() => navigate("/explore?q=Fitness")}
                        />
                        <DiscoverCard
                            cardImage={wellness}
                            cardTitle="Wellness"
                            cardCount={`${categoryCounts.Wellness} Events`}
                            onClick={() => navigate("/explore?q=Wellness")}
                        />
                        <DiscoverCard
                            cardImage={finance}
                            cardTitle="Finance"
                            cardCount={`${categoryCounts.Finance} Events`}
                            onClick={() => navigate("/explore?q=Finance")}
                        />
                        <DiscoverCard
                            cardImage={music}
                            cardTitle="Music"
                            cardCount={`${categoryCounts.Music} Events`}
                            onClick={() => navigate("/explore?q=Music")}
                        />
                    </div>
                </div>
                <div className="tiketi-tamasha-section">
                    <div className="section-browse-title">Randomized</div>
                    <div className="section-elements">
                        {popularEvents.map(event => (
                            <EventCard
                                key={event.id}
                                cardImage={event.image_url}
                                cardTitle={event.title}
                                cardTime={new Date(event.start_date).toLocaleString()}
                                cardLocation={event.location}
                                onClick={() => handleEventClick(event)}
                            />
                        ))}
                    </div>
                </div>
                {selectedEvent && (
                    <EventDetails
                        eventId={selectedEvent.id}
                        onClose={handleCloseDialog}
                        flag={user ? "signed" : "unsigned"}
                        user={user ? user : null}
                        onPurchaseSuccess={handlePurchaseSuccess} // Pass the callback
                    />
                )}
            </div>
        </>
    );
}