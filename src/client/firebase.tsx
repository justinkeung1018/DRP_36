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
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApBcH7XHno5saByD1_IvbGqnC1K8cEDqw",
  authDomain: "drp36-ea396.firebaseapp.com",
  projectId: "drp36-ea396",
  storageBucket: "drp36-ea396.appspot.com",
  messagingSenderId: "1064933229081",
  appId: "1:1064933229081:web:b1ac20faf42545ff186088",
  measurementId: "G-99RTYS3R8C",
  databaseURL:
    "https://drp36-ea396-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
