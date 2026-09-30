
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Leaf, Clock3, Heart, Star } from 'lucide-react';

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
      sessionStorage.setItem(
        'pendingOrder',
        JSON.stringify({
          dayLabel: day.label,
          mealKey,
        })
      );

      navigate('/login', {
        state: {
          redirect: '/',
          scrollTo: 'menu',
        },
      });

      return;
    }

    const meal = day[mealKey];

    try {
      await addDoc(collection(db, 'orders'), {
        uid: user.uid,
        customerEmail: user.email || '',
        customerName: user.displayName || '',
        customerPhone: user.phoneNumber || '',
        dayLabel: day.label,
        mealName: meal.name,
        price: meal.price,
        category: meal.category,
        status: 'received',
        createdAt: serverTimestamp(),
      });

      window.open(
        whatsappLink(orderMessage(day.label, meal)),
        '_blank',
        'noreferrer'
      );

      alert(
        'Order placed! You can track its status any time under "My Orders".'
      );
    } catch (err) {
      alert('Could not place the order: ' + err.message);
    }
  }

  const day = days[activeDayIndex];

  const meals = day
    ? [
        { key: 'meal1', ...day.meal1 },
        { key: 'meal2', ...day.meal2 },
      ]
    : [];

  return (
    <section id="menu" className="section menu-section">
      <div className="wrap">

        {/* =================================
            MENU INTRO SECTION
        ================================= */}

        <Reveal>
          <div className="menu-intro">

            {/* LEFT CONTENT */}

            <div className="menu-intro-content">

              <span className="menu-eyebrow">
                <Leaf size={15} />
                FRESH FROM OUR KITCHEN
              </span>

              <h2>This week's menu</h2>

              <p className="menu-intro-description">
                Every meal includes the items listed. Where a protein choice is marked, tell us at order time.
              </p>

              {/* Additional visual highlights */}

              <div className="menu-highlights">

                <div className="menu-highlight">
                  <span className="highlight-icon">
                    <Leaf size={17} />
                  </span>
                  <span>Freshly prepared</span>
                </div>

                <div className="menu-highlight">
                  <span className="highlight-icon">
                    <Heart size={17} />
                  </span>
                  <span>Balanced meals</span>
                </div>

                <div className="menu-highlight">
                  <span className="highlight-icon">
                    <Clock3 size={17} />
                  </span>
                  <span>Weekly menu</span>
                </div>

              </div>
            </div>

            {/* RIGHT SIDE IMAGE */}

            <div className="menu-intro-visual">

              <div className="menu-image-decoration"></div>

              <motion.div
                className="menu-feature-image"
                initial={{
                  opacity: 0,
                  x: 30,
                  rotate: 4,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  rotate: 0,
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=85"
                  alt="Fresh healthy salad bowl"
                  loading="lazy"
                />
              </motion.div>

              {/* Floating badge */}

              <motion.div
                className="menu-image-badge"
                animate={{
                  y: [0, -7, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span className="badge-leaf">
                  <Leaf size={19} />
                </span>

                <div>
                  <strong>Eat fresh</strong>
                  <small>Live healthy</small>
                </div>
              </motion.div>

              <div className="menu-image-circle"></div>

            </div>

          </div>
        </Reveal>

        {/* =================================
            DAY SELECTOR
        ================================= */}

        <div className="day-strip">
          {days.map((d, i) => (
            <button
              key={d.day}
              className={`day-pill ${
                i === activeDayIndex ? 'active' : ''
              }`}
              onClick={() => setActiveDayIndex(i)}
            >
              {i === activeDayIndex && (
                <motion.span
                  className="day-pill-bg"
                  layoutId="dayPillBg"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 32,
                  }}
                />
              )}

              <span className="d-num">
                {String(d.day).padStart(2, '0')}
              </span>

              <span className="d-label">
                {d.label}
              </span>
            </button>
          ))}
        </div>

        {/* =================================
            MEAL CARDS
        ================================= */}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeDayIndex}
            className="meal-grid"
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -16,
            }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {meals.map((meal, index) => {
              const cat = CATEGORY[meal.category];

              return (
                <motion.article
                  className={`meal-card meal-card-${index + 1}`}
                  key={meal.key}
                  whileHover={{
                    y: -7,
                    transition: {
                      duration: 0.3,
                    },
                  }}
                >

                  {/* Food image */}

                  <div className="dish-photo">
                    <motion.img
                      src={meal.image}
                      alt={meal.name}
                      loading="lazy"
                      whileHover={{
                        scale: 1.06,
                      }}
                      transition={{
                        duration: 0.5,
                      }}
                    />

                    <span className="photo-badge">
                      {day.label}
                    </span>

                    {cat && (
                      <span
                        className="category-badge"
                        style={{
                          background: cat.color,
                        }}
                      >
                        {cat.label}
                      </span>
                    )}
                  </div>

                  {/* Floating price */}

                  <div className="meal-price-badge">
                    <small>Starting</small>
                    <strong>₹{meal.price}</strong>
                    <span>/meal</span>
                  </div>

                  {/* Meal details */}

                  <div className="meal-body">

                    <div className="meal-top">
                      <h3>{meal.name}</h3>

                      {meal.protein && (
                        <span className="meal-tag">
                          Protein choice
                        </span>
                      )}
                    </div>

                    {/* Rating */}

                    <div className="meal-rating">
                      <span className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={17}
                            fill="currentColor"
                            strokeWidth={1.5}
                          />
                        ))}
                      </span>

                      <span className="rating-value">
                        4.5
                      </span>
                    </div>

                    {/* Original menu items */}

                    <ul className="item-list">
                      {meal.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>

                    {/* Price and order */}

                    <div className="meal-bottom">

                      <div className="price">
                        ₹{meal.price}
                        <span>/ </span>
                        <small>With delivery charge</small>
                      </div>

                      <motion.button
                        className="btn-order"
                        whileHover={{
                          y: -2,
                        }}
                        whileTap={{
                          scale: 0.95,
                        }}
                        onClick={() =>
                          placeOrder(day, meal.key)
                        }
                      >
                        Order now
                        <span aria-hidden="true"> →</span>
                      </motion.button>

                    </div>

                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* =================================
            CANCELLATION POLICY
        ================================= */}

        <Reveal delay={0.1}>
          <div className="policy-note">

            <span
              className="policy-icon"
              aria-hidden="true"
            >
              ⓘ
            </span>

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