/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [messages, setMessages] = useState([]);
    const [orders, setOrders] = useState([]);

    // User Auth State
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('art_user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error("Error parsing user from local storage", e);
            localStorage.removeItem('art_user'); // Clean up invalid data
            return null;
        }
    });

    const [likedIds, setLikedIds] = useState(() => {
        return user ? [...(user.likedProducts || []), ...(user.likedGallery || [])] : [];
    });


    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Dynamic API URL based on environment
    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5001/api'
        : 'https://my-art-void-server.onrender.com/api';

    // --- FETCH DATA ---
    const fetchData = useCallback(async () => {
        try {
            const [prodRes, galRes, msgRes, ordRes] = await Promise.all([
                fetch(`${API_URL}/products`),
                fetch(`${API_URL}/gallery`),
                fetch(`${API_URL}/messages`),
                fetch(`${API_URL}/orders`)
            ]);

            setProducts(await prodRes.json());
            setGalleryItems(await galRes.json());
            setMessages(await msgRes.json());
            setOrders(await ordRes.json());
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoadingAuth(false);
        }
    }, [API_URL]);

    // ---------- Product CRUD ----------
    const addProduct = async (product) => {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        if (res.ok) {
            const newProd = await res.json();
            setProducts((prev) => [newProd, ...prev]);
        }
    };

    const deleteProduct = async (id) => {
        await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
        setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
    };

    const updateProduct = async (product) => {
        const { id, ...rest } = product;
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rest)
        });
        if (res.ok) {
            const updated = await res.json();
            setProducts((prev) => prev.map((p) => ((p._id || p.id) === id ? updated : p)));
        }
    };

    const handleLikeAction = async (type, id) => {
        if (!user) {
            // Trigger Google login as requested (login with gmail)
            const res = await loginWithGoogle();
            if (!res.success) return;
        }

        // Now user is logged in. Determine status.
        // We need the fresh user object from state (or ref) but let's trust 'user'
        // Actually 'user' might be stale in closure if we just logged in? 
        // We can get proper user from localstorage or verify.
        const currentUser = JSON.parse(localStorage.getItem('art_user'));
        if (!currentUser) return; // Should not happen

        const isProduct = type === 'product';
        const listKey = isProduct ? 'likedProducts' : 'likedGallery';
        const currentList = currentUser[listKey] || [];
        const isLiked = currentList.includes(id);

        // 1. Update Item Count
        const endpoint = isProduct ? 'products' : 'gallery';
        await fetch(`${API_URL}/${endpoint}/${id}/like`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ increment: !isLiked })
        });

        // 2. Update User List
        let newList;
        if (isLiked) {
            newList = currentList.filter(itemId => itemId !== id);
        } else {
            newList = [...currentList, id];
        }

        const userUpdateBody = {
            [listKey]: newList
        };

        // Reuse the update user endpoint logic (we need to make sure we have one or adding it inline)
        const userId = currentUser.id || currentUser._id;
        const userRes = await fetch(`${API_URL}/users/${userId}/likes`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userUpdateBody)
        });

        if (userRes.ok) {
            const updatedUser = await userRes.json();
            setUser(updatedUser);
            localStorage.setItem('art_user', JSON.stringify(updatedUser));
            setLikedIds([...(updatedUser.likedProducts || []), ...(updatedUser.likedGallery || [])]);
        }

        fetchData();
    };

    const toggleLike = (id) => handleLikeAction('product', id);
    // ---------- Gallery CRUD ----------
    const addGalleryItem = async (item) => {
        const res = await fetch(`${API_URL}/gallery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
        if (res.ok) {
            const newItem = await res.json();
            setGalleryItems((prev) => [newItem, ...prev]);
        }
    };

    const deleteGalleryItem = async (id) => {
        await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE' });
        setGalleryItems((prev) => prev.filter((g) => (g._id || g.id) !== id));
    };

    const toggleGalleryLike = (id) => handleLikeAction('gallery', id);

    // ---------- Message CRUD ----------
    const addMessage = async (msg) => {
        const res = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(msg)
        });
        if (res.ok) {
            const newMsg = await res.json();
            setMessages((prev) => [newMsg, ...prev]);
        }
    };

    const deleteMessage = async (id) => {
        await fetch(`${API_URL}/messages/${id}`, { method: 'DELETE' });
        setMessages((prev) => prev.filter((m) => (m._id || m.id) !== id));
    };

    // ---------- Order CRUD ----------
    const addOrder = async (order) => {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        if (res.ok) {
            const newOrder = await res.json();
            setOrders((prev) => [newOrder, ...prev]);
        }
    };

    const deleteOrder = async (id) => {
        await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
        setOrders((prev) => prev.filter((o) => (o._id || o.id) !== id));
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [fetchData]);

    // ... (Keep existing Product/Gallery/Message/Order functions)

    // --- SETTINGS & AUTH ---
    const changePassword = async (newPass) => {
        await fetch(`${API_URL}/admin/password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: newPass })
        });
    };

    const verifyAdminPassword = async (username, password) => {
        try {
            const res = await fetch(`${API_URL}/admin/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            return data.success;
        } catch {
            return false;
        }
    };

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const googleUser = result.user;

            // Sync with backend
            const res = await fetch(`${API_URL}/users/google-auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: googleUser.email,
                    name: googleUser.displayName,
                    googleId: googleUser.uid
                })
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data);
                localStorage.setItem('art_user', JSON.stringify(data));
                if (data.likedProducts) setLikedIds([...data.likedProducts, ...data.likedGallery]);
                return { success: true };
            } else {
                return { success: false, message: 'Backend sync failed' };
            }
        } catch (error) {
            console.error("Google Login Error:", error);
            return { success: false, message: error.message };
        }
    };

    const loginUser = async (username, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            localStorage.setItem('art_user', JSON.stringify(userData));
            setLikedIds([...(userData.likedProducts || []), ...(userData.likedGallery || [])]);
            return { success: true };
        } else {
            return { success: false, message: 'Invalid credentials' };
        }
    };

    const registerUser = async (username, password) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            localStorage.setItem('art_user', JSON.stringify(userData));
            return { success: true };
        } else {
            return { success: false, message: 'Registration failed' };
        }
    };

    const logoutUser = () => {
        setUser(null);
        setLikedIds([]);
        localStorage.removeItem('art_user');
    };

    return (
        <AppContext.Provider value={{
            products, addProduct, deleteProduct, updateProduct, toggleLike, likedIds,
            galleryItems, addGalleryItem, deleteGalleryItem, toggleGalleryLike,
            messages, addMessage, deleteMessage,
            orders, addOrder, deleteOrder,
            isAdmin, setIsAdmin, changePassword, verifyAdminPassword,
            loginWithGoogle, isLoadingAuth,
            user, loginUser, registerUser, logoutUser
        }}>
            {children}
        </AppContext.Provider>
    );
};
