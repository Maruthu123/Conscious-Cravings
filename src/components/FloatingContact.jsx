import { motion } from 'framer-motion';
import { WhatsAppIcon, InstagramIcon } from './BrandIcons';
import { whatsappLink, instagramLink, BUSINESS } from '../lib/business';

export default function FloatingContact() {
  return (
    <div className="floating-contact" role="complementary" aria-label="Quick contact">
      <motion.a
        className="fab fab-instagram"
        href={instagramLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Follow us on Instagram"
        whileHover={{ scale: 1.08 }}
      >
        <span className="fab-ring fab-ring-insta" />
        <span className="fab-icon"><InstagramIcon size={24} color="#fff" /></span>
        <span className="fab-tooltip">Follow us</span>
      </motion.a>
      <motion.a
        className="fab fab-whatsapp"
        href={whatsappLink(`Hi ${BUSINESS.name}! I'd like to know today's menu.`)}
        target="_blank"
        rel="noreferrer"
        aria-label="Message us on WhatsApp"
        whileHover={{ scale: 1.08 }}
      >
        <span className="fab-ring fab-ring-wa" />
        <span className="fab-icon"><WhatsAppIcon size={24} color="#fff" /></span>
        <span className="fab-tooltip">Order on WhatsApp</span>
      </motion.a>
    </div>
  );
}
