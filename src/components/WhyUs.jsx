import { motion } from 'framer-motion';
import { Salad, Bike } from 'lucide-react';
import Reveal from './Reveal';
import { WhatsAppIcon } from './BrandIcons';

const FEATURES = [
  { Icon: Salad, title: 'Freshly cooked daily', text: "Nothing pre-made or frozen — each box is cooked the same day it's delivered." },
  { Icon: Bike, title: 'Doorstep delivery', text: 'Delivered straight to your address, on schedule, every day of the week.' },
  { Icon: WhatsAppIcon, title: 'Order on WhatsApp', text: 'Pick your day and meal, tap once, and send — no app or sign-up needed.' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function WhyUs() {
  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <h2>Why consciouscravings</h2>
            <p>What every meal box comes with, every single day.</p>
          </div>
        </Reveal>

        <motion.div
          className="feature-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              className="feature-card"
              variants={item}
              whileHover={{ y: -6, boxShadow: '0 16px 30px rgba(60,30,18,0.16)' }}
            >
              <div className="feature-icon">
                <f.Icon size={24} strokeWidth={2} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
