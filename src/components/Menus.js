import React from "react";
import "./Menus.css";
import soup from "./soupp.jpg";

export default function Menus() {
  const menuItems = [
    {
      title: "Lunch & Dinner Menu",
      image: soup,
    },
    {
      title: "New Year's Eve Menu",
      image: "/images/new-year.jpg",
    },
    {
      title: "Chef's Tasting Menu",
      image: "/images/chef-tasting.jpg",
    },
    {
      title: "Beverage Menu",
      image: "/images/beverage.jpg",
    },
  ];

  return (
    <section className="menus">
      <h2 className="menus-title">Menus</h2>

      <div className="menu-cards">
        {menuItems.map((item, index) => (
          <div className="menu-card" key={index}>
            <div className="menu-image-wrapper">
              <img src={item.image} alt={item.title} />
            </div>
            <h3>{item.title.toLowerCase()}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}