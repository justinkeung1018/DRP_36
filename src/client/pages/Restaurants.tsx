import Nav from "../components/Nav";
import RestaurantDesc from "../components/Restaurants/RestaurantDesc";

const Restaurants = () => {
  return (
    <div>
      <Nav />
      <RestaurantDesc name="SCR Restaurant"/>
      <RestaurantDesc name="The Loud Bird"/>
      <RestaurantDesc name="Kokoro"/>
    </div>
  );
};

export default Restaurants;