/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [messages, setMessages] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [appSettings, setAppSettings] = useState({});

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

    const likedIds = React.useMemo(() => {
        return user ? [...(user.likedProducts || []), ...(user.likedGallery || [])] : [];
    }, [user]);

    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [isAdmin, setIsAdmin] = useState(() => {
        return localStorage.getItem('art_admin_active') === 'true';
    });

    // Dynamic API URL based on environment
    const API_URL = import.meta.env.DEV
        ? `http://${window.location.hostname}:5001/api`
        : 'https://my-art-void-server.onrender.com/api';

    // --- FETCH DATA ---
    const fetchData = useCallback(async () => {
        try {
            const canSeeAll = isAdmin || (user && user.role === 'emblos');
            const query = canSeeAll ? '?all=true' : '';

            const [prodRes, galRes, msgRes, ordRes, usersRes] = await Promise.all([
                fetch(`${API_URL}/products${query}`),
                fetch(`${API_URL}/gallery${query}`),
                fetch(`${API_URL}/messages`),
                fetch(`${API_URL}/orders`),
                fetch(`${API_URL}/users`)
            ]);

            setProducts(await prodRes.json());
            setGalleryItems(await galRes.json());
            setMessages(await msgRes.json());
            setOrders(await ordRes.json());
            setUsers(await usersRes.json());

            // Fetch Emblos Config
            const configRes = await fetch(`${API_URL}/settings/emblos_config`);
            const configData = await configRes.json();
            setAppSettings(prev => ({ ...prev, emblos_config: configData.value }));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [API_URL, isAdmin, user]);

    const syncUserWithBackend = useCallback(async (googleUser) => {
        try {
            const res = await fetch(`${API_URL}/users/google-auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: googleUser.email,
                    name: googleUser.user_metadata?.full_name || googleUser.email.split('@')[0],
                    googleId: googleUser.id,
                    avatar: googleUser.user_metadata?.avatar_url
                })
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Backend sync successful:", data.username);
                setUser(data);
                localStorage.setItem('art_user', JSON.stringify(data));
            } else {
                const errorData = await res.json().catch(() => ({}));
                console.error("Backend Sync Failed:", res.status, errorData);
            }
        } catch (e) {
            console.error("Backend Sync Error:", e);
        }
    }, [API_URL]);

    // --- EMBLOS ACTIONS ---
    const requestEmblosAccess = async (data) => {
        if (!user) return;
        const res = await fetch(`${API_URL}/users/${user._id || user.id}/request-emblos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            const updatedUser = await res.json();
            setUser(updatedUser);
            localStorage.setItem('art_user', JSON.stringify(updatedUser));
            fetchData();
        }
    };

    const updateEmblosStatus = async (userId, data) => {
        const res = await fetch(`${API_URL}/users/${userId}/emblos-status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            fetchData();
        }
    };

    const deleteUserByEmail = async (email) => {
        const res = await fetch(`${API_URL}/users/delete-by-email`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (res.ok) {
            fetchData();
            return { success: true };
        } else {
            const data = await res.json();
            return { success: false, message: data.message };
        }
    };

    // --- ORDER ACTIONS ---
    const submitOrderPrice = async (orderId, price) => {
        const res = await fetch(`${API_URL}/orders/${orderId}/price`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price })
        });
        if (res.ok) fetchData();
    };

    const approveOrderPrice = async (orderId) => {
        const res = await fetch(`${API_URL}/orders/${orderId}/approve-price`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) fetchData();
    };

    const claimOrder = async (orderId, price) => {
        const res = await fetch(`${API_URL}/orders/${orderId}/claim`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                creatorId: user?._id || user?.id,
                price: Number(price)
            })
        });
        if (res.ok) {
            fetchData();
            return { success: true };
        }
        return { success: false };
    };

    const updateAppSetting = async (key, value) => {
        const res = await fetch(`${API_URL}/settings/${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value })
        });
        if (res.ok) {
            const data = await res.json();
            setAppSettings(prev => ({ ...prev, [key]: data.value }));
            return { success: true };
        }
        return { success: false };
    };

    const sendInternalMessage = async (data) => {
        const res = await fetch(`${API_URL}/messages/internal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) fetchData();
    };

    // ---------- Product CRUD ----------
    const addProduct = async (product) => {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...product, creatorId: user?._id || user?.id })
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
            await loginWithGoogle();
            return;
        }

        const userId = user._id || user.id;
        const endpoint = type === 'product' ? 'products' : 'gallery';

        try {
            const res = await fetch(`${API_URL}/${endpoint}/${id}/like`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            if (res.ok) {
                const data = await res.json();
                // Update local user state immediately
                setUser(data.user);
                localStorage.setItem('art_user', JSON.stringify(data.user));

                // Refresh data to show updated like counts
                fetchData();
            }
        } catch (error) {
            console.error("Like Action Error:", error);
        }
    };

    const toggleLike = (id) => handleLikeAction('product', id);

    const addProductComment = async (id, text) => {
        if (!user) {
            await loginWithGoogle();
            return;
        }
        const res = await fetch(`${API_URL}/products/${id}/comment`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user.username, text })
        });
        if (res.ok) {
            const updated = await res.json();
            setProducts((prev) => prev.map((p) => ((p._id || p.id) === id ? updated : p)));
            return { success: true };
        }
        return { success: false };
    };
    // ---------- Gallery CRUD ----------
    const addGalleryItem = async (item) => {
        const res = await fetch(`${API_URL}/gallery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, creatorId: user?._id || user?.id })
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

    const updateGalleryItem = async (item) => {
        const { id, ...rest } = item;
        const res = await fetch(`${API_URL}/gallery/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rest)
        });
        if (res.ok) {
            const updated = await res.json();
            setGalleryItems((prev) => prev.map((g) => ((g._id || g.id) === id ? updated : g)));
        }
    };

    const toggleGalleryLike = (id) => handleLikeAction('gallery', id);

    const addGalleryComment = async (id, text) => {
        if (!user) {
            await loginWithGoogle();
            return;
        }
        const res = await fetch(`${API_URL}/gallery/${id}/comment`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user.username, text })
        });
        if (res.ok) {
            const updated = await res.json();
            setGalleryItems((prev) => prev.map((g) => ((g._id || g.id) === id ? updated : g)));
            return { success: true };
        }
        return { success: false };
    };

    const deleteGalleryComment = async (itemId, commentId) => {
        const res = await fetch(`${API_URL}/gallery/${itemId}/comment/${commentId}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            const updated = await res.json();
            setGalleryItems((prev) => prev.map((g) => ((g._id || g.id) === itemId ? updated : g)));
            return { success: true };
        }
        return { success: false };
    };

    const deleteProductComment = async (productId, commentId) => {
        const res = await fetch(`${API_URL}/products/${productId}/comment/${commentId}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            const updated = await res.json();
            setProducts((prev) => prev.map((p) => ((p._id || p.id) === productId ? updated : p)));
            return { success: true };
        }
        return { success: false };
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
        setMessages((prev) => prev.filter((m) => (m._id || m.id) !== id));
    };

    // ---------- Order CRUD ----------
    const addOrder = async (order) => {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...order,
                customerId: user?._id || user?.id,
                customer: user?.username,
                email: user?.email,
                status: 'Pending Price' // Default for new orders
            })
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

    const updateOrderStatus = async (id, statusOrDeliveryStatus, isDeliveryStatus = false) => {
        const body = isDeliveryStatus
            ? { deliveryStatus: statusOrDeliveryStatus }
            : { status: statusOrDeliveryStatus };

        const res = await fetch(`${API_URL}/orders/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            const updated = await res.json();
            setOrders((prev) => prev.map((o) => ((o._id || o.id) === id ? updated : o)));
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [fetchData]);

    // --- AUTH LISTENER FOR SUPABASE ---
    useEffect(() => {
        // 1. Initial Session Check
        const checkInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) console.error("Supabase Session Error:", error);

                if (session) {
                    console.log("Supabase session found, syncing...");
                    await syncUserWithBackend(session.user);
                }
            } catch (err) {
                console.error("Initial Session Check Failed:", err);
            } finally {
                await fetchData();
                setIsLoadingAuth(false);
            }
        };

        checkInitialSession();

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                await syncUserWithBackend(session.user);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                localStorage.removeItem('art_user');
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchData, syncUserWithBackend]);




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
        if (supabase.auth.signInWithOAuth === undefined || !import.meta.env.VITE_SUPABASE_URL) {
            alert("SUPABASE CONFIG MISSING: Please check your Vercel Environment Variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).");
            return { success: false };
        }
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            });
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error("Google Login Error:", error);
            alert("Login Failed: " + error.message);
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

    const logoutUser = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem('art_user');
        localStorage.removeItem('art_admin_active');
    };

    const handleSetIsAdmin = (value) => {
        setIsAdmin(value);
        if (value) {
            localStorage.setItem('art_admin_active', 'true');
        } else {
            localStorage.removeItem('art_admin_active');
        }
    };

    return (
        <AppContext.Provider value={{
            products, addProduct, deleteProduct, updateProduct, toggleLike, likedIds, addProductComment, deleteProductComment,
            galleryItems, addGalleryItem, deleteGalleryItem, updateGalleryItem, toggleGalleryLike, addGalleryComment, deleteGalleryComment,
            messages, addMessage, deleteMessage, sendInternalMessage,
            orders, addOrder, deleteOrder, updateOrderStatus, submitOrderPrice, approveOrderPrice, claimOrder,
            users, requestEmblosAccess, updateEmblosStatus, deleteUserByEmail,
            appSettings, updateAppSetting,
            isAdmin, setIsAdmin: handleSetIsAdmin, changePassword, verifyAdminPassword,
            loginWithGoogle, isLoadingAuth,
            user, loginUser, registerUser, logoutUser
        }}>
            {children}
        </AppContext.Provider>
    );
};
