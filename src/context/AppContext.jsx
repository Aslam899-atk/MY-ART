import React, { createContext, useState, useEffect } from 'react';

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

    const [adminPassword, setAdminPassword] = useState('aslam123');
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // const API_URL = 'https://my-art-void-server.onrender.com/api';
    // const API_URL = 'https://my-art-void-server.onrender.com/api';
    const API_URL = 'http://localhost:5001/api';

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
        setProducts((prev) => prev.filter((p) => p.id !== id));
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
            setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        }
    };

    const toggleLike = async (id, increment = true) => {
        // If user not logged in, prompt for Gmail (username) and password and log in inline
        if (!user) {
            const email = window.prompt('Enter your Gmail');
            const password = window.prompt('Enter your password');
            if (email && password) {
                try {
                    const res = await fetch(`${API_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: email, password })
                    });
                    if (res.ok) {
                        const userData = await res.json();
                        setUser(userData);
                        localStorage.setItem('art_user', JSON.stringify(userData));
                        setLikedIds([...(userData.likedProducts || []), ...(userData.likedGallery || [])]);
                    } else {
                        alert('Login failed: Invalid credentials');
                        return;
                    }
                } catch (e) {
                    console.error('Login error', e);
                    alert('Login error occurred');
                    return;
                }
            } else {
                alert('Login required to like items.');
                return;
            }
        }
        // Proceed with like request
        await fetch(`${API_URL}/products/${id}/like`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ increment })
        });
        // Refresh products after like change
        fetchData();
    };

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
        setGalleryItems((prev) => prev.filter((g) => g.id !== id));
    };

    const toggleGalleryLike = async (id, increment = true) => {
        await fetch(`${API_URL}/gallery/${id}/like`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ increment })
        });
        fetchData();
    };

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
        setMessages((prev) => prev.filter((m) => m.id !== id));
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
        setOrders((prev) => prev.filter((o) => o.id !== id));
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
