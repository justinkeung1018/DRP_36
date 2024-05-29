import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { IoRestaurantSharp } from "react-icons/io5";
import { FaBowlFood } from "react-icons/fa6";
import { IoAddOutline } from "react-icons/io5";

const Nav = () => {
  return (
    <div className="navigation-tab">
      <nav>
        <ul className="nav-list">
          <li>
            <Link to="/">
              <div className="nav-item">
                <FaHome size={30} />
                <br />
                Home
              </div>
            </Link>
          </li>
          <li>
            <Link to="/restaurants">
              <div className="nav-item">
                <IoRestaurantSharp size={30} />
                <br />
                Restaurants
              </div>
            </Link>
          </li>
          <li>
            <Link to="/items">
              <div className="nav-item">
                <FaBowlFood size={30} />
                <br />
                Items
              </div>
            </Link>
          </li>
          <li>
            <Link to="/items">
              <div className="nav-item">
                <IoAddOutline size={30} />
                <br />
                Add Item
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Nav;