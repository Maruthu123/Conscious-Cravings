import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, doc, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { Bell, BellOff, ArrowRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { CATEGORY, fetchMenu, saveMenu } from '../lib/menuData';
import { ORDER_STEPS } from '../lib/orderStatus';

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return null;

  if (!user || !isAdmin) {
    return (
      <main className="page">
        <div className="wrap not-authorized">
          <h2>Admin access only</h2>
          <p>Log in with an admin email to see this page.</p>
          {user && (
            <p style={{ marginTop: 10, fontSize: 13 }}>
              You are signed in as <b>{user.email}</b>. Add this address to
              <code> src/lib/adminConfig.js </code> and to
              <code> firestore.rules </code> to unlock the dashboard.
            </p>
          )}
          <p style={{ marginTop: 14 }}>
            <a className="btn-primary" href="/login">Log in</a>
          </p>
        </div>
      </main>
    );
  }

  return <AdminApp />;
}

// ---------------------------------------------------------------------
// Orders are loaded once, here, and shared by the Dashboard and Orders
// tabs — so switching tabs never re-fetches, and a new order rings the
// bell no matter which tab is open.
// ---------------------------------------------------------------------
function useLiveOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [newCount, setNewCount] = useState(0);
  const firstSnapshot = useRef(true);

  useEffect(() => {
    // No orderBy: documents whose createdAt has not been written by the
    // server yet would otherwise be dropped from the results. Sorting
    // happens in the browser instead.
    const q = query(collection(db, 'orders'));

    const unsub = onSnapshot(
      q,
      (snap) => {
        setError('');
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));

        const added = snap.docChanges().filter((c) => c.type === 'added');

        if (firstSnapshot.current) {
          firstSnapshot.current = false;
        } else if (added.length) {
          setNewCount((n) => n + added.length);
          added.forEach((c) => pingNewOrder(c.doc.data()));
        }
      },
      (err) => setError(err.message)
    );

    return unsub;
  }, []);

  const sorted = useMemo(() => {
    if (!orders) return null;
    return [...orders].sort((a, b) => {
      const at = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bt = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bt - at;
    });
  }, [orders]);

  return { orders: sorted, error, newCount, clearNew: () => setNewCount(0) };
}

// Short chime + desktop notification + tab-title flash, so the kitchen
// notices an order even when the browser is in the background.
function pingNewOrder(data) {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) {
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch {
    /* audio is a nicety, never block on it */
  }

  const body = `${data?.mealName || 'Order'} — ${data?.dayLabel || ''} · ₹${data?.price ?? ''}`;

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification('New order received', { body });
    } catch {
      /* some browsers block constructor notifications */
    }
  }

  const original = document.title;
  document.title = '🔔 New order!';
  setTimeout(() => {
    document.title = original;
  }, 6000);
}

function AdminApp() {
  const [tab, setTab] = useState('dashboard');
  const { orders, error, newCount, clearNew } = useLiveOrders();

  const [notifyOn, setNotifyOn] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );

  async function enableNotifications() {
    if (typeof Notification === 'undefined') return;
    const result = await Notification.requestPermission();
    setNotifyOn(result === 'granted');
  }

  function openTab(next) {
    setTab(next);
    if (next === 'orders') clearNew();
  }

  return (
    <main className="page">
      <div className="wrap page-hero">
        <h1>Admin dashboard</h1>
        <p>
          Edit the weekly menu and update order status — changes go live on the
          site immediately.
        </p>
      </div>

      <div className="wrap page-body">
        <div className="admin-tabs">
          <button
            className={`admin-tab ${tab === 'dashboard' ? 'active' : ''}`}
            onClick={() => openTab('dashboard')}
          >
            Dashboard
          </button>

          <button
            className={`admin-tab ${tab === 'orders' ? 'active' : ''}`}
            onClick={() => openTab('orders')}
          >
            Orders
            {newCount > 0 && <span className="tab-badge">{newCount}</span>}
          </button>

          <button
            className={`admin-tab ${tab === 'menu' ? 'active' : ''}`}
            onClick={() => openTab('menu')}
          >
            Menu editor
          </button>

          <button
            className={`admin-tab alert-toggle ${notifyOn ? 'on' : ''}`}
            onClick={enableNotifications}
            title={
              notifyOn
                ? 'Desktop alerts are on'
                : 'Turn on a desktop alert for every new order'
            }
          >
            {notifyOn ? <Bell size={15} /> : <BellOff size={15} />}
            {notifyOn ? 'Alerts on' : 'Turn on alerts'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {tab === 'dashboard' && <Dashboard orders={orders} error={error} />}
            {tab === 'orders' && <OrdersManager orders={orders} error={error} />}
            {tab === 'menu' && <MenuEditor />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

function Dashboard({ orders, error }) {
  if (error) return <ErrorBox error={error} />;
  if (!orders) return <div className="empty-state">Loading…</div>;

  const today = new Date();
  const isToday = (o) => {
    const d = o.createdAt?.toDate ? o.createdAt.toDate() : null;
    return d ? d.toDateString() === today.toDateString() : false;
  };

  const counts = ORDER_STEPS.reduce((acc, s) => {
    acc[s.key] = orders.filter((o) => o.status === s.key).length;
    return acc;
  }, {});

  const revenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.price) || 0), 0);

  const todaysOrders = orders.filter(isToday);
  const pending = orders.filter((o) => o.status !== 'delivered');

  const stats = [
    { label: 'Total orders', value: orders.length },
    { label: "Today's orders", value: todaysOrders.length },
    { label: 'Pending', value: pending.length, accent: pending.length > 0 },
    { label: 'Total value', value: `₹${revenue}` },
  ];

  return (
    <div>
      <div className="stat-grid">
        {stats.map((s) => (
          <div className={`stat-card ${s.accent ? 'accent' : ''}`} key={s.label}>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="stat-breakdown">
        <h3>By status</h3>
        {ORDER_STEPS.map((s) => (
          <div className="breakdown-row" key={s.key}>
            <span className={`status-badge status-${s.key}`}>{s.label}</span>
            <span className="breakdown-count">{counts[s.key]}</span>
          </div>
        ))}
      </div>

      <div className="stat-breakdown">
        <h3>Latest orders</h3>
        {orders.length === 0 && <p className="breakdown-empty">Nothing yet.</p>}
        {orders.slice(0, 5).map((o) => (
          <div className="breakdown-row" key={o.id}>
            <span>
              <b>{o.mealName}</b> · {o.customerEmail || 'unknown customer'}
            </span>
            <span className={`status-badge status-${o.status}`}>{o.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorBox({ error }) {
  const isPermission = /permission|insufficient/i.test(error);

  return (
    <div className="empty-state error-state">
      <b>Could not load orders.</b>
      <span className="error-detail">{error}</span>
      {isPermission && (
        <span className="error-detail">
          Add your admin email to both <code>src/lib/adminConfig.js</code> and the
          <code> isAdmin() </code> function in <code>firestore.rules</code>, then
          redeploy the rules.
        </span>
      )}
    </div>
  );
}

function OrdersManager({ orders, error }) {
  // rowState[id] = 'saving' | 'saved' | an error string
  const [rowState, setRowState] = useState({});

  async function setStatus(id, value) {
    setRowState((s) => ({ ...s, [id]: 'saving' }));

    try {
      await updateDoc(doc(db, 'orders', id), { status: value });
      setRowState((s) => ({ ...s, [id]: 'saved' }));
      setTimeout(
        () => setRowState((s) => ({ ...s, [id]: undefined })),
        2500
      );
    } catch (err) {
      // Firestore silently rolls the value back when the write is
      // rejected, which looked exactly like "the click did nothing".
      // Now the reason is printed on the row itself.
      setRowState((s) => ({ ...s, [id]: err.message }));
    }
  }

  if (error) return <ErrorBox error={error} />;
  if (!orders) return <div className="empty-state">Loading…</div>;
  if (orders.length === 0) return <div className="empty-state">No orders yet.</div>;

  return (
    <div>
      <p className="orders-hint">
        Tap a stage to move the order. The customer&apos;s tracker updates
        straight away.
      </p>

      {orders.map((o) => {
        const when = o.createdAt?.toDate
          ? o.createdAt.toDate().toLocaleString('en-IN')
          : 'just now';

        const currentIndex = ORDER_STEPS.findIndex((s) => s.key === o.status);
        const next = ORDER_STEPS[currentIndex + 1];
        const state = rowState[o.id];
        const saving = state === 'saving';

        return (
          <div className="admin-order-row" key={o.id}>
            <div className="order-meta">
              <b>{o.mealName}</b> — {o.dayLabel} · ₹{o.price}
              <br />
              {o.customerName ? `${o.customerName} · ` : ''}
              {o.customerEmail || 'unknown customer'}
              {o.customerPhone ? ` · ${o.customerPhone}` : ''} · {when}
            </div>

            <div className="stage-controls">
              <div className="stage-row">
                {ORDER_STEPS.map((step, i) => (
                  <button
                    key={step.key}
                    type="button"
                    disabled={saving}
                    className={`stage-btn ${
                      i === currentIndex ? 'current' : ''
                    } ${i < currentIndex ? 'past' : ''}`}
                    onClick={() => setStatus(o.id, step.key)}
                  >
                    {step.key === 'preparing' ? 'Preparing' : step.label}
                  </button>
                ))}
              </div>

              <div className="stage-foot">
                {next && (
                  <button
                    type="button"
                    className="stage-next"
                    disabled={saving}
                    onClick={() => setStatus(o.id, next.key)}
                  >
                    Move to {next.label} <ArrowRight size={14} />
                  </button>
                )}

                {saving && <span className="stage-msg">Saving…</span>}
                {state === 'saved' && (
                  <span className="stage-msg ok">Updated ✓</span>
                )}
                {state && state !== 'saving' && state !== 'saved' && (
                  <span className="stage-msg bad">{state}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MenuEditor() {
  const [days, setDays] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchMenu()
      .then(setDays)
      .catch((err) => setStatus('Error: ' + err.message));
  }, []);

  function updateField(dIdx, mKey, field, value) {
    setDays((prev) => {
      const next = prev.map((d) => ({ ...d, meal1: { ...d.meal1 }, meal2: { ...d.meal2 } }));
      const meal = next[dIdx][mKey];
      if (field === 'items') meal.items = value.split('\n').map((s) => s.trim()).filter(Boolean);
      else if (field === 'price') meal.price = Number(value);
      else if (field === 'protein') meal.protein = value;
      else meal[field] = value;
      return next;
    });
  }

  async function handleSave() {
    setStatus('Saving…');
    try {
      await saveMenu(days);
      setStatus('Saved ✓ — live on the site now.');
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
    setTimeout(() => setStatus(''), 4000);
  }

  if (!days) return <div className="empty-state">{status || 'Loading menu…'}</div>;

  return (
    <div>
      {days.map((day, dIdx) => (
        <div className="admin-day-block" key={day.day}>
          <h3>{day.label}</h3>
          <div className="admin-meal-grid">
            {['meal1', 'meal2'].map((mKey) => {
              const meal = day[mKey];
              return (
                <div key={mKey}>
                  <div className="admin-field">
                    <label>Dish name</label>
                    <input value={meal.name} onChange={(e) => updateField(dIdx, mKey, 'name', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Price (₹)</label>
                    <input type="number" value={meal.price} onChange={(e) => updateField(dIdx, mKey, 'price', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Category</label>
                    <select value={meal.category} onChange={(e) => updateField(dIdx, mKey, 'category', e.target.value)}>
                      {Object.keys(CATEGORY).map((key) => (
                        <option key={key} value={key}>{CATEGORY[key].label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Photo URL</label>
                    <input value={meal.image} onChange={(e) => updateField(dIdx, mKey, 'image', e.target.value)} />
                  </div>
                  <label className="admin-checkbox">
                    <input type="checkbox" checked={meal.protein} onChange={(e) => updateField(dIdx, mKey, 'protein', e.target.checked)} />
                    Has a protein choice
                  </label>
                  <div className="admin-field">
                    <label>Items (one per line)</label>
                    <textarea value={meal.items.join('\n')} onChange={(e) => updateField(dIdx, mKey, 'items', e.target.value)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="admin-save-row">
        <span className="save-status">{status}</span>
        <motion.button className="btn-primary" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={handleSave}>
          Save menu
        </motion.button>
      </div>
    </div>
  );
}
