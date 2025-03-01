/*
    GLORY BE TO GOD,
    TIKETI TAMASHA,
    DISCOVER PAGE,

    BY ISRAEL MAFABI EMMANUEL
*/

import React, {useState} from "react";

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

import ar from '../assets/high_res/tiketi-augmented-reality.jpg';
import climate from '../assets/high_res/tiketi-climate-change.jpg';
import ai from '../assets/high_res/tiketi-innovate.jpg';

export default function Discover() {
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const handleCloseDialog = () => {
        setSelectedEvent(null)
    };

    return (
        <div className="tiketi-tamasha-explore-page">
            <img className='tiketi-tamasha-doodle-background' src={doodle_background} alt="tamasha-doodle" />
            <div className="tiketi-tamasha-section">
                <div className="section-browse-title">Browse By Category</div>
                <div className="section-elements">
                    <DiscoverCard
                        cardImage={research}
                        cardTitle="Research"
                        cardCount="1K Events"
                    />
                    <DiscoverCard
                        cardImage={conserve}
                        cardTitle="Conserve"
                        cardCount="1K Events"
                    />
                    <DiscoverCard
                        cardImage={fitness}
                        cardTitle="Fitness"
                        cardCount="1K Events"
                    />
                    <DiscoverCard
                        cardImage={wellness}
                        cardTitle="Wellness"
                        cardCount="1K Events"
                    />
                    <DiscoverCard
                        cardImage={finance}
                        cardTitle="Finance"
                        cardCount="1K Events"
                    />
                    <DiscoverCard
                        cardImage={music}
                        cardTitle="Music"
                        cardCount="1K Events"
                    />
                </div>
            </div>
            <div className="tiketi-tamasha-section">
                <div className="section-browse-title">Popular Events</div>
                <div className="section-elements">
                    <EventCard
                        cardImage={ar}
                        cardTitle="AR Gadgets"
                        cardTime="Wed, Jun 1, 1:00 PM"
                        cardLocation="University of Adelaide"
                        onClick={() => handleEventClick({title: "AR Gadgets", })}
                    />
                    <EventCard
                        cardImage={climate}
                        cardTitle="Climate Change"
                        cardTime="Thu, Feb 26, 2:00 PM"
                        cardLocation="Huddersfield"
                    />
                    <EventCard
                        cardImage={ai}
                        cardTitle="Ai Revolution"
                        cardTime="Fri, Mar 7, 1:00 PM"
                        cardLocation="Tel Aviv"
                    />
                </div>
            </div>
            {selectedEvent && (
                <EventDetails
                    onClose={handleCloseDialog}
                />
            )}
        </div>
    )
};