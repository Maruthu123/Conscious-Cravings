
import { motion } from 'framer-motion';
import { whatsappLink, BUSINESS } from '../lib/business';

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const heroPhoto =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=90';

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="wrap hero-grid">

        {/* LEFT: FOOD IMAGE */}
        <motion.div
          className="hero-art"
          initial={{ opacity: 0, scale: 0.9, x: -30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="hero-image-glow" />

          <div className="hero-food-decoration decoration-one">
            ✦
          </div>

          <div className="hero-food-decoration decoration-two">
            ✦
          </div>

          <motion.div
            className="hero-photo-frame"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <img
              className="hero-photo"
              src={heroPhoto}
              alt={`${BUSINESS.name} healthy meal`}
            />
          </motion.div>

          <div className="hero-fresh-badge">
            <span className="fresh-icon">✳</span>
            <span>
              Fresh
              <br />
              <strong>Today</strong>
            </span>
          </div>

          <div className="hero-leaf leaf-one">🌿</div>
          <div className="hero-leaf leaf-two">🌿</div>
        </motion.div>

        {/* RIGHT: HERO CONTENT */}
        <motion.div
          className="hero-text"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.p className="kicker" variants={item}>
            Healthy eating, made simple
          </motion.p>

          <motion.h1 variants={item}>
            Fresh Meals.
            <br />
            <span>Better Living.</span>
          </motion.h1>

          <motion.p className="hero-subtitle" variants={item}>
            Healthy Meal Plans | {BUSINESS.city}
          </motion.p>

          <motion.div className="hero-rating" variants={item}>
            <span className="rating-stars">★★★★★</span>
            <strong>4.9</strong>
            <span className="rating-label">
              Healthy choices, happy customers
            </span>
          </motion.div>

          <motion.div className="hero-description" variants={item}>
            Nutritious, balanced and delicious meals designed
            around your goals. Enjoy fresh ingredients, wholesome
            flavours and convenient delivery right to your door.
          </motion.div>

          <motion.div className="hero-actions" variants={item}>
            <motion.a
              className="btn-primary"
              href={whatsappLink(
                `Hi ${BUSINESS.name}! I'd like to know today's menu.`
              )}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              Order Now →
            </motion.a>

            <motion.a
              className="btn-ghost"
              href="#menu"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById('menu')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Menu
            </motion.a>
          </motion.div>

          <motion.div className="hero-stats" variants={item}>
            <div>
              <strong>Fresh</strong>
              <span>Daily ingredients</span>
            </div>

            <div>
              <strong>Healthy</strong>
              <span>Balanced meals</span>
            </div>

            <div>
              <strong>Easy</strong>
              <span>Doorstep delivery</span>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}