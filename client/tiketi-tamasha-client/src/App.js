import EventDiscovery from "./EventDiscovery";


function App() {
  return (
    <div className="App">
      <header className="header-container">
        <div className="logo-container">
          <img src="/path-to-your-logo.png" alt="Tiketi Tamasha Logo" className="logo-img" />
          <h1 className="site-name">Tiketi Tamasha</h1>
        </div>
        <button className="login-btn">Login</button>
      </header>
      <EventDiscovery />
    </div>
  );
}

export default App;
