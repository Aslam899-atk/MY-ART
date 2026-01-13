/* global process */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";

// Valid Firebase config (from existing firebase.js or user provided)
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
const db = getFirestore(app);

const seedProducts = [
    {
        name: "Golden Hour Hills",
        description: "A serene oil painting capturing the golden light of sunset over rolling hills.",
        price: 450,
        image: "https://images.unsplash.com/photo-1579783902614-a3fb39279c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        likes: 24,
        createdAt: new Date().toISOString()
    },
    {
        name: "Mystic Calligraphy",
        description: "Traditional ink calligraphy on handmade paper, exploring themes of peace and harmony.",
        price: 180,
        image: "https://images.unsplash.com/photo-1515003447936-234e402657e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        likes: 45,
        createdAt: new Date(Date.now() - 10000).toISOString()
    },
    {
        name: "Urban Sketch",
        description: "Detailed pencil sketch of a bustling city street corner.",
        price: 120,
        image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        likes: 18,
        createdAt: new Date(Date.now() - 20000).toISOString()
    },
    {
        name: "Abstract Fluidity",
        description: "Vibrant acrylic pour painting with fluid motions and contrasting colors.",
        price: 300,
        image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        likes: 32,
        createdAt: new Date(Date.now() - 30000).toISOString()
    },
    {
        name: "Watercolor Blossom",
        description: "Soft watercolor depiction of spring flowers in full bloom.",
        price: 150,
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        likes: 56,
        createdAt: new Date(Date.now() - 40000).toISOString()
    }
];

async function reset() {
    console.log("Starting database reset...");

    const collections = ['products', 'messages', 'orders'];

    for (const colName of collections) {
        console.log(`Clearing ${colName}...`);
        const colRef = collection(db, colName);
        const snapshot = await getDocs(colRef);
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        console.log(`Cleared ${snapshot.size} documents from ${colName}.`);
    }

    console.log("Seeding products...");
    for (const product of seedProducts) {
        // Create a new document reference with an auto-generated ID
        const newDocRef = doc(collection(db, "products"));
        await setDoc(newDocRef, product);
    }

    console.log("Database reset and seeded successfully!");
    process.exit(0);
}

reset().catch((error) => {
    console.error("Error resetting database:", error);
    process.exit(1);
});
