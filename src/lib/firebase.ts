import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { PUBLIC_FIREBASE_API_KEY, 
        PUBLIC_FIREBASE_PROJECT_ID, 
        PUBLIC_FIREBASE_AUTH_DOMAIN,
        PUBLIC_FIREBASE_STORAGE_BUCKET,
        PUBLIC_FIREBASE_APP_ID,
        PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        PUBLIC_FIREBASE_MEASUREMENT_ID
         } from '$env/static/public';


const firebaseConfig = {
  apiKey: PUBLIC_FIREBASE_API_KEY,
  authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: PUBLIC_FIREBASE_APP_ID,
  measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);