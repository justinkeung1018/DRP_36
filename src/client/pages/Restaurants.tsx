import Nav from "../components/Nav";
import RestaurantDesc from "../components/Restaurants/RestaurantDesc";

const Restaurants = () => {
  return (
    <div>
      <Nav />
      <div className="main-content">
        <div className="all-rests">
          <RestaurantDesc name="SCR Restaurant"/>
          <RestaurantDesc name="The Loud Bird"/>
          <RestaurantDesc name="Kokoro"/>
          <RestaurantDesc name="Kimiko"/>
        </div>
      </div>
    </div>
  );
};

export default Restaurants;