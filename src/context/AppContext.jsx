import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    runTransaction,
    increment
} from 'firebase/firestore';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [orders, setOrders] = useState([]);
    const [likedIds, setLikedIds] = useState(() => {
        const saved = localStorage.getItem('art_likedIds');
        return saved ? JSON.parse(saved) : [];
    });

    const [adminPassword, setAdminPassword] = useState(() => {
        const saved = localStorage.getItem('art_admin_password');
        return saved ? saved : 'admin123';
    });
    const [isAdmin, setIsAdmin] = useState(false);

    // Real-time listener for Products
    useEffect(() => {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setProducts(productsData);
        });
        return () => unsubscribe();
    }, []);

    // Real-time listener for Messages
    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setMessages(messagesData);
        });
        return () => unsubscribe();
    }, []);

    // Real-time listener for Orders
    useEffect(() => {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setOrders(ordersData);
        });
        return () => unsubscribe();
    }, []);

    // Persist likedIds (Per device)
    useEffect(() => {
        localStorage.setItem('art_likedIds', JSON.stringify(likedIds));
    }, [likedIds]);

    const addProduct = async (product) => {
        try {
            await addDoc(collection(db, 'products'), {
                ...product,
                likes: 0,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error adding product: ", error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await deleteDoc(doc(db, 'products', id));
        } catch (error) {
            console.error("Error deleting product: ", error);
        }
    };

    const updateProduct = async (updated) => {
        const { id, ...data } = updated;
        try {
            await updateDoc(doc(db, 'products', id), data);
        } catch (error) {
            console.error("Error updating product: ", error);
        }
    };

    const toggleLike = async (id) => {
        const isLiked = likedIds.includes(id);
        const productRef = doc(db, 'products', id);

        try {
            await updateDoc(productRef, {
                likes: increment(isLiked ? -1 : 1)
            });

            setLikedIds(prev => {
                if (prev.includes(id)) {
                    return prev.filter(likedId => likedId !== id);
                } else {
                    return [...prev, id];
                }
            });
        } catch (error) {
            console.error("Error toggling like: ", error);
        }
    };

    const addMessage = async (msg) => {
        try {
            await addDoc(collection(db, 'messages'), {
                ...msg,
                date: new Date().toLocaleDateString(),
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error adding message: ", error);
        }
    };

    const deleteMessage = async (id) => {
        try {
            await deleteDoc(doc(db, 'messages', id));
        } catch (error) {
            console.error("Error deleting message: ", error);
        }
    };

    const addOrder = async (order) => {
        try {
            await addDoc(collection(db, 'orders'), {
                ...order,
                status: 'Pending',
                date: new Date().toLocaleDateString(),
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error adding order: ", error);
        }
    };

    const deleteOrder = async (id) => {
        try {
            await deleteDoc(doc(db, 'orders', id));
        } catch (error) {
            console.error("Error deleting order: ", error);
        }
    };

    const changePassword = (newPass) => {
        setAdminPassword(newPass);
        localStorage.setItem('art_admin_password', newPass);
    };

    return (
        <AppContext.Provider value={{
            products, addProduct, deleteProduct, updateProduct, toggleLike, likedIds,
            messages, addMessage, deleteMessage,
            orders, addOrder, deleteOrder,
            isAdmin, setIsAdmin, adminPassword, changePassword
        }}>
            {children}
        </AppContext.Provider>
    );
};
