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

    const API_URL = 'http://localhost:5000/api';

    // --- FETCH DATA ---
    const fetchData = async () => {
        try {
            const [prodRes, galRes, msgRes, ordRes, passRes] = await Promise.all([
                fetch(`${API_URL}/products`),
                fetch(`${API_URL}/gallery`),
                fetch(`${API_URL}/messages`),
                fetch(`${API_URL}/orders`),
                fetch(`${API_URL}/admin/password`)
            ]);

            setProducts(await prodRes.json());
            setGalleryItems(await galRes.json());
            setMessages(await msgRes.json());
            setOrders(await ordRes.json());

            const passData = await passRes.json();
            if (passData.password) setAdminPassword(passData.password);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoadingAuth(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Poll for updates every 5 seconds (Simple Real-time simulation)
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    // --- PRODUCTS ---
    const addProduct = async (product) => {
        await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        fetchData();
    };

    const deleteProduct = async (id) => {
        await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const updateProduct = async (updated) => {
        // Not fully implemented in backend in this step, but placeholder
        // In real app, add PUT /products/:id
    };

    // --- GALLERY ---
    const addGalleryItem = async (item) => {
        await fetch(`${API_URL}/gallery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
        fetchData();
    };

    const deleteGalleryItem = async (id) => {
        await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE' });
        fetchData();
    };

    // --- LIKES (Unified Logic) ---
    // Sync likedIds with User state whenever User changes
    useEffect(() => {
        if (user) {
            setLikedIds([...(user.likedProducts || []), ...(user.likedGallery || [])]);
        } else {
            setLikedIds([]);
        }
    }, [user]);

    const updateUserLikesInBackend = async (updatedUser) => {
        if (!updatedUser || !updatedUser._id) return;
        try {
            await fetch(`${API_URL}/users/${updatedUser._id}/likes`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    likedProducts: updatedUser.likedProducts,
                    likedGallery: updatedUser.likedGallery
                })
            });
        } catch (error) {
            console.error("Failed to sync likes to backend:", error);
        }
    };

    const toggleLike = async (id) => {
        const isLiked = likedIds.includes(id);

        // Optimistic UI Update
        const newLikes = isLiked ? likedIds.filter(i => i !== id) : [...likedIds, id];
        setLikedIds(newLikes);

        // Update Server Count
        await fetch(`${API_URL}/products/${id}/like`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ increment: !isLiked })
        });

        // Update User State & Persist to DB
        if (user) {
            const updatedUser = {
                ...user,
                likedProducts: isLiked ? user.likedProducts.filter(x => x !== id) : [...(user.likedProducts || []), id]
            };
            setUser(updatedUser);
            localStorage.setItem('art_user', JSON.stringify(updatedUser)); // Local Backup
            updateUserLikesInBackend(updatedUser); // DB Sync
        }
        fetchData();
    };

    const toggleGalleryLike = async (id) => {
        const isLiked = likedIds.includes(id);

        // Optimistic UI Update
        const newLikes = isLiked ? likedIds.filter(i => i !== id) : [...likedIds, id];
        setLikedIds(newLikes);

        // Update Server Count
        await fetch(`${API_URL}/gallery/${id}/like`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ increment: !isLiked })
        });

        // Update User State & Persist to DB
        if (user) {
            const updatedUser = {
                ...user,
                likedGallery: isLiked ? user.likedGallery.filter(x => x !== id) : [...(user.likedGallery || []), id]
            };
            setUser(updatedUser);
            localStorage.setItem('art_user', JSON.stringify(updatedUser));
            updateUserLikesInBackend(updatedUser);
        }
        fetchData();
    };

    // --- MESSAGES & ORDERS ---
    const addMessage = async (msg) => {
        await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(msg)
        });
        fetchData();
    };

    const deleteMessage = async (id) => {
        await fetch(`${API_URL}/messages/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const addOrder = async (order) => {
        await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        fetchData();
    };

    const deleteOrder = async (id) => {
        await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
        fetchData();
    };

    // --- SETTINGS & AUTH ---
    const changePassword = async (newPass) => {
        await fetch(`${API_URL}/admin/password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: newPass })
        });
        setAdminPassword(newPass);
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
            isAdmin, setIsAdmin, adminPassword, changePassword, isLoadingAuth,
            user, loginUser, registerUser, logoutUser
        }}>
            {children}
        </AppContext.Provider>
    );
};
