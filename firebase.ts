import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import auth, { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7knJwt7QdVhNsbEPCM58MVZh2EZHLsqI",
  authDomain: "rahmednoodles.firebaseapp.com",
  projectId: "rahmednoodles",
  storageBucket: "rahmednoodles.appspot.com",
  messagingSenderId: "753102282469",
  appId: "1:753102282469:web:efdfc59f94cc74effa3e0c",
  measurementId: "G-HWKFLC5TQX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// export const autho = getAuth(initializeApp(firebaseConfig));
export const uauth = auth;

export default app;