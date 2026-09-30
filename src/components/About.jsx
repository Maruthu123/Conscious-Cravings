
import { motion } from 'framer-motion';
import { Leaf, Heart, PackageCheck, Clock3, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    description: 'Freshly sourced ingredients for every meal.',
  },
  {
    icon: Heart,
    title: 'Balanced Meals',
    description: 'Nutritious food made for everyday wellness.',
  },
  {
    icon: PackageCheck,
    title: 'Hygienically Packed',
    description: 'Prepared and packed with care.',
  },
  {
    icon: Clock3,
    title: 'On-time Delivery',
    description: 'Fresh meals delivered right to your doorstep.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
};

export default function About() {
  return (
    <section id="about" className="section about-section">
      <div className="wrap about-grid">

        {/* LEFT CONTENT */}
        <motion.div
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={itemVariants}>
            <span className="about-label">
              <span className="about-label-dot" />
              ABOUT CONSCIOUS CRAVINGS
            </span>
          </motion.div>

          <motion.h2 variants={itemVariants}>
            Home-style food,
            <span className="about-heading-highlight">
              {' '}made with love.
            </span>
          </motion.h2>

          <motion.p className="about-copy" variants={itemVariants}>
            consciouscravings is a home-style tiffin service based in Dindigul.
            We put together a rotating five-day menu — salads, rice or grains,
            a protein of your choice, and a drink or dessert — so every meal
            stays balanced without getting repetitive. Everything is cooked
            fresh and packed the same day it reaches you.
          </motion.p>

          <motion.div
            className="about-features"
            variants={containerVariants}
          >
            {FEATURES.map((feature) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  className="about-feature"
                  key={feature.title}
                  variants={itemVariants}
                >
                  <div className="about-feature-icon">
                    <Icon size={19} strokeWidth={1.8} />
                  </div>

                  <div className="about-feature-text">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.a
            href="#menu"
            className="about-cta"
            variants={itemVariants}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.97 }}
          >
            Explore our menu
            <ArrowRight size={17} />
          </motion.a>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          className="about-art"
          initial={{ opacity: 0, scale: 0.92, x: 30 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        >
          <div className="about-image-frame">
            <img
              className="about-photo"
              src="https://images.pexels.com/photos/31199041/pexels-photo-31199041/free-photo-of-traditional-south-indian-idli-with-sambar-and-chutney.jpeg?auto=compress&cs=tinysrgb&w=1000"
              alt="Fresh home-style South Indian idli with sambar and chutney"
              loading="lazy"
            />

            <div className="about-image-badge">
              <span className="about-badge-icon">
                <Leaf size={20} />
              </span>
              <div>
                <strong>Made Fresh</strong>
                <span>With love, every day</span>
              </div>
            </div>
          </div>

          <div className="about-decor about-decor-one" />
          <div className="about-decor about-decor-two" />
        </motion.div>

      </div>
    </section>
  );
}