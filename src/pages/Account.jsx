import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Check } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { ORDER_STEPS, STATUS_LABEL } from '../lib/orderStatus';

function formatDate(ts) {
  if (!ts || !ts.toDate) return 'just now';
  return ts.toDate().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

// Newest first. Done in the browser instead of Firestore's orderBy so the
// query stays a single equality filter — a composite index is then not
// required, which is what the "query requires an index" error was about.
function sortNewestFirst(list) {
  return [...list].sort((a, b) => {
    const at = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const bt = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return bt - at;
  });
}

function OrderTracker({ status }) {
  const current = Math.max(
    0,
    ORDER_STEPS.findIndex((s) => s.key === status)
  );

  return (
    <div className="track" role="group" aria-label="Order progress">
      <div className="track-line">
        <motion.span
          className="track-line-fill"
          initial={false}
          animate={{
            width: `${(current / (ORDER_STEPS.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      </div>

      <div className="track-steps">
        {ORDER_STEPS.map((step, i) => {
          const state = i < current ? 'done' : i === current ? 'active' : 'todo';
          return (
            <div className={`track-step is-${state}`} key={step.key}>
              <span className="track-dot">
                {state === 'done' ? <Check size={12} strokeWidth={3} /> : i + 1}
              </span>
              <span className="track-label">{step.label}</span>
              <span className="track-hint">{step.hint}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
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

    // Equality filter only — no orderBy, so no composite index needed.
    const q = query(collection(db, 'orders'), where('uid', '==', user.uid));

    const unsub = onSnapshot(
      q,
      (snap) => {
        setError('');
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (err) => setError(err.message)
    );

    return unsub;
  }, [user, loading, navigate]);

  const sorted = useMemo(() => (orders ? sortNewestFirst(orders) : null), [orders]);

  const active = sorted ? sorted.filter((o) => o.status !== 'delivered').length : 0;

  return (
    <main className="page">
      <div className="wrap page-hero">
        <h1>My Orders</h1>
        <p>
          Live status for every order you&apos;ve placed — updates the moment the
          kitchen changes it.
        </p>
        {sorted && sorted.length > 0 && (
          <p className="page-hero-meta">
            {sorted.length} order{sorted.length === 1 ? '' : 's'} · {active} in progress
          </p>
        )}
      </div>

      <div className="wrap page-body">
        {error && (
          <div className="empty-state error-state">
            <b>Could not load orders.</b>
            <span className="error-detail">{error}</span>
          </div>
        )}

        {!error && !sorted && <div className="empty-state">Loading your orders…</div>}

        {!error && sorted && sorted.length === 0 && (
          <div className="empty-state">
            No orders yet. Place one from the{' '}
            <Link to="/" state={{ scrollTo: 'menu' }}>Menu</Link> page.
          </div>
        )}

        {!error && sorted && sorted.length > 0 && (
          <AnimatePresence>
            {sorted.map((o) => (
              <motion.div
                key={o.id}
                className="order-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                layout
              >
                <div className="order-head">
                  <div className="order-main">
                    <h3>
                      {o.mealName}{' '}
                      <span style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>
                        — {o.dayLabel}
                      </span>
                    </h3>
                    <p>₹{o.price} · Ordered {formatDate(o.createdAt)}</p>
                  </div>
                  <span className={`status-badge status-${o.status}`}>
                    {STATUS_LABEL[o.status] || o.status}
                  </span>
                </div>

                <OrderTracker status={o.status} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
