import { motion } from 'framer-motion';
import { whatsappLink, BUSINESS } from '../lib/business';
import heroPhoto from '../assets/images/hero-salad.jpg';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="wrap hero-grid">
        <motion.div className="hero-text" variants={container} initial="hidden" animate="show">
          <motion.p className="kicker" variants={item}>Home-style tiffin, planned by the week</motion.p>
          <motion.h1 variants={item}>
            A fresh, balanced meal box — every day looks a little different.
          </motion.h1>
          <motion.p className="lede" variants={item}>
            {BUSINESS.name} cooks a rotating five-day menu — salads, grains, one protein
            of your choice, and a drink or dessert with every meal, delivered to your
            door in {BUSINESS.city}.
          </motion.p>
          <motion.div className="hero-actions" variants={item}>
            <motion.a
              className="btn-primary"
              href={whatsappLink(`Hi ${BUSINESS.name}! I'd like to know today's menu.`)}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Order on WhatsApp
            </motion.a>
            <motion.a
              className="btn-ghost"
              href="#menu"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              See this week's menu
            </motion.a>
          </motion.div>
          <motion.div className="hero-stats" variants={item}>
            <div><strong>6</strong>days on rotation</div>
            <div><strong>2</strong>meals a day</div>
            <div><strong>2 hr</strong>free cancellation</div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-art"
          initial={{ opacity: 0, scale: 0.9, x: 24 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="tiffin-seal">Fresh<br />Today</div>
          <motion.img
            className="hero-photo"
            src={heroPhoto}
            alt={`${BUSINESS.name} tiffin meal box`}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
