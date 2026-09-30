
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  Clock,
  ArrowUpRight,
  Send,
  MessageCircle,
  CheckCircle2,
  Utensils,
} from 'lucide-react';

import Reveal from './Reveal';
import { WhatsAppIcon, InstagramIcon } from './BrandIcons';
import {
  whatsappLink,
  instagramLink,
  phoneLink,
  BUSINESS,
} from '../lib/business';

export default function Contact() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit phone number.');
      setSuccess(false);
      return;
    }

    if (!name.trim() || !msg.trim()) {
      setError('Please fill in all the required fields.');
      setSuccess(false);
      return;
    }

    const text = `Hi ${BUSINESS.name}!

Name: ${name.trim()}
Phone: ${cleanPhone}
Message: ${msg.trim()}`;

    const whatsappUrl = whatsappLink(text);

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setSuccess(true);
    setError('');
    setName('');
    setPhone('');
    setMsg('');
  }

  return (
    <section id="contact" className="section contact-section">
      <div className="wrap">

        {/* SECTION HEADING */}
        <Reveal y={20}>
          <div className="contact-heading">
            <span className="contact-eyebrow">
              <span className="contact-eyebrow-dot" />
              WE'RE HERE FOR YOU
            </span>

            <h2>
              Let's talk about
              <span> good food.</span>
            </h2>

            <p>
              Have a question or craving something delicious?
              We'd love to hear from you.
            </p>
          </div>
        </Reveal>

        <div className="contact-grid">

          {/* LEFT CONTACT INFORMATION */}
          <Reveal y={25}>
            <div className="contact-info">

              <div className="contact-info-top">
                <div className="contact-info-icon">
                  <Utensils size={23} />
                </div>

                <span className="contact-info-tag">
                  CONTACT US
                </span>
              </div>

              <h3>
                Good food starts with a conversation.
              </h3>

              <p className="contact-lede">
                Questions about an order, delivery area, or the menu —
                reach us any time. We're always happy to help.
              </p>

              <div className="contact-divider" />

              {/* ADDRESS */}
              <div className="cinfo-row">
                <span className="cinfo-icon">
                  <MapPin size={19} />
                </span>

                <div className="cinfo-details">
                  <small>Our Location</small>
                  <strong>
                    {BUSINESS.address[0]}
                    <br />
                    {BUSINESS.address[1]}
                  </strong>
                </div>
              </div>

              {/* PHONE */}
              <div className="cinfo-row">
                <span className="cinfo-icon">
                  <Phone size={19} />
                </span>

                <div className="cinfo-details">
                  <small>Call Us</small>
                  <a href={phoneLink()}>
                    {BUSINESS.phoneDisplay}
                  </a>
                </div>
              </div>

              {/* HOURS */}
              <div className="cinfo-row">
                <span className="cinfo-icon">
                  <Clock size={19} />
                </span>

                <div className="cinfo-details">
                  <small>Working Hours</small>
                  <strong>{BUSINESS.hours}</strong>
                </div>
              </div>

              {/* WHATSAPP AND INSTAGRAM */}
              <div className="cinfo-highlight-row">

                <motion.a
                  className="cinfo-highlight cinfo-highlight-wa"
                  href={whatsappLink(
                    `Hi ${BUSINESS.name}! I'd like to know today's menu.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="cinfo-highlight-icon">
                    <WhatsAppIcon size={23} />
                  </span>

                  <span className="cinfo-highlight-text">
                    <strong>Chat on WhatsApp</strong>
                    <small>Fastest way to reach us</small>
                  </span>

                  <ArrowUpRight
                    size={18}
                    className="cinfo-highlight-arrow"
                  />
                </motion.a>

                <motion.a
                  className="cinfo-highlight cinfo-highlight-insta"
                  href={instagramLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="cinfo-highlight-icon">
                    <InstagramIcon size={21} />
                  </span>

                  <span className="cinfo-highlight-text">
                    <strong>@{BUSINESS.instagram}</strong>
                    <small>Daily menu &amp; kitchen moments</small>
                  </span>

                  <ArrowUpRight
                    size={18}
                    className="cinfo-highlight-arrow"
                  />
                </motion.a>

              </div>

              <div className="contact-bottom-note">
                <span className="contact-bottom-icon">
                  <HeartIcon />
                </span>
                <span>Made with care, served with love.</span>
              </div>

              {/* DECORATIVE ELEMENTS */}
              <div className="contact-decor contact-decor-one" />
              <div className="contact-decor contact-decor-two" />

            </div>
          </Reveal>

          {/* RIGHT CONTACT FORM */}
          <Reveal y={25} delay={0.12}>
            <div className="contact-form-wrap">

              <div className="contact-form-heading">
                <div>
                  <span className="form-eyebrow">
                    SEND US A MESSAGE
                  </span>

                  <h3>How can we help?</h3>

                  <p>
                    Fill in the details below and we'll connect
                    with you on WhatsApp.
                  </p>
                </div>

                <div className="form-heading-icon">
                  <MessageCircle size={23} />
                </div>
              </div>

              <form
                className="contact-form"
                onSubmit={handleSubmit}
              >

                {/* NAME */}
                <div className="field">
                  <label htmlFor="cName">
                    Your name <span>*</span>
                  </label>

                  <input
                    id="cName"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                  />
                </div>

                {/* PHONE */}
                <div className="field">
                  <label htmlFor="cPhone">
                    Phone number <span>*</span>
                  </label>

                  <div className="phone-input-wrap">
                    <span className="phone-prefix">+91</span>

                    <input
                      id="cPhone"
                      type="tel"
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                      inputMode="numeric"
                      autoComplete="tel-national"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(
                          e.target.value.replace(/\D/g, '').slice(0, 10)
                        );
                        setError('');
                      }}
                    />
                  </div>
                </div>

                {/* MESSAGE */}
                <div className="field">
                  <label htmlFor="cMsg">
                    Your message <span>*</span>
                  </label>

                  <textarea
                    id="cMsg"
                    placeholder="Tell us what you're looking for..."
                    rows={5}
                    required
                    value={msg}
                    onChange={(e) => {
                      setMsg(e.target.value);
                      setError('');
                    }}
                  />
                </div>

                {/* ERROR MESSAGE */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      className="form-error"
                      role="alert"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* SUBMIT BUTTON */}
                <motion.button
                  className="btn-primary contact-submit"
                  type="submit"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Send on WhatsApp</span>
                  <Send size={17} />
                </motion.button>

                <p className="form-note">
                  <WhatsAppIcon size={15} />
                  Opens WhatsApp with your message ready to send.
                </p>

                {/* SUCCESS MESSAGE */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      className="form-success"
                      role="status"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <CheckCircle2 size={19} />

                      <span>
                        WhatsApp opened with your message.
                        Just hit send there!
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

              </form>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}

/* CUSTOM HEART ICON */
function HeartIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  );
}