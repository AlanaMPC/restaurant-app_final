import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MenuCategory.css";

export default function MenuCategory() {
  const navigate = useNavigate();
  const { category } = useParams();

  const menuData = {
    "vegetarian": {
      title: "Vegetarian Delights",
      items: [
        { name: "Tomato Soup", price: "₹150", desc: "Hot and aromatic tomato soup" },
        { name: "French Fries", price: "₹100", desc: "Crispy golden fried potatoes" },
        { name: "Loaded French Fries", price: "₹180", desc: "French fries with toppings and sauces" },
        { name: "Veg Sandwich", price: "₹120", desc: "Fresh vegetable sandwich with special sauce" },
        { name: "Lotus Biscoff Sandwich (Kids' Favorite)", price: "₹140", desc: "Sweet biscoff spread sandwich" },
        { name: "Paneer Burger", price: "₹180", desc: "Crispy paneer patty burger" }
      ]
    },
    "non-vegetarian": {
      title: "Non-Vegetarian Treats",
      items: [
        { name: "Chicken Pops", price: "₹220", desc: "Crispy chicken fritters" },
        { name: "Chicken Loaded Fries", price: "₹240", desc: "Loaded fries with chicken and toppings" },
        { name: "Chicken Sandwich", price: "₹200", desc: "Tender chicken sandwich" },
        { name: "Chicken Momos", price: "₹180", desc: "Steamed chicken momos with sauce" },
        { name: "Plain Dosa", price: "₹100", desc: "Crispy plain dosa" },
        { name: "Egg Dosa", price: "₹130", desc: "Dosa with egg filling" },
        { name: "Egg Cheese Dosa", price: "₹160", desc: "Dosa with egg and cheese" },
        { name: "Chicken Dosa", price: "₹200", desc: "Dosa with shredded chicken" },
        { name: "Cheesy Chicken Dosa", price: "₹230", desc: "Chicken dosa with melted cheese" },
        { name: "Mutton Keema Dosa", price: "₹240", desc: "Dosa with mutton keema filling" }
      ]
    },
    "south-indian": {
      title: "South Indian Specials",
      items: [
        { name: "Idly – Plain", price: "₹80", desc: "Soft steamed rice cakes" },
        { name: "Idly – Sambar", price: "₹100", desc: "Idly with sambar curry" },
        { name: "Idly – Podi", price: "₹100", desc: "Idly with spicy podi powder" },
        { name: "Panniyaram – Cheese", price: "₹120", desc: "Soft panniyaram with cheese" },
        { name: "Panniyaram – Nei Podi", price: "₹120", desc: "Panniyaram with ghee and spices" }
      ]
    },
    "mojitos": {
      title: "Refreshing Mojitos",
      items: [
        { name: "Strawberry Mojito", price: "₹180", desc: "Fresh strawberry with mint and lime" },
        { name: "Litchi Mojito", price: "₹180", desc: "Sweet litchi with refreshing mint" },
        { name: "Lime Mojito", price: "₹150", desc: "Classic lime and mint mojito" }      ]
    }
  };

  const data = menuData[category];

  if (!data) {
    return <div className="error-page">Category not found</div>;
  }

  return (
    <div className="menu-category-page">
      <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
      
      <div className="category-header">
        <h1>{data.title}</h1>
        <p>Explore all our delicious {data.title.toLowerCase()}</p>
      </div>

      <div className="items-container">
        {data.items.map((item, idx) => (
          <div className="item-card" key={idx}>
            <div className="item-header">
              <h3>{item.name}</h3>
              <span className="item-price">₹</span>
            </div>
            <p className="item-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
