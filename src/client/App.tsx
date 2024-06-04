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
import NavStaff from "./components/NavStaff";
import NavUser from "./components/NavUser";
import Account from "./components/Account";

const Home = (props: any) => {
  app;
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        onValue(ref(database, "Staff"), (snapshot) => {
          if (snapshot.exists() && snapshot.val() === user.uid) {
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home setPrivileges={setPrivileges} />} />
        <Route path="login" element={<Login />} />
        <Route path="restaurants" element={<RestaurantList />} />
        <Route path="restaurant" element={<Restaurant />} />
        <Route path="items" element={<Items />} />
        <Route path="account" element={<Account />} />
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
