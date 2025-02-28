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
          <Route path="/event/:id" element={<EventDiscovery showPanel={true} />} /> 
        </Routes> 
    </Router>
  );
}

export default App;
