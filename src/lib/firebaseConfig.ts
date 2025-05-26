import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyAeCSzpqEOq884patQACUT4ZCi20O7orGc",
  authDomain: "nubbi-ai.firebaseapp.com",
  projectId: "nubbi-ai",
  storageBucket: "nubbi-ai.firebasestorage.app",
  messagingSenderId: "792372516613",
  appId: "1:792372516613:web:e290ec06c01dfde8ad096c",
  measurementId: "G-1K4YHTGZ55"
};

export const app = initializeApp(firebaseConfig);

// Solo inicializar Analytics en el cliente (browser)
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;
