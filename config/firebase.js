import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlLFhmWdhqjf62VraY0yT9UgcaAn6jnhI",
  authDomain: "onlinekoloonlineonline-a9979.firebaseapp.com",
  projectId: "onlinekoloonlineonline-a9979",
  storageBucket: "onlinekoloonlineonline-a9979.firebasestorage.app",
  messagingSenderId: "1051818718615",
  appId: "1:1051818718615:web:9d3fd0d26d902082b3c0d2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
