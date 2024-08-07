import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA82yfPIqbbd9LkUy3Lfq0HkbkI2LzaUss",
  authDomain: "lino9ati3.firebaseapp.com",
  projectId: "lino9ati3",
  storageBucket: "lino9ati3.appspot.com",
  messagingSenderId: "641488151446",
  appId: "1:641488151446:web:01801d9d53863a9230b3b7",
  measurementId: "G-40D01P0DCP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();