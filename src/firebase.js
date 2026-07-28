import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC-2Zk25iBHT7d03_4TbbaCwFrxsURXphY",
  authDomain: "career-sync-89fa8.firebaseapp.com",
  projectId: "career-sync-89fa8",
  storageBucket: "career-sync-89fa8.firebasestorage.app",
  messagingSenderId: "48258419403",
  appId: "1:48258419403:web:61f1111505cf7b3821e94e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
