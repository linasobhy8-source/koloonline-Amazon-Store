import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "XXX",
  authDomain: "XXX",
  projectId: "XXX",
  appId: "XXX"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
