import { Route, Routes, BrowserRouter } from "react-router-dom";
import Nav from "./components/Nav";
import RestaurantList from "./pages/restaurant_list/Restaurants";
import Items from "./pages/description/Items";
import Restaurant from "./pages/description/Restaurant";

// TODO: clean up CSS
import "./styles/App.css";
import "./styles/global.css";

export const App = () => {
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
    <BrowserRouter>
      <Nav />
      <div className="static">
        <Routes>
          <Route path="/" element={<RestaurantList />} />
          <Route path="restaurant" element={<Restaurant />} />
          <Route path="items" element={<Items />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
