import React from 'react';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import './App.css';
import database from "./firebase";
import {ref, get} from "firebase/database";
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import Items from './pages/Items';
import Restaurant from './pages/Restaurant';


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
      <Route
        path="/"
       element={
          <Home />
      }
    />
    <Route
      path="restaurants"
      element={
          <Restaurants />
      }
    />
    <Route
      path="restaurant"
      element={
          <Restaurant />
      }
    />
    <Route
      path="items"
      element={
          <Items />
      }
    />
    </Routes>
    </BrowserRouter>

  );
};

