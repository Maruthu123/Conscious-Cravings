import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { whatsappLink, BUSINESS } from '../lib/business';

const NAV_LINKS = [
  { id: 'menu', label: 'Menu' },
  { id: 'about', label: 'About' },
  { id: 'follow', label: 'Follow us' },
  { id: 'contact', label: 'Contact' },
];

export default function Header() {
  const { user, isAdmin, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  function goTo(id) {
    setOpen(false);
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  }

  return (
    <header className="site-header">
      <div className="wrap header-bar">
       <Link to="/" className="brand" onClick={() => setOpen(false)}>
  <img
    src="/logo.png"
    alt={`${BUSINESS.name} Logo`}
    className="brand-logo"
  />
  <span className="brand-name">{BUSINESS.name}</span>
</Link>

        <nav className={`site-nav ${open ? 'mobile-open' : ''}`}>
          {NAV_LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="nav-link" onClick={(e) => { e.preventDefault(); goTo(l.id); }}>
              {l.label}
            </a>
          ))}
          <span className="auth-nav">
            {!user && <Link to="/login" onClick={() => setOpen(false)}>Login</Link>}
            {user && (
              <>
                <Link to="/account" onClick={() => setOpen(false)}>My Orders</Link>
                {isAdmin && <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>}
                <a href="#" onClick={(e) => { e.preventDefault(); setOpen(false); logOut(); }}>Logout</a>
              </>
            )}
          </span>
        </nav>

        <a
          className="btn-whatsapp-pill"
          href={whatsappLink(`Hi ${BUSINESS.name}! I'd like to know today's menu.`)}
          target="_blank"
          rel="noreferrer"
        >
          <span className="wa-dot" />
          Order on WhatsApp
        </a>

        <button
          className="mobile-nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
        </button>
      </div>
    </header>
  );
}
