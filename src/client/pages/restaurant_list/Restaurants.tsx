import Nav from "../../components/Nav";
import RestaurantCard from "./RestaurantCard";

// TODO: serve static files and use path names instead
import imgScr from "./images/SCR.webp";
import imgLoudBird from "./images/Loud-Bird.webp";
import imgKokoro from "./images/Kokoro.webp";
import imgLibraryCafe from "./images/Library-Cafe.webp";
import imgPlantworks from "./images/Plantworks.webp";

const restaurants = [
  {
    name: "SCR Restaurant",
    waitTime: 20,
    location: "Level 2, Sherfield Building",
    // img: "./SCR.webp",
    img: imgScr,
  },
  {
    name: "The Loud Bird",
    waitTime: 20,
    location: "Sir Alexander Fleming Building",
    // img: "./Loud-Bird.webp",
    img: imgLoudBird,
  },
  {
    name: "Kokoro",
    waitTime: 20,
    location: "Level 0, Sherfield Building",
    // img: "./Kokoro.webp",
    img: imgKokoro,
  },
  {
    name: "Library Cafe",
    waitTime: 10,
    location: "Level 0, Abdus Salam Library",
    // img: "./Library-Cafe.webp",
    img: imgLibraryCafe,
  },
  {
    name: "Plantworks",
    waitTime: 5,
    location: "Junior Common Room",
    // img: "./Plantworks.webp",
    img: imgPlantworks,
  },
];

const RestaurantList = () => {
  return (
    <div>
      <Nav />
      <div className="main-content">
        {restaurants.map(({ name, waitTime, location, img }) => (
          <RestaurantCard
            name={name}
            waitTime={waitTime}
            location={location}
            img={img}
          />
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
