import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBC6PR94HOyFTRyCMPR8nO7awOvYwu8-1o",
    authDomain: "art-web-5987a.firebaseapp.com",
    projectId: "art-web-5987a",
    storageBucket: "art-web-5987a.firebasestorage.app",
    messagingSenderId: "518011279574",
    appId: "1:518011279574:web:6144f1a7a03d226135d177"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
