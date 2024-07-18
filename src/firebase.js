// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "r-estate-bf8b5.firebaseapp.com",
  projectId: "r-estate-bf8b5",
  storageBucket: "r-estate-bf8b5.appspot.com",
  messagingSenderId: "769660546313",
  appId: "1:769660546313:web:1d97258349fa69aec637d8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage };
