// scripts/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDePtfAKouNDGoNY27_mIfSG096hRJ9U1U",
  authDomain: "adrix-1.firebaseapp.com",
  projectId: "adrix-1",
  storageBucket: "adrix-1.firebasestorage.app",
  messagingSenderId: "633957470456",
  appId: "1:633957470456:web:0865dfe89f5e9f6df2ab0d"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


