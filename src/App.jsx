import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';
import SupabaseHelp from './pages/SupabaseHelp';


function AppContent() {
  const { isLoadingAuth, galleryItems } = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadResources = async () => {
      // 1. Wait for Auth/Data Fetch to complete
      if (isLoadingAuth) return;

      const promises = [];

      // 2. Minimum display time for smoothness (1.5s)
      promises.push(new Promise(resolve => setTimeout(resolve, 1500)));

      // 3. Preload Home Banner
      const bannerUrl = `${import.meta.env.BASE_URL}banner.png`;
      promises.push(new Promise((resolve) => {
        const img = new Image();
        img.src = bannerUrl;
        img.onload = resolve;
        img.onerror = resolve;
      }));

      // 4. Preload initial Gallery Images (Skipped for faster initial render)
      // We now use LazyImage component for better UX


      // 5. Wait for window load (optional but requested "fully loaded")
      if (document.readyState !== 'complete') {
        promises.push(new Promise(resolve => {
          window.addEventListener('load', resolve);
        }));
      }

      // Wait for all resources
      await Promise.all(promises);
      setLoading(false);
    };

    loadResources();
  }, [isLoadingAuth, galleryItems]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/galleryView" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />

        </Routes>

        <footer style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid var(--glass-border)', marginTop: '4rem' }}>
          &copy; 2024 ART VOID Studio. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
