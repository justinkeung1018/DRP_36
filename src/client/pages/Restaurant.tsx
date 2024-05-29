import Nav from "../components/Nav";
import RestaurantHeader from "../components/Restaurant/RestaurantHeader";
import RestaurantItems from "../components/Restaurant/RestaurantItems";
import database from "../firebase";
import {ref, get} from "firebase/database";
import { useLocation } from 'react-router-dom';

const Restaurant = () => {
  const location = useLocation();
  const { restaurant } = location.state;
  // const data = ref(database, "hi");
  // get(data).then((snapshot) => {
  //   if (snapshot.exists()) {
  //     console.log(snapshot.val());
  //   } else {
  //     console.log("No data available");
  //   }
  // }).catch((error) => {
  //   console.error(error);
  // });


  return (
    <div>
      <Nav />
        <RestaurantHeader {...{rest: restaurant}} />
        <RestaurantItems /> 
        <RestaurantItems />
        <RestaurantItems />
    </div>
  );
};

export default Restaurant;