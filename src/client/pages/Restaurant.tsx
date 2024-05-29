import Nav from "../components/Nav";
import RestaurantHeader from "../components/Restaurant/RestaurantHeader";
import RestaurantItems from "../components/Restaurant/RestaurantItems";

const Restaurants = () => {
  return (
    <div>
      <Nav />
      <RestaurantHeader />
      <RestaurantItems /> 
      <RestaurantItems />
      <RestaurantItems />
    </div>
  );
};

export default Restaurants;