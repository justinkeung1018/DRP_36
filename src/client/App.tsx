import { useState } from "react";
import { Route, Routes, BrowserRouter, Navigation } from "react-router-dom";
import RestaurantList from "./pages/user/restaurant_list/Restaurants";
import Items from "./pages/staff/Items";
import { Restaurant } from "./pages/user/description/Restaurant";
import Account from "./pages/user/Account";
import { Favourites } from "./pages/user/Favourites";

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
import NavStaff from "./components/NavStaff";
import NavUser from "./components/NavUser";

const Home = (props: any) => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        onValue(ref(database, `Staff/${user.uid}`), (snapshot) => {
          if (snapshot.exists()) {
            navigate("/items");
            props.setPrivileges(1);
          } else {
            navigate("/restaurants");
            props.setPrivileges(2);
          }
        });
      } else {
        navigate("/login");
        props.setPrivileges(0);
      }
    });
  }, [navigate]);

  return null;
};

export const App = () => {
  const [privileges, setPrivileges] = useState(0);
  // let id = navigator.geolocation.watchPosition((position: GeolocationPosition) => {
  //   console.log(position.coords.latitude, position.coords.longitude);

  // }, (err) => console.error("Bad"), {enableHighAccuracy: true, timeout: 10000, maximumAge: 0});

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home setPrivileges={setPrivileges} />} />
        <Route path="login" element={<Login />} />
        <Route path="restaurants" element={<RestaurantList />} />
        <Route path="restaurant" element={<Restaurant />} />
        <Route path="items" element={<Items />} />
        <Route path="account" element={<Account />} />
        <Route path="favourites" element={<Favourites />} />
      </Routes>
      {privileges === 0 ? (
        <div></div>
      ) : privileges === 1 ? (
        <NavStaff />
      ) : (
        <NavUser />
      )}
    </BrowserRouter>
  );
};
