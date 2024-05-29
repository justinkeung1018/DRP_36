import { Link } from "react-router-dom";
import food from './mock-image.jpg';


interface RestaurantDescProps {
  name: string;
}

const RestaurantDesc = (props: RestaurantDescProps) => {
  return (
    <Link to="/">
      <div className="rest-desc-card">
        <img src={food} width="100" height="50" alt="Food" />
        <h1>{props.name}</h1>
      </div>
    </Link>
  );
};

export default RestaurantDesc;