import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MenuCategory.css";
import tomato from "./tomato.jpeg";
import clf from "./clf.jpeg";
import dosa from "./dosa.jpg";
import chickenDosa from "./chicken_dosa.jpg";
import mutton from "./mutton.jpg";
import plain from "./plain.jpeg";
import cheesyChicken from "./cheese_chicken.jpeg";
import strawberry from "./strawberry.jpg";
import idly from "./idly.jpg";
import sambarIdly from "./sambar_idly.jpg";
import podi from "./podi.jpg";
import paniyaram from "./paniyaram.jpg";
import fries from "./fries.jpg";
import vegFires from "./veg_fires.jpeg";
import litchi from "./litchi.jpeg";
import lime from "./lime.jpeg";
import mojito from "./mojito.jpg";
import vegSandwich from "./veg_sandwitch.jpeg";
import chickenPops from "./chicken_pops.jpeg";
import paneer from "./paneer.jpeg";
import lotus from "./lotus.jpeg";
import momos from "./momos.jpg";
import chickenSandwich from "./chicken_sandwich.jpeg";

// Import or use placeholder for food images
const foodImages = {
  tomato: tomato,
  fries: fries,
  loadedfries: vegFires,
  vegSandwich: vegSandwich,
  lotus: lotus,
  paneer: paneer,
  dosa: dosa,
  chickenDosa: chickenDosa,
  mutton: mutton,
  plain: plain,
  cheesyChicken: cheesyChicken,
  strawberry: strawberry,
  idly: idly,
  sambarIdly: sambarIdly,
  podi: podi,
  paniyaram: paniyaram,
  litchi: litchi,
  lime: lime,
  chickenPops: chickenPops,
  momos: momos,
  chickenSandwich: chickenSandwich,
  mojito: mojito,
  chicken: clf
};

export default function MenuCategory() {
  const navigate = useNavigate();
  const { category } = useParams();

  const menuData = {
    "vegetarian": {
      title: "Vegetarian Delights",
      items: [
        { name: "Tomato Soup", price: "₹150", desc: "Hot and aromatic tomato soup", image: foodImages.tomato },
        { name: "French Fries", price: "₹100", desc: "Crispy golden fried potatoes", image: foodImages.fries },
        { name: "Loaded French Fries", price: "₹180", desc: "French fries with toppings and sauces", image: foodImages.loadedfries },
        { name: "Veg Sandwich", price: "₹120", desc: "Fresh vegetable sandwich with special sauce", image: foodImages.vegSandwich },
        { name: "Lotus Biscoff Sandwich (Kids' Favorite)", price: "₹140", desc: "Sweet biscoff spread sandwich", image: foodImages.lotus },
        { name: "Paneer Burger", price: "₹180", desc: "Crispy paneer patty burger", image: foodImages.paneer }
      ]
    },
    "non-vegetarian": {
      title: "Non-Vegetarian Treats",
      items: [
        { name: "Chicken Pops", price: "₹220", desc: "Crispy chicken fritters", image: foodImages.chickenPops },
        { name: "Chicken Loaded Fries", price: "₹240", desc: "Loaded fries with chicken and toppings", image: foodImages.loadedfries },
        { name: "Chicken Sandwich", price: "₹200", desc: "Tender chicken sandwich", image: foodImages.chickenSandwich },
        { name: "Chicken Momos", price: "₹180", desc: "Steamed chicken momos with sauce", image: foodImages.momos },
        { name: "Plain Dosa", price: "₹100", desc: "Crispy plain dosa", image: foodImages.plain },
        { name: "Egg Dosa", price: "₹130", desc: "Dosa with egg filling", image: foodImages.dosa },
        { name: "Egg Cheese Dosa", price: "₹160", desc: "Dosa with egg and cheese", image: foodImages.dosa },
        { name: "Chicken Dosa", price: "₹200", desc: "Dosa with shredded chicken", image: foodImages.chickenDosa },
        { name: "Cheesy Chicken Dosa", price: "₹230", desc: "Chicken dosa with melted cheese", image: foodImages.cheesyChicken },
        { name: "Mutton Keema Dosa", price: "₹240", desc: "Dosa with mutton keema filling", image: foodImages.mutton }
      ]
    },
    "south-indian": {
      title: "South Indian Specials",
      items: [
        { name: "Idly – Plain", price: "₹80", desc: "Soft steamed rice cakes", image: foodImages.idly },
        { name: "Idly – Sambar", price: "₹100", desc: "Idly with sambar curry", image: foodImages.sambarIdly },
        { name: "Idly – Podi", price: "₹100", desc: "Idly with spicy podi powder", image: foodImages.podi },
        { name: "Panniyaram – Cheese", price: "₹120", desc: "Soft panniyaram with cheese", image: foodImages.paniyaram },
        { name: "Panniyaram – Nei Podi", price: "₹120", desc: "Panniyaram with ghee and spices", image: foodImages.paniyaram }
      ]
    },
    "mojitos": {
      title: "Refreshing Mojitos",
      items: [
        { name: "Strawberry Mojito", price: "₹180", desc: "Fresh strawberry mojito", image: foodImages.strawberry },
        { name: "Litchi Mojito", price: "₹180", desc: "Sweet litchi mojito", image: foodImages.litchi },
        { name: "Lime Mojito", price: "₹150", desc: "Classic lime and mint mojito", image: foodImages.lime }
      ]
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
            <img src={item.image} alt={item.name} className="item-image" />
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
