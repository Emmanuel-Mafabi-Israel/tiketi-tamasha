import { createContext, useState, useEffect } from "react";
import { fetchEvents } from "../api/eventApi";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  return <EventContext.Provider value={{ events, setEvents }}>{children}</EventContext.Provider>;
};
