import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "koloonline.firebaseapp.com",
  projectId: "koloonline",
  storageBucket: "koloonline.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
