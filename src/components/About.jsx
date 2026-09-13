import { motion } from 'framer-motion';

const PILLS = ['🌿 Fresh ingredients', '🍱 Balanced meals', '📦 Hygienically packed', '🕑 On-time delivery'];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="wrap about-grid">
        <motion.div
          style={{ flex: 1, minWidth: 300 }}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <p className="kicker">About us</p>
          <h2>Home-style food, made the way your family would make it.</h2>
          <p className="about-copy">
            consciouscravings is a home-style tiffin service based in Dindigul. We put
            together a rotating five-day menu — salads, rice or grains, a protein of your
            choice, and a drink or dessert — so every meal stays balanced without getting
            repetitive. Everything is cooked fresh and packed the same day it reaches you.
          </p>
          <div className="value-pills">
            {PILLS.map((p, i) => (
              <motion.span
                key={p}
                className="value-pill"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
              >
                {p}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="about-art"
          initial={{ opacity: 0, scale: 0.85, x: 30 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <img
            className="about-photo"
            src="https://images.pexels.com/photos/31199041/pexels-photo-31199041/free-photo-of-traditional-south-indian-idli-with-sambar-and-chutney.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Home-style meal cooked by consciouscravings"
          />
        </motion.div>
      </div>
    </section>
  );
}
