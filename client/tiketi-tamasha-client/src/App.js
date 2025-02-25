import React from "react";
import EventDiscovery from "./EventDiscovery";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        {/* ✅ Correctly placed EventDiscovery component */}
        <EventDiscovery />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
      </header>
    </div>
  );
}

export default App;
