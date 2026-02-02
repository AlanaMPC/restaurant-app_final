import React, { useState } from "react";
import "./Menus.css";
import soup from "./image.jpeg";
import clf from "./clf.jpeg";
import dosa from "./dosa.jpg";
import mojito from "./mojito.jpg";

export default function Menus() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const menuCategories = [
    {
      title: "Vegetarian Delights",
      image: soup,
      items: [
        "Tomato Soup",
        "French Fries",
        "Loaded French Fries",
        "Veg Sandwich",
        "Lotus Biscoff Sandwich (Kids' Favorite)",
        "Paneer Burger"
      ]
    },
    {
      title: "Non-Vegetarian Treats",
      image: clf,
      items: [
        "Sticken Pops",
        "Chicken Pops",
        "Chicken Loaded Fries",
        "Chicken Sandwich",
        "Chicken Momos",
        "Plain Dosa",
        "Egg Dosa",
        "Egg Cheese Dosa",
        "Chicken Dosa",
        "Cheesy Chicken Dosa",
        "Mutton Keema Dosa"
      ]
    },
    {
      title: "South Indian Specials",
      image: dosa,
      items: [
        "Idly – Plain",
        "Idly – Sambar",
        "Idly – Podi",
        "Panniyaram – Cheese",
        "Panniyaram – Nei Podi"
      ]
    },
    {
      title: "Refreshing Mojitos",
      image: mojito,
      items: [
        "Strawberry Mojito",
        "Litchi Mojito",
        "Lime Mojito",
        "Monito (Special)"
      ]
    }
  ];

  return (
    <section className="menus" id="menus">
      <h2 className="menus-title">Our Menu</h2>
      <p className="menus-subtitle">Explore our delicious offerings</p>

      <div className="menu-cards">
        {menuCategories.map((category, index) => (
          <div 
            className="menu-card" 
            key={index}
            onClick={() => setSelectedCategory(selectedCategory === index ? null : index)}
          >
            <img src={category.image} alt={category.title} />
            <h3>{category.title}</h3>
            {selectedCategory === index && (
              <div className="menu-items">
                <ul>
                  {category.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
