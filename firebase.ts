import * as firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  appId: process.env.APPID,
  apiKey: process.env.APIKEY,
  projectId: "rahmednoodles",
  authDomain: process.env.AUTHDOMAIN,
  storageBucket: process.env.STORAGEBUCKET,
  measurementId: process.env.MEASUREMENTID,
  messagingSenderId: process.env.MESSAGINGSENDERID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;