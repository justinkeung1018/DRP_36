import RestaurantCard from "../../components/RestaurantCard";

import { restaurants } from "../../data";

const RestaurantList = () => {
  return (
    <>
      <div className="main-content flex flex-col">
        {restaurants.map((info) => (
          <RestaurantCard info={info} />
        ))}
      </div>
    </>
  );
};

export default RestaurantList;
