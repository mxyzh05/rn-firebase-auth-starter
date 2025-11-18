import { initializeApp, getApp, getApps } from "firebase/app";
import Constants from "expo-constants";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
let app;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Firebase Authentication is disabled in favor of custom backend authentication
// Comment out auth initialization to prevent conflicts
// import { getAuth } from "firebase/auth";
// export const auth = getAuth(app);

// Export the initialized app for other Firebase services (Firestore, Storage, etc.)
export default app;
