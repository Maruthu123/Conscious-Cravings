import { motion } from 'framer-motion';
import Reveal from './Reveal';
import { instagramLink, BUSINESS } from '../lib/business';

// Same real, working Pexels photo set already used across the menu/about
// sections (see src/lib/menuData.js) — reused here so every image is one
// that's already verified to load, just gathered into a bigger, livelier
// grid for this section.
const PHOTOS = [
  'https://images.pexels.com/photos/31199041/pexels-photo-31199041/free-photo-of-traditional-south-indian-idli-with-sambar-and-chutney.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/35041879/pexels-photo-35041879/free-photo-of-delicious-indian-sweets-and-savory-dishes-display.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/34159109/pexels-photo-34159109/free-photo-of-traditional-kerala-chicken-biryani-in-clay-pot.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3872373/pexels-photo-3872373.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/34159112/pexels-photo-34159112/free-photo-of-traditional-indian-chicken-curry-and-rice.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4331489/pexels-photo-4331489.jpeg?auto=compress&cs=tinysrgb&w=800',
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function InstagramSection() {
  return (
    <section id="follow" className="section instagram-section">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <h2>Today's tiffin, on Instagram</h2>
            <p>We post the day's menu and behind-the-kitchen moments every morning.</p>
          </div>
        </Reveal>

        <motion.div
          className="insta-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {PHOTOS.map((src, i) => (
            <motion.div key={i} className="dish-photo" variants={item} whileHover={{ scale: 1.04 }}>
              <img src={src} alt="consciouscravings" loading="lazy" />
            </motion.div>
          ))}
        </motion.div>

        <div className="insta-follow-row">
          <motion.a
            className="btn-instagram"
            href={instagramLink()}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="insta-ring" />
            Follow @{BUSINESS.instagram}
          </motion.a>
        </div>
      </div>
    </section>
  );
}
