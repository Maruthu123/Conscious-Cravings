import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingContact from './components/FloatingContact';
import Home from './pages/Home';
import Login from './pages/Login';
import Account from './pages/Account';
import Admin from './pages/Admin';

// Without this, React Router keeps the previous page's scroll position.
// Going from the bottom of the long homepage to the short /login page
// dropped you straight onto the footer — this puts every new route back
// at the top. The homepage is skipped when it carries a "scrollTo"
// instruction, because Home handles that jump itself.
function ScrollToTop() {
  const { pathname, state } = useLocation();

  useEffect(() => {
    if (pathname === '/' && state?.scrollTo) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, state]);

  return null;
}

function PageTransition({ children }) {
  return (
    <motion.div
      className="page-fade"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/account" element={<PageTransition><Account /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Header />
      <AnimatedRoutes />
      <Footer />
      <FloatingContact />
    </AuthProvider>
  );
}
