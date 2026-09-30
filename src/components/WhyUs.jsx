
import { motion } from 'framer-motion';
import { Salad, Bike, ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import { WhatsAppIcon } from './BrandIcons';

const FEATURES = [
  {
    Icon: Salad,
    title: 'Freshly cooked daily',
    text: "Nothing pre-made or frozen — each box is cooked the same day it's delivered.",
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85',
    number: '01',
    tag: 'FRESH & HEALTHY',
  },
  {
    Icon: Bike,
    title: 'Doorstep delivery',
    text: 'Delivered straight to your address, on schedule, every day of the week.',
    image:
      'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=900&q=85',
    number: '02',
    tag: 'RIGHT TO YOUR DOOR',
  },
  {
    Icon: WhatsAppIcon,
    title: 'Order on WhatsApp',
    text: 'Pick your day and meal, tap once, and send — no app or sign-up needed.',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85',
    number: '03',
    tag: 'SIMPLE & QUICK',
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function WhyUs() {
  return (
    <section className="section why-section" id="why-us">
      <div className="wrap">

        <Reveal>
          <div className="sec-head why-heading">
            <span className="why-eyebrow">
              WHY CHOOSE US
            </span>

            <h2>Why consciouscravings</h2>

            <p>
              What every meal box comes with, every single day.
            </p>
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
            <motion.article
              key={f.title}
              className="feature-card"
              variants={item}
              whileHover={{
                y: -9,
                transition: { duration: 0.3 },
              }}
            >
              {/* Image area */}
              <div className="feature-image-wrap">

                <img
                  src={f.image}
                  alt={f.title}
                  className="feature-image"
                  loading="lazy"
                />

                <div className="feature-image-overlay" />

                <span className="feature-number">
                  {f.number}
                </span>

                <span className="feature-tag">
                  {f.tag}
                </span>

                <div className="feature-icon">
                  <f.Icon size={23} strokeWidth={2} />
                </div>

              </div>

              {/* Card content */}
              <div className="feature-content">

                <h3>{f.title}</h3>

                <p>{f.text}</p>

                <div className="feature-bottom">
                  <span className="feature-line" />

                  <motion.span
                    className="feature-arrow"
                    whileHover={{ x: 4, y: -4 }}
                  >
                    <ArrowUpRight size={19} />
                  </motion.span>
                </div>

              </div>
            </motion.article>
          ))}
        </motion.div>

      </div>
    </section>
  );
}