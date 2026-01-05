import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [messages, setMessages] = useState([]);
    const [orders, setOrders] = useState([]);

    // User Auth State
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('art_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [likedIds, setLikedIds] = useState(() => {
        return user ? [...(user.likedProducts || []), ...(user.likedGallery || [])] : [];
    });

    const [adminPassword, setAdminPassword] = useState('aslam123');
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const API_URL = 'https://my-art-void-server.onrender.com/api';

    // --- FETCH DATA ---
    const fetchData = async () => {
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
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    // ... (Keep existing Product/Gallery/Message/Order functions)

    // --- SETTINGS & AUTH ---
    const changePassword = async (newPass) => {
        await fetch(`${API_URL}/admin/password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: newPass })
        });
    };

    const verifyAdminPassword = async (password) => {
        try {
            const res = await fetch(`${API_URL}/admin/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            return data.success;
        } catch (e) {
            return false;
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
            isAdmin, setIsAdmin, changePassword, verifyAdminPassword, isLoadingAuth,
            user, loginUser, registerUser, logoutUser
        }}>
            {children}
        </AppContext.Provider>
    );
};
