import React, { useState } from "react";
import database from "./firebase";
import {ref, get} from "firebase/database";

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
    <div className="container mx-auto py-10">
      DRP
    </div>
  );
};
