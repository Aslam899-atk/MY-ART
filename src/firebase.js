import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration for art-void project
const firebaseConfig = {
    apiKey: "AIzaSyDRNsrytjKqSUM0Q_gql4_UrEy7kQfnlAw",
    authDomain: "art-void.firebaseapp.com",
    projectId: "art-void",
    storageBucket: "art-void.firebasestorage.app",
    messagingSenderId: "395298958512",
    appId: "1:395298958512:web:29af9cf260abe105f29f75",
    measurementId: "G-0CYLXYE3KR"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export default app;
