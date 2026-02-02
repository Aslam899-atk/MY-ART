import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, AppContext } from './context/AppContext';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPopup from './components/LoginPopup';
// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Shop = React.lazy(() => import('./pages/Shop'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Login = React.lazy(() => import('./pages/Login'));
const Admin = React.lazy(() => import('./pages/Admin'));
const RequestAccess = React.lazy(() => import('./pages/RequestAccess'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const UserOrders = React.lazy(() => import('./pages/UserOrders'));
const SupabaseHelp = React.lazy(() => import('./pages/SupabaseHelp'));


const MeshBackground = () => (
  <div className="mesh-bg">
    <div className="mesh-bg-item mesh-bg-1"></div>
    <div className="mesh-bg-item mesh-bg-2"></div>
  </div>
);

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
  >
    {children}
  </motion.div>
);


function AppContent() {
  const { isLoadingAuth, galleryItems } = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(true);
  const location = useLocation();

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

      // Wait for all resources
      await Promise.all(promises);
      setLoading(false);
    };

    // 6. Dynamic Title Management
    const path = window.location.pathname;
    const titles = {
      '/': 'ART VOID | Creative Masterpieces',
      '/gallery': 'Gallery | ART VOID Laboratory',
      '/shop': 'Art Store | Acquire Masterpieces',
      '/contact': 'Inquiry | Custom Commissions',
      '/dashboard': 'Emblos Console | Dashboard',
      '/orders': 'Track Orders | ART VOID',
      '/admin': 'Admin Console | ART VOID'
    };
    document.title = titles[path] || 'ART VOID';

    loadResources();
  }, [isLoadingAuth, galleryItems, location.pathname]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="app">
      <MeshBackground />

      <LoginPopup />
      <Navbar />
      <React.Suspense fallback={<Preloader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/shop" element={<PageWrapper><Shop /></PageWrapper>} />
            <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
            <Route path="/galleryView" element={<PageWrapper><Gallery /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
            <Route path="/request-access" element={<PageWrapper><RequestAccess /></PageWrapper>} />
            <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="/orders" element={<PageWrapper><UserOrders /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </React.Suspense>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
