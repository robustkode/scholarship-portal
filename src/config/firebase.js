
import { initializeApp } from "firebase/app";
import {getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyAByZ19bMtYyduOszWaKGttVoaWUIRRwZI",

  authDomain: "eth-scholar.firebaseapp.com",

  projectId: "eth-scholar",

  storageBucket: "eth-scholar.appspot.com",

  messagingSenderId: "752797450327",

  appId: "1:752797450327:web:8970e89b21b2484fb0a312",

  measurementId: "G-JLT2S4K6K8"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

