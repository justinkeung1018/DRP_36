import { Header } from "../../components/Header";
import RestaurantCard from "../../components/RestaurantCard";

import { restaurants } from "../../data";

const RestaurantList = () => {
  return (
    <>
      <div className="main-content flex flex-col md:items-center md:container md:mx-auto">
        {restaurants.map((info) => (
          <RestaurantCard info={info} />
        ))}
      </div>
      <Header spritePath="./images/sprites/smile.png">
        Explore a restaurant!
      </Header>
    </>
  );
};

export default RestaurantList;
