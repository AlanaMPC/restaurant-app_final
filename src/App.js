import React from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Menus from "./components/Menus";
import About from "./components/About";
import Chef from "./components/Chef";
import PrivateDining from "./components/PrivateDining";
import Gifting from "./components/Gifting";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Menus />
      <About />
      <Chef />
      <PrivateDining />
      <Gifting />
      <Footer />
    </div>
  );
}

export default App;
