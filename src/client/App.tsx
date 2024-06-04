import { useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Nav from "./components/Nav";
import RestaurantList from "./pages/restaurant_list/Restaurants";
import Items from "./pages/staff/Items";
import { Restaurant } from "./pages/description/Restaurant";

// TODO: clean up CSS
import "./styles/App.css";
import "./styles/global.css";

import { database } from "./firebase";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Login from "./pages/Login";
import { app } from "./firebase";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onValue, ref } from "firebase/database";

const Home = () => {
  app;
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        onValue(ref(database, "Staff"), (snapshot) => {
          if (snapshot.exists() && snapshot.val() === user.uid) {
            navigate("/items");
          } else {
            navigate("/restaurants");
          }
        });
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

  return null;
};

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
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="restaurants" element={<RestaurantList />} />
        <Route path="restaurant" element={<Restaurant />} />
        <Route path="items" element={<Items />} />
      </Routes>
      <Nav />
    </BrowserRouter>
  );
};
