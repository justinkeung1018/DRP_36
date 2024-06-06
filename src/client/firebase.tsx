import React, { useState } from "react";
import { get, ref, getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKZc2L9MFlyKnT7zQqzwaE5VUf4DItRjo",
  authDomain: "icfood-4334b.firebaseapp.com",
  projectId: "icfood-4334b",
  storageBucket: "icfood-4334b.appspot.com",
  messagingSenderId: "412745917777",
  appId: "1:412745917777:web:55b551adb6422f0f555f70",
  databaseURL:
    "https://icfood-4334b-default-rtdb.europe-west1.firebasedatabase.app/",
};

// const firebaseConfig = {
//   apiKey: "AIzaSyAakMxuEU9lC6a8m67ztllTRxUyYswo7z8",
//   authDomain: "drp36-e0704.firebaseapp.com",
//   projectId: "drp36-e0704",
//   storageBucket: "drp36-e0704.appspot.com",
//   messagingSenderId: "861245857051",
//   appId: "1:861245857051:web:7e02a77ddb09ad136b47be",
//   databaseURL:
//     "https://drp36-e0704-default-rtdb.europe-west1.firebasedatabase.app",
// };

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyApBcH7XHno5saByD1_IvbGqnC1K8cEDqw",
//   authDomain: "drp36-ea396.firebaseapp.com",
//   projectId: "drp36-ea396",
//   storageBucket: "drp36-ea396.appspot.com",
//   messagingSenderId: "1064933229081",
//   appId: "1:1064933229081:web:b1ac20faf42545ff186088",
//   measurementId: "G-99RTYS3R8C",
//   databaseURL:
//     "https://drp36-ea396-default-rtdb.europe-west1.firebasedatabase.app",
// };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
