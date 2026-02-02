import React from "react";
import Hero from "./Hero";
import Menus from "./Menus";
import About from "./About";
import Chef from "./Chef";
import PrivateDining from "./PrivateDining";

export default function Home() {
  return (
    <>
      <Hero />
      <Menus />
      <About />
      <Chef />
      <PrivateDining />
    </>
  );
}
