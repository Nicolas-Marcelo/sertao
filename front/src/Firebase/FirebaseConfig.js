import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCt9PRhFgAy2Gsy8oze1bGgk1v4RgIJLlw",
  authDomain: "correcttask.firebaseapp.com",
  projectId: "correcttask",
  storageBucket: "correcttask.appspot.com",
  messagingSenderId: "224516626664",
  appId: "1:224516626664:web:49e6be706e1d5a39d2915d",
  measurementId: "G-BH7CY5DSH6"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
