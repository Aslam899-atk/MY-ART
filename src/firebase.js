import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
