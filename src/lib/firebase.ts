import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
// Import other Firebase services like getFirestore, getFunctions if needed
import { firebaseConfig } from "./firebaseConfig";

let app: FirebaseApp;
let auth: Auth;
// let firestore: Firestore; (example)

if (firebaseConfig.apiKey === "YOUR_API_KEY") {
  console.warn(
    "Firebase is not configured. Please update src/lib/firebaseConfig.ts with your Firebase project details."
  );
}

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Failed to initialize Firebase app:", error);
    // Fallback or mock app if initialization fails, to prevent app crash
    app = {} as FirebaseApp; // This is a simplistic fallback
  }
} else {
  app = getApp();
}

try {
  auth = getAuth(app);
  // firestore = getFirestore(app); (example)
} catch (error) {
   console.error("Failed to initialize Firebase auth:", error);
   auth = {} as Auth; // Simplistic fallback
}


export { app, auth /*, firestore */ };
