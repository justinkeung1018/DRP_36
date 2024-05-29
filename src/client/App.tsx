import { Route, Routes, BrowserRouter } from "react-router-dom";
import Restaurants from "./pages/restaurant_list/Restaurants";
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
      <Routes>
        <Route path="/" element={<Restaurants />} />
        <Route path="restaurant" element={<Restaurant />} />
        <Route path="items" element={<Items />} />
      </Routes>
    </BrowserRouter>
  );
};
