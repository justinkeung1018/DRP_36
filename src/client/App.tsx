import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./styles/App.css";
import Restaurants from "./pages/Restaurants";
import Items from "./pages/Items";
import Restaurant from "./pages/Restaurant";

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
