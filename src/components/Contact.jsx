import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Clock, ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import { WhatsAppIcon, InstagramIcon } from './BrandIcons';
import { whatsappLink, instagramLink, phoneLink, BUSINESS } from '../lib/business';

export default function Contact() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const text = `Hi ${BUSINESS.name}!\n\nName: ${name}\nPhone: ${phone}\nMessage: ${msg}`;
    window.open(whatsappLink(text), '_blank', 'noreferrer');
    setSuccess(true);
    setName('');
    setPhone('');
    setMsg('');
  }

  return (
    <section id="contact" className="section">
      <div className="wrap contact-grid">
        <Reveal y={0}>
          <div className="contact-info">
            <h2>Get in touch</h2>
            <p className="contact-lede">Questions about an order, delivery area, or the menu — reach us any time.</p>

            <div className="cinfo-row">
              <span className="cinfo-icon"><MapPin size={18} /></span>
              <div>{BUSINESS.address[0]}<br />{BUSINESS.address[1]}</div>
            </div>
            <div className="cinfo-row">
              <span className="cinfo-icon"><Phone size={18} /></span>
              <a href={phoneLink()}>{BUSINESS.phoneDisplay}</a>
            </div>
            <div className="cinfo-row">
              <span className="cinfo-icon"><Clock size={18} /></span>
              <div>{BUSINESS.hours}</div>
            </div>

            {/* WhatsApp + Instagram get their own bold cards — these are
                our two busiest contact channels, so they're highlighted
                rather than buried in the plain info rows above. */}
            <div className="cinfo-highlight-row">
              <motion.a
                className="cinfo-highlight cinfo-highlight-wa"
                href={whatsappLink(`Hi ${BUSINESS.name}! I'd like to know today's menu.`)}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="cinfo-highlight-icon"><WhatsAppIcon size={22} /></span>
                <span className="cinfo-highlight-text">
                  <strong>Chat on WhatsApp</strong>
                  <small>Fastest way to reach us</small>
                </span>
                <ArrowUpRight size={16} className="cinfo-highlight-arrow" />
              </motion.a>

              <motion.a
                className="cinfo-highlight cinfo-highlight-insta"
                href={instagramLink()}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="cinfo-highlight-icon"><InstagramIcon size={20} /></span>
                <span className="cinfo-highlight-text">
                  <strong>@{BUSINESS.instagram}</strong>
                  <small>Daily menu &amp; kitchen moments</small>
                </span>
                <ArrowUpRight size={16} className="cinfo-highlight-arrow" />
              </motion.a>
            </div>
          </div>
        </Reveal>

        <Reveal y={0} delay={0.1}>
          <form className="contact-form" onSubmit={handleSubmit}>
            <p className="form-note">Sends straight to our WhatsApp — no waiting on email.</p>
            <div className="field">
              <label htmlFor="cName">Your name</label>
              <input id="cName" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="cPhone">Phone number</label>
              <input id="cPhone" type="tel" maxLength={10} inputMode="numeric" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="cMsg">Message</label>
              <textarea id="cMsg" placeholder="How can we help?" required value={msg} onChange={(e) => setMsg(e.target.value)} />
            </div>
            <motion.button className="btn-primary" style={{ width: '100%' }} type="submit" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              Send on WhatsApp
            </motion.button>
            <AnimatePresence>
              {success && (
                <motion.p
                  className="form-success"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Opened WhatsApp with your message — just hit send there.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
