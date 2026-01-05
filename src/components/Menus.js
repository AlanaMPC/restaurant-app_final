import React from "react";
import "./Menus.css";
import soup from "./image.jpeg";
import clf from "./clf.jpeg";
export default function Menus() {
  const menuItems = [
    {
      title: "Vegetarian Delights ",
      image: soup,
    },
    
    {
      title: "South Indian Specials",
      image: "/images/chef-tasting.jpg",
    },
    {
      title: "Beverage Menu",
      image: "/images/beverage.jpg",
    },
    {
      title: "Non-Vegetarian Treats",
      image: clf,
    }
  ];

  return (
    <section className="menus">
      <h2 className="menus-title">Menus</h2>

      <div className="menu-cards">
        {menuItems.map((item, index) => (
          <div className="menu-card" key={index}>
            <img src={item.image} alt={item.title} />
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
