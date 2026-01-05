import React from "react";

export default function Menus() {
  const menuItems = [
    "Lunch & Dinner Menu",
    "New Year's Eve Menu",
    "Chef's Tasting Menu",
    "Beverage Menu",
  ];

  return (
    <section className="menus">
      <h2>Menus</h2>
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <a href="#">{item}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
