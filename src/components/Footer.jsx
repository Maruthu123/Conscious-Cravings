import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowUp } from 'lucide-react';
import { WhatsAppIcon, InstagramIcon } from './BrandIcons';
import {
  whatsappLink,
  instagramLink,
  phoneLink,
  BUSINESS
} from '../lib/business';

const QUICK_LINKS = [
  { id: 'menu', label: 'Menu' },
  { id: 'about', label: 'About' },
  { id: 'follow', label: 'Follow us' },
  { id: 'contact', label: 'Contact' },
];

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  function goTo(id) {
    if (location.pathname === '/') {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  }

  function scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  return (
    <footer className="site-footer">

      <div className="wrap foot-grid">

        {/* Brand */}
        <div className="foot-col foot-brand-col">

          <div className="foot-brand">
            <img
              src="/logo.png"
              alt={`${BUSINESS.name} logo`}
              className="foot-logo"
            />

            <h3>{BUSINESS.name}</h3>
          </div>

          <p className="foot-tagline">
            Home-style tiffin, planned by the week — cooked fresh and
            delivered daily in {BUSINESS.city}.
          </p>

          <div className="foot-social-row">

            {/* WhatsApp */}
            <a
              className="foot-social-btn foot-social-wa"
              href={whatsappLink(
                `Hi ${BUSINESS.name}! I'd like to know today's menu.`
              )}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat with us on WhatsApp"
            >
              <WhatsAppIcon size={19} />
            </a>

            {/* Instagram */}
            <a
              className="foot-social-btn foot-social-insta"
              href={instagramLink()}
              target="_blank"
              rel="noreferrer"
              aria-label="Follow us on Instagram"
            >
              <InstagramIcon size={19} />
            </a>

          </div>
        </div>


        {/* Quick Links */}
        <div className="foot-col">

          <h3>Quick links</h3>

          {QUICK_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => {
                e.preventDefault();
                goTo(l.id);
              }}
            >
              {l.label}
            </a>
          ))}

          <Link to="/account">
            My Orders
          </Link>

        </div>


        {/* Reach Us */}
        <div className="foot-col">

          <h3>Reach us</h3>

          {/* Address */}
          <div className="foot-info-row">
            <MapPin
              size={16}
              className="foot-info-icon"
            />

            <span>
              {BUSINESS.address[0]}
              <br />
              {BUSINESS.address[1]}
            </span>
          </div>


          {/* Phone */}
          <div className="foot-info-row">

            <Phone
              size={16}
              className="foot-info-icon"
            />

            <a href={phoneLink()}>
              {BUSINESS.phoneDisplay}
            </a>

          </div>


          {/* WhatsApp */}
          <div className="foot-info-row">

            <WhatsAppIcon size={16} />

            <a
              href={whatsappLink(
                `Hi ${BUSINESS.name}! I'd like to know today's menu.`
              )}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp us
            </a>

          </div>


          {/* Instagram */}
          <div className="foot-info-row">

            <InstagramIcon
              size={16}
              className="foot-info-icon"
            />

            <a
              href={instagramLink()}
              target="_blank"
              rel="noreferrer"
            >
              @{BUSINESS.instagram}
            </a>

          </div>


          {/* Hours */}
          <div className="foot-info-row">

            <Clock
              size={16}
              className="foot-info-icon"
            />

            <span>
              {BUSINESS.hours}
            </span>

          </div>

        </div>


        {/* Policy */}
        <div className="foot-col">

          <h3>Policy</h3>

          <p>
            Free cancellation and full refund within 2 hours of
            ordering. No cancellations after that.
          </p>

        </div>

      </div>


      {/* Bottom */}
      <div className="wrap foot-bottom">

        <span>
          © {new Date().getFullYear()} {BUSINESS.name} · {BUSINESS.city}
        </span>

        <span>
          Designed & Developed by{' '}
          <strong>Nexora Solutions</strong>
        </span>

        <button
          className="foot-top-btn"
          onClick={scrollTop}
          aria-label="Back to top"
        >
          <ArrowUp size={16} />
        </button>

      </div>

    </footer>
  );
}