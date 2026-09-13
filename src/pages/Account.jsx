import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

const STATUS_LABEL = {
  received: 'Order received',
  preparing: 'Food preparation started',
  ready: 'Ready for delivery',
  delivered: 'Delivered',
};

function formatDate(ts) {
  if (!ts || !ts.toDate) return '';
  return ts.toDate().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function Account() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login', { state: { redirect: '/account' } });
      return;
    }
    const q = query(collection(db, 'orders'), where('uid', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => setError(err.message)
    );
    return unsub;
  }, [user, loading, navigate]);

  return (
    <main>
      <div className="wrap page-hero">
        <h1>My Orders</h1>
        <p>Live status for every order you've placed — updates the moment the kitchen changes it.</p>
      </div>

      <div className="wrap" style={{ paddingBottom: 80 }}>
        {error && <div className="empty-state">Could not load orders: {error}</div>}

        {!error && orders && orders.length === 0 && (
          <div className="empty-state">
            No orders yet. Place one from the <Link to="/" state={{ scrollTo: 'menu' }}>Menu</Link> page.
          </div>
        )}

        {!error && orders && orders.length > 0 && (
          <AnimatePresence>
            {orders.map((o) => (
              <motion.div
                key={o.id}
                className="order-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                layout
              >
                <div className="order-main">
                  <h3>{o.mealName} <span style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>— {o.dayLabel}</span></h3>
                  <p>₹{o.price} · Ordered {formatDate(o.createdAt)}</p>
                </div>
                <span className={`status-badge status-${o.status}`}>{STATUS_LABEL[o.status] || o.status}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
