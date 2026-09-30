
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Heart,
  Leaf,
} from 'lucide-react';

import Reveal from './Reveal';
import { instagramLink, BUSINESS } from '../lib/business';

// Custom Instagram icon
// Avoids lucide-react Instagram export error
function InstagramIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
      />
      <circle
        cx="18"
        cy="6"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

// Healthy food image gallery
const PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85',
    title: 'Fresh & Balanced',
    category: 'Healthy meals',
    className: 'insta-photo-large',
  },
  {
    src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=85',
    title: 'Eat Clean',
    category: 'Daily nutrition',
    className: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=700&q=85',
    title: 'Power Your Day',
    category: 'Meal prep',
    className: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85',
    title: 'Naturally Good',
    category: 'Fresh ingredients',
    className: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=700&q=85',
    title: 'Fuel Your Fitness',
    category: 'Protein meals',
    className: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=700&q=85',
    title: 'Fresh Every Day',
    category: 'Healthy lifestyle',
    className: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1547592180-67b5a0f4e3d2?auto=format&fit=crop&w=700&q=85',
    title: 'Good Food, Good Mood',
    category: 'Balanced eating',
    className: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=700&q=85',
    title: 'Made With Care',
    category: 'Fresh kitchen',
    className: '',
  },
];

// Animation settings
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function InstagramSection() {
  return (
    <section
      id="follow"
      className="section instagram-section"
    >
      <div className="wrap">

        {/* Section heading */}

        <Reveal>
          <div className="insta-heading">

            <span className="insta-eyebrow">
              <Leaf size={15} />
              FROM OUR KITCHEN
            </span>

            <h2>
              A little taste of
              <span> healthy living.</span>
            </h2>

            <p>
              We post the day's menu and behind-the-kitchen moments every morning.
            </p>

          </div>
        </Reveal>

        {/* Food gallery */}

        <motion.div
          className="insta-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.15,
          }}
        >
          {PHOTOS.map((photo) => (
            <motion.a
              key={photo.title}
              href={instagramLink()}
              target="_blank"
              rel="noreferrer"
              className={`insta-photo ${photo.className}`}
              variants={item}
              whileHover={{
                y: -6,
              }}
              aria-label={`View ${photo.title} on Instagram`}
            >

              <img
                src={photo.src}
                alt={photo.title}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.opacity = '0';
                }}
              />

              <div className="insta-photo-overlay">

                <div className="insta-photo-info">
                  <span>{photo.category}</span>
                  <h3>{photo.title}</h3>
                </div>

                <span className="insta-photo-icon">
                  <ArrowUpRight size={19} />
                </span>

              </div>

              <span className="insta-heart">
                <Heart size={17} />
              </span>

            </motion.a>
          ))}
        </motion.div>

        {/* Instagram follow section */}

        <Reveal delay={0.15}>
          <div className="insta-bottom">

            <div className="insta-bottom-text">

              <span className="insta-bottom-icon">
                <InstagramIcon size={22} />
              </span>

              <div>
                <h3>Join our healthy food journey</h3>

                <p>
                  Follow us for daily menus, fresh meals and kitchen stories.
                </p>
              </div>

            </div>

            <motion.a
              className="btn-instagram"
              href={instagramLink()}
              target="_blank"
              rel="noreferrer"
              whileHover={{
                y: -3,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              <InstagramIcon size={18} />

              Follow @{BUSINESS.instagram}

              <ArrowUpRight size={16} />
            </motion.a>

          </div>
        </Reveal>

      </div>
    </section>
  );
}