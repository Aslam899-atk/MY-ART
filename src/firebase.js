import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getStorage, setMaxUploadRetryTime } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration for art-void project
const firebaseConfig = {
    apiKey: "AIzaSyDRNsrytjKqSUM0Q_gql4_UrEy7kQfnlAw",
    authDomain: "art-void.firebaseapp.com",
    projectId: "art-void",
    storageBucket: "art-void.firebasestorage.app",
    messagingSenderId: "395298958512",
    appId: "1:395298958512:web:78fef15dbeedb319f29f75",
    measurementId: "G-XN6RXYZ1N4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Increase upload retry time to 10 minutes (600,000 milliseconds)
// This helps with slow internet connections or large video files
// setMaxUploadRetryTime(storage, 600000);

export const analytics = getAnalytics(app);
export default app;
