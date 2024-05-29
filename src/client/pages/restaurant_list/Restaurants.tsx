import RestaurantCard from "./RestaurantCard";

const restaurants = [
  {
    name: "SCR Restaurant",
    waitTime: 20,
    location: "Level 2, Sherfield Building",
    img: "./images/SCR.webp",
  },
  {
    name: "The Loud Bird",
    waitTime: 20,
    location: "Sir Alexander Fleming Building",
    img: "./images/Loud-Bird.webp",
  },
  {
    name: "Kokoro",
    waitTime: 20,
    location: "Level 0, Sherfield Building",
    img: "./images/Kokoro.webp",
  },
  {
    name: "Library Cafe",
    waitTime: 10,
    location: "Level 0, Abdus Salam Library",
    img: "./images/Library-Cafe.webp",
  },
  {
    name: "Plantworks",
    waitTime: 5,
    location: "Junior Common Room",
    img: "./Plantworks.webp",
  },
];

const RestaurantList = () => {
  return (
    <>
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
    </>
  );
};

export default RestaurantList;
