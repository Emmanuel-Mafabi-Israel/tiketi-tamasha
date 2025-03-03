import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import EventDiscovery from "./components/EventDiscovery";
import EventDetails from "./components/EventDetails";
import './App.css'; // Ensure you have a global CSS file for common styles

function App() {
  return (
    <Router> 
        <Routes>
          <Route path="/" element={<EventDiscovery />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
        </Routes> 
    </Router>
  );
}

export default App;
