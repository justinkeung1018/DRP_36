import RestaurantCard from "./RestaurantCard";

import { restaurants } from "../../data";

const RestaurantList = () => {
  return (
    <>
      <div className="main-content">
        {restaurants.map((info) => (
          <RestaurantCard info={info} />
        ))}
      </div>
    </>
  );
};

export default RestaurantList;
