import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('art_products');
        const defaultProducts = [
            { id: 1, name: "Midnight Nebula", price: 250, image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80", category: "Abstract", likes: 0 },
            { id: 2, name: "Golden Horizon", price: 180, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80", category: "Landscape", likes: 0 },
            { id: 3, name: "Ethereal Whispers", price: 320, image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=800&q=80", category: "Modern", likes: 0 }
        ];
        if (!saved) return defaultProducts;
        return JSON.parse(saved).map(p => ({ ...p, likes: p.likes || 0 }));
    });

    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('art_messages');
        return saved ? JSON.parse(saved) : [];
    });

    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('art_orders');
        return saved ? JSON.parse(saved) : [];
    });

    const [adminPassword, setAdminPassword] = useState(() => {
        const saved = localStorage.getItem('art_admin_password');
        return saved ? saved : 'admin123';
    });

    const [isAdmin, setIsAdmin] = useState(false);
    const [likedIds, setLikedIds] = useState(() => {
        const saved = localStorage.getItem('art_likedIds');
        return saved ? JSON.parse(saved) : [];
    });

    // Persist likedIds to localStorage
    useEffect(() => {
        localStorage.setItem('art_likedIds', JSON.stringify(likedIds));
    }, [likedIds]);

    useEffect(() => {
        localStorage.setItem('art_products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('art_messages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        localStorage.setItem('art_orders', JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem('art_admin_password', adminPassword);
    }, [adminPassword]);

    const addProduct = (product) => setProducts([...products, { ...product, id: Date.now(), category: product.category || 'Artwork', likes: 0 }]);
    const deleteProduct = (id) => setProducts(products.filter(p => p.id !== id));
    const updateProduct = (updated) => setProducts(products.map(p => p.id === updated.id ? updated : p));
    const toggleLike = (id) => {
        setProducts(prevProducts => prevProducts.map(p => {
            if (p.id === id) {
                const isLiked = likedIds.includes(id);
                return { ...p, likes: isLiked ? Math.max(0, (p.likes || 0) - 1) : (p.likes || 0) + 1 };
            }
            return p;
        }));

        setLikedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(likedId => likedId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const addMessage = (msg) => setMessages([...messages, { ...msg, id: Date.now(), date: new Date().toLocaleDateString() }]);
    const deleteMessage = (id) => setMessages(messages.filter(m => m.id !== id));

    const addOrder = (order) => setOrders([...orders, { ...order, id: Date.now(), status: 'Pending', date: new Date().toLocaleDateString() }]);
    const deleteOrder = (id) => setOrders(orders.filter(o => o.id !== id));

    const changePassword = (newPass) => setAdminPassword(newPass);

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
