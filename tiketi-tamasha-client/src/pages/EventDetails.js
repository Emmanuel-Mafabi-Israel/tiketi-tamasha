import React from "react";
import { useParams } from "react-router-dom";
import "../styles/EventDetails.css";


const EventDetails = () => {
  const { id } = useParams();

  return (
    <div>
      <h2 className="text-2xl font-bold">Event Details</h2>
      <p>Event ID: {id}</p>
    </div>
  );
};

export default EventDetails;
