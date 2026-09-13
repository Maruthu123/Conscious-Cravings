import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import Reveal from './Reveal';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_DAYS, CATEGORY, watchMenu } from '../lib/menuData';
import { whatsappLink, orderMessage } from '../lib/business';

export default function Menu() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [days, setDays] = useState(DEFAULT_DAYS);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  useEffect(() => {
    const unsub = watchMenu((d) => {
      setDays(d);
      setActiveDayIndex((i) => (i >= d.length ? 0 : i));
    });
    return unsub;
  }, []);

  // Resume an order that was started before the person logged in.
  useEffect(() => {
    if (!user) return;
    const raw = sessionStorage.getItem('pendingOrder');
    if (!raw) return;
    sessionStorage.removeItem('pendingOrder');
    const { dayLabel, mealKey } = JSON.parse(raw);
    const day = days.find((d) => d.label === dayLabel);
    if (day) placeOrder(day, mealKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function placeOrder(day, mealKey) {
    if (!user) {
      sessionStorage.setItem('pendingOrder', JSON.stringify({ dayLabel: day.label, mealKey }));
      navigate('/login', { state: { redirect: '/', scrollTo: 'menu' } });
      return;
    }
    const meal = day[mealKey];
    try {
      await addDoc(collection(db, 'orders'), {
        uid: user.uid,
        customerEmail: user.email,
        dayLabel: day.label,
        mealName: meal.name,
        price: meal.price,
        category: meal.category,
        status: 'received',
        createdAt: serverTimestamp(),
      });
      window.open(whatsappLink(orderMessage(day.label, meal)), '_blank', 'noreferrer');
      alert('Order placed! You can track its status any time under "My Orders".');
    } catch (err) {
      alert('Could not place the order: ' + err.message);
    }
  }

  const day = days[activeDayIndex];
  const meals = day ? [{ key: 'meal1', ...day.meal1 }, { key: 'meal2', ...day.meal2 }] : [];

  return (
    <section id="menu" className="section">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <h2>This week's menu</h2>
            <p>Every meal includes the items listed. Where a protein choice is marked, tell us at order time.</p>
          </div>
        </Reveal>

        <div className="day-strip">
          {days.map((d, i) => (
            <button
              key={d.day}
              className={`day-pill ${i === activeDayIndex ? 'active' : ''}`}
              onClick={() => setActiveDayIndex(i)}
            >
              {i === activeDayIndex && (
                <motion.span className="day-pill-bg" layoutId="dayPillBg" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
              )}
              <span className="d-num">{String(d.day).padStart(2, '0')}</span>
              <span className="d-label">{d.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeDayIndex}
            className="meal-grid"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {meals.map((meal) => {
              const cat = CATEGORY[meal.category];
              return (
                <div className="meal-card" key={meal.key}>
                  <div className="dish-photo">
                    <img src={meal.image} alt={meal.name} loading="lazy" />
                    <span className="photo-badge">{day.label}</span>
                    {cat && (
                      <span className="category-badge" style={{ background: cat.color }}>
                        {cat.label}
                      </span>
                    )}
                  </div>
                  <div className="meal-body">
                    <div className="meal-top">
                      <h3>{meal.name}</h3>
                      {meal.protein && <span className="meal-tag">Protein choice</span>}
                    </div>
                    <ul className="item-list">
                      {meal.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                    <div className="meal-bottom">
                     <div className="price">
                      ₹{meal.price} <span>/ </span>
                      <small>With delivery charge</small>
                    </div>
                      <motion.button
                        className="btn-order"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => placeOrder(day, meal.key)}
                      >
                        Order now
                      </motion.button>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <Reveal delay={0.1}>
          <div className="policy-note">
            <span className="policy-icon" aria-hidden="true">ⓘ</span>
            <div>
              <b>Cancellation policy —</b> cancel any order within 2 hours of placing it for a full
              refund. After that, preparation has usually begun and the order can no longer be
              cancelled or refunded.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
