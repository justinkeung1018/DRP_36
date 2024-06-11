import { useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import { Archive } from "./pages/staff/Archive";
import { StaffMenu } from "./pages/staff/StaffMenu";

import Account from "./pages/user/Account";
import { Favourites } from "./pages/user/Favourites";
import { LocationDialog } from "./pages/user/LocationDialog";
import { Restaurant } from "./pages/user/Menu";
import RestaurantList from "./pages/user/RestaurantList";

// TODO: clean up CSS
import "./styles/App.css";
import "./styles/global.css";

import { database } from "./firebase";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Login from "./pages/Login";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import NavStaff from "./components/NavStaff";
import NavUser from "./components/NavUser";
import { Toaster } from "./components/shadcn/Toaster";

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
        <Route path="items" element={<StaffMenu />} />
        <Route path="archive" element={<Archive />} />
        <Route path="account" element={<Account />} />
        <Route path="favourites" element={<Favourites />} />
      </Routes>
      {privileges === 0 ? (
        <div></div>
      ) : privileges === 1 ? (
        <NavStaff />
      ) : (
        <>
          <LocationDialog />
          <NavUser />
        </>
      )}
      <Toaster />
    </BrowserRouter>
  );
};
