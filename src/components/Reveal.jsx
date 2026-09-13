import { motion } from 'framer-motion';

// Small reusable wrapper: fades + slides an element in once it scrolls
// into view. Keeps every section's "appear" animation consistent.
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.55,
  as: Component = motion.div,
  className,
  style,
  once = true,
}) {
  return (
    <Component
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
