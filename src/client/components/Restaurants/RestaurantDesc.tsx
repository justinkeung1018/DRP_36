import { Link } from "react-router-dom";
import food from './mock-image.jpg';


interface RestaurantDescProps {
  name: string;
}

const RestaurantDesc = ({ name }: RestaurantDescProps) => {
  return (
    <Link to="/restaurant" state={{restaurant:name}} style={{ textDecoration: 'none', color: 'black'}}>
      <div className="rest-desc-card">
        <img src={food} width="350vw" height="150vw" alt="Food" className="centered-image" />
        <div className="rest-header">
        <h1 className="r1">{name}</h1>
        <h1 className="r1">20 mins</h1>
        </div>
        <div className="rest-desc">
          <div className="r2">
            4.5 stars (100 reviews) · £5.70 average
          </div>
          <div className="r2">
            estimated wait
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantDesc;