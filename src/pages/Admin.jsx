import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { CATEGORY, fetchMenu, saveMenu } from '../lib/menuData';

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return null;

  if (!user || !isAdmin) {
    return (
      <main>
        <div className="wrap not-authorized">
          <h2>Admin access only</h2>
          <p>Log in with an admin email to see this page.</p>
          <p style={{ marginTop: 14 }}>
            <a className="btn-primary" href="/login">Log in</a>
          </p>
        </div>
      </main>
    );
  }

  return <AdminApp />;
}

function AdminApp() {
  const [tab, setTab] = useState('menu');

  return (
    <main>
      <div className="wrap page-hero">
        <h1>Admin dashboard</h1>
        <p>Edit the weekly menu and update order status — changes go live on the site immediately.</p>
      </div>

      <div className="wrap" style={{ paddingBottom: 80 }}>
        <div className="admin-tabs">
          <button className={`admin-tab ${tab === 'menu' ? 'active' : ''}`} onClick={() => setTab('menu')}>Menu editor</button>
          <button className={`admin-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>Orders</button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'menu' ? (
            <motion.div key="menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <MenuEditor />
            </motion.div>
          ) : (
            <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <OrdersManager />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function MenuEditor() {
  const [days, setDays] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchMenu().then(setDays);
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

  if (!days) return null;

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

function OrdersManager() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => setError(err.message)
    );
    return unsub;
  }, []);

  function handleStatusChange(id, value) {
    updateDoc(doc(db, 'orders', id), { status: value });
  }

  if (error) return <div className="empty-state">Could not load orders: {error}</div>;
  if (!orders) return null;
  if (orders.length === 0) return <div className="empty-state">No orders yet.</div>;

  return (
    <div>
      {orders.map((o) => {
        const when = o.createdAt && o.createdAt.toDate ? o.createdAt.toDate().toLocaleString('en-IN') : '';
        return (
          <div className="admin-order-row" key={o.id}>
            <div className="order-meta">
              <b>{o.mealName}</b> — {o.dayLabel} · ₹{o.price}<br />
              {o.customerEmail || 'unknown customer'} · {when}
            </div>
            <select className="admin-field" style={{ width: 'auto' }} value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)}>
              <option value="received">Order received</option>
              <option value="preparing">Food preparation started</option>
              <option value="ready">Ready for delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        );
      })}
    </div>
  );
}
