import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import EventDiscovery from "./components/EventDiscovery";
import EventDetails from "./components/EventDetails";
import './App.css'; // Ensure you have a global CSS file for common styles
import SearchPage from './components/SearchPage';

function App() {
  return (
    <Router> 
        <Routes>
          <Route path="/" element={<EventDiscovery />} />
          <Route path="/events" element={<EventDetails />} />
          <Route path='/search' element={<SearchPage></SearchPage>}></Route>
        </Routes> 
    </Router>
  );
}

export default App;
